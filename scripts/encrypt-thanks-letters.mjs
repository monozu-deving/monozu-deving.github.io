import { createCipheriv, createHmac, pbkdf2Sync, randomBytes } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = path.join(root, "_private_letters");
const outputFile = path.join(root, "assets", "data", "thanks-letters.json");
const iterations = 310_000;
const additionalData = Buffer.from("thanks-for-rcv:v1", "utf8");

function parseScalar(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return JSON.parse(trimmed);
  }

  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  return trimmed;
}

function parseLetter(source, filename) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${filename}: YAML front matter가 없습니다.`);

  const metadata = {};
  let arrayKey = null;

  for (const rawLine of match[1].split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;

    const arrayItem = rawLine.match(/^\s+-\s+(.+)$/);
    if (arrayItem && arrayKey) {
      metadata[arrayKey].push(parseScalar(arrayItem[1]));
      continue;
    }

    const property = rawLine.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!property) {
      throw new Error(`${filename}: 지원하지 않는 front matter 문법이 있습니다.`);
    }

    const [, key, value] = property;
    if (!value.trim()) {
      metadata[key] = [];
      arrayKey = key;
    } else {
      metadata[key] = parseScalar(value);
      arrayKey = null;
    }
  }

  const required = ["title", "recipient", "code", "from", "date"];
  for (const key of required) {
    if (!metadata[key]) throw new Error(`${filename}: '${key}' 값이 필요합니다.`);
  }

  const code = String(metadata.code).trim().normalize("NFKC");
  if (/REPLACE|PLACEHOLDER|EXAMPLE|SAMPLE|CHANGE[-_ ]?ME/i.test(code) || code.length < 24) {
    throw new Error(`${filename}: 예시 코드를 24자 이상의 무작위 개인 코드로 교체하세요.`);
  }

  return {
    metadata,
    code,
    body: match[2].trim()
  };
}

function normalizeName(value) {
  return String(value)
    .normalize("NFC")
    .toLocaleLowerCase("ko-KR")
    .replace(/[\s\-_.]/g, "");
}

function isTruthy(value) {
  return value === true || String(value).trim().toLowerCase() === "true";
}

function lookupHash(value, code) {
  return createHmac("sha256", code).update(normalizeName(value), "utf8").digest("hex");
}

function encryptLetter(parsed) {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = pbkdf2Sync(parsed.code, salt, iterations, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(additionalData);

  const payload = JSON.stringify({
    title: parsed.metadata.title,
    recipient: parsed.metadata.recipient,
    from: parsed.metadata.from,
    date: String(parsed.metadata.date),
    test: isTruthy(parsed.metadata.test),
    body: parsed.body
  });
  const encrypted = Buffer.concat([
    cipher.update(payload, "utf8"),
    cipher.final(),
    cipher.getAuthTag()
  ]);
  const names = [parsed.metadata.recipient].concat(parsed.metadata.aliases || []);

  return {
    lookups: [...new Set(names.map((name) => lookupHash(name, parsed.code)))],
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    ciphertext: encrypted.toString("base64")
  };
}

async function main() {
  const secretBundle = process.env.THANKS_LETTERS_MD;
  const requireSecret = process.argv.includes("--require-secret");
  const parsedLetters = [];

  if (secretBundle) {
    const sources = secretBundle
      .replace(/\r\n?/g, "\n")
      .split(/\n---8<---LETTER---8<---\n/g)
      .map((source) => source.trim())
      .filter(Boolean);

    for (let index = 0; index < sources.length; index += 1) {
      parsedLetters.push(parseLetter(sources[index], `Secret 편지 ${index + 1}`));
    }
  } else if (requireSecret) {
    throw new Error(
      "THANKS_LETTERS_MD Repository Secret이 비어 있습니다. GitHub 저장소 설정에서 Secret을 등록하세요."
    );
  } else {
    let files;

    try {
      files = (await readdir(sourceDirectory))
        .filter((filename) => filename.endsWith(".md"))
        .sort();
    } catch (error) {
      if (error.code === "ENOENT") {
        throw new Error(`작성 폴더가 없습니다: ${sourceDirectory}`);
      }
      throw error;
    }

    for (const filename of files) {
      const source = await readFile(path.join(sourceDirectory, filename), "utf8");
      parsedLetters.push(parseLetter(source, filename));
    }
  }

  if (parsedLetters.length === 0) throw new Error("암호화할 Markdown 편지가 없습니다.");

  const letters = parsedLetters.map(encryptLetter);
  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(
    outputFile,
    `${JSON.stringify({ version: 1, iterations, letters }, null, 2)}\n`,
    "utf8"
  );

  console.log(`${letters.length}개 편지를 암호화했습니다: ${path.relative(root, outputFile)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
