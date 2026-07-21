import { randomInt } from "node:crypto";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const requestedLength = Number.parseInt(process.argv[2] || "24", 10);

if (!Number.isInteger(requestedLength) || requestedLength < 24 || requestedLength > 128) {
  console.error("코드 길이는 24자 이상 128자 이하의 정수여야 합니다.");
  process.exit(1);
}

let code = "";
for (let index = 0; index < requestedLength; index += 1) {
  code += alphabet[randomInt(alphabet.length)];
}

console.log(code);
