(function () {
  "use strict";

  var form = document.getElementById("letter-form");
  var nameInput = document.getElementById("recipient-name");
  var codeInput = document.getElementById("letter-code");
  var submit = document.getElementById("letter-submit");
  var result = document.getElementById("letter-result");
  var gate = document.getElementById("letter-gate");
  var view = document.getElementById("letter-view");
  var close = document.getElementById("letter-close");
  var status = document.getElementById("letter-status");
  var indexUrl = document.body.dataset.letterIndex;
  var encoder = new TextEncoder();
  var decoder = new TextDecoder();
  var additionalData = encoder.encode("thanks-for-rcv:v1");
  var indexPromise;

  if (!form || !nameInput || !codeInput || !submit || !result || !indexUrl) return;

  function normalizeName(value) {
    return String(value || "")
      .normalize("NFC")
      .toLocaleLowerCase("ko-KR")
      .replace(/[\s\-_.]/g, "");
  }

  function bytesFromBase64(value) {
    var binary = window.atob(value);
    var bytes = new Uint8Array(binary.length);

    for (var i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
  }

  function bytesToHex(bytes) {
    return Array.from(new Uint8Array(bytes))
      .map(function (byte) {
        return byte.toString(16).padStart(2, "0");
      })
      .join("");
  }

  async function hashLookup(name, code) {
    var lookupKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(code.trim().normalize("NFKC")),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    var digest = await window.crypto.subtle.sign(
      "HMAC",
      lookupKey,
      encoder.encode(normalizeName(name))
    );
    return bytesToHex(digest);
  }

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = window
        .fetch(indexUrl, { cache: "no-store", credentials: "same-origin" })
        .then(function (response) {
          if (!response.ok) throw new Error("letter index unavailable");
          return response.json();
        })
        .then(function (data) {
          if (data.version !== 1 || !Array.isArray(data.letters)) {
            throw new Error("unsupported letter index");
          }
          return data;
        });
    }

    return indexPromise;
  }

  async function decryptLetter(entry, code, iterations) {
    var keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(code.trim().normalize("NFKC")),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    var key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: bytesFromBase64(entry.salt),
        iterations: iterations,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    var plaintext = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: bytesFromBase64(entry.iv),
        additionalData: additionalData,
        tagLength: 128
      },
      key,
      bytesFromBase64(entry.ciphertext)
    );

    return JSON.parse(decoder.decode(plaintext));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderInline(value) {
    return escapeHtml(value)
      .replace(/`([^`\n]+)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" rel="noopener noreferrer">$1</a>'
      )
      .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
      .replace(/__([^_\n]+)__/g, "<strong>$1</strong>")
      .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
      .replace(/_([^_\n]+)_/g, "<em>$1</em>");
  }

  function isBlockStart(line) {
    return (
      /^#{1,3}\s+/.test(line) ||
      /^>\s?/.test(line) ||
      /^[-*]\s+/.test(line) ||
      /^\d+\.\s+/.test(line) ||
      /^(---|\*\*\*)\s*$/.test(line)
    );
  }

  function renderMarkdown(markdown) {
    var lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
    var html = [];
    var index = 0;

    while (index < lines.length) {
      var line = lines[index];

      if (!line.trim()) {
        index += 1;
        continue;
      }

      var heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        var level = heading[1].length + 1;
        html.push("<h" + level + ">" + renderInline(heading[2]) + "</h" + level + ">");
        index += 1;
        continue;
      }

      if (/^(---|\*\*\*)\s*$/.test(line)) {
        html.push("<hr>");
        index += 1;
        continue;
      }

      if (/^>\s?/.test(line)) {
        var quotes = [];
        while (index < lines.length && /^>\s?/.test(lines[index])) {
          quotes.push(lines[index].replace(/^>\s?/, ""));
          index += 1;
        }
        html.push("<blockquote><p>" + renderInline(quotes.join(" ")) + "</p></blockquote>");
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        var unordered = [];
        while (index < lines.length && /^[-*]\s+/.test(lines[index])) {
          unordered.push(
            "<li>" + renderInline(lines[index].replace(/^[-*]\s+/, "")) + "</li>"
          );
          index += 1;
        }
        html.push("<ul>" + unordered.join("") + "</ul>");
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        var ordered = [];
        while (index < lines.length && /^\d+\.\s+/.test(lines[index])) {
          ordered.push(
            "<li>" + renderInline(lines[index].replace(/^\d+\.\s+/, "")) + "</li>"
          );
          index += 1;
        }
        html.push("<ol>" + ordered.join("") + "</ol>");
        continue;
      }

      var paragraph = [line.trim()];
      index += 1;
      while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
        paragraph.push(lines[index].trim());
        index += 1;
      }
      html.push("<p>" + renderInline(paragraph.join(" ")) + "</p>");
    }

    return html.join("");
  }

  function showLetter(letter) {
    document.getElementById("letter-recipient").textContent = "TO. " + letter.recipient;
    document.getElementById("letter-title").textContent = letter.title;
    document.getElementById("letter-date").textContent = "PRIVATE NOTE / " + letter.date;
    document.getElementById("letter-content").innerHTML = renderMarkdown(letter.body);
    document.getElementById("letter-from").textContent = letter.from;

    gate.hidden = true;
    view.hidden = false;
    status.innerHTML = '<i aria-hidden="true"></i> LETTER DECRYPTED';
    document.body.classList.remove("thanks-page--gate");
    document.body.classList.add("thanks-page--letter");
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById("letter-title").focus({ preventScroll: true });
  }

  function showError(message) {
    result.textContent = message;
    result.classList.add("is-error");
    nameInput.setAttribute("aria-invalid", "true");
    codeInput.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    result.textContent = "";
    result.classList.remove("is-error");
    nameInput.removeAttribute("aria-invalid");
    codeInput.removeAttribute("aria-invalid");
  }

  function setLoading(loading) {
    submit.disabled = loading;
    submit.querySelector("span").textContent = loading ? "복호화하는 중…" : "편지 복호화하기";
  }

  [nameInput, codeInput].forEach(function (input) {
    input.addEventListener("input", clearError);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearError();

    if (!nameInput.value.trim() || !codeInput.value.trim()) {
      showError("이름과 개인 코드를 모두 입력해 주세요.");
      return;
    }

    if (!window.crypto || !window.crypto.subtle) {
      showError("이 브라우저에서는 안전한 복호화를 사용할 수 없습니다.");
      return;
    }

    setLoading(true);

    try {
      var data = await loadIndex();
      var lookup = await hashLookup(nameInput.value, codeInput.value);
      var entry = data.letters.find(function (letter) {
        return letter.lookups.indexOf(lookup) !== -1;
      });

      if (!entry) throw new Error("letter not found");

      var letter = await decryptLetter(entry, codeInput.value, data.iterations);
      showLetter(letter);
    } catch (error) {
      showError("이름 또는 개인 코드가 맞지 않습니다. 전달받은 내용을 다시 확인해 주세요.");
      codeInput.select();
    } finally {
      setLoading(false);
    }
  });

  close.addEventListener("click", function () {
    view.hidden = true;
    gate.hidden = false;
    codeInput.value = "";
    document.getElementById("letter-content").textContent = "";
    status.innerHTML = '<i aria-hidden="true"></i> ENCRYPTED LETTERS';
    document.body.classList.add("thanks-page--gate");
    document.body.classList.remove("thanks-page--letter");
    nameInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
