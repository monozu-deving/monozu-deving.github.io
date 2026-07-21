# GitHub Actions 암호화 편지 저장 방법

실제 편지 원문과 개인 코드는 저장소 파일로 만들지 않습니다. GitHub의 멀티라인 Repository Secret 하나에 Markdown 형식으로 저장합니다.

## 실제 저장 위치

GitHub에서 이 저장소를 열고 다음 순서로 이동합니다.

1. `Settings`
2. `Secrets and variables`
3. `Actions`
4. `Repository secrets`의 `New repository secret`

입력값은 다음과 같습니다.

- Name: `THANKS_LETTERS_MD`
- Secret: `thanks-letter.example.md`의 전체 내용을 복사한 뒤 실제 이름, 코드, 본문으로 수정한 내용

즉, 실제 편지는 PC나 저장소의 `.md` 파일에 저장하는 것이 아니라 `THANKS_LETTERS_MD` Secret의 값으로 저장합니다. 저장소의 예시 파일은 형식 확인용이며 실제 개인정보를 작성하면 안 됩니다.

## 예시 파일

[`thanks-letter.example.md`](thanks-letter.example.md)에 세 명 분량의 예시가 들어 있습니다. 그대로 복사해서 GitHub Secret에 넣은 뒤 이름, 별칭, 본문, 코드를 실제 값으로 바꾸면 됩니다.

각 사람의 `code`는 반드시 서로 다른 24자 이상의 무작위 문자열로 교체합니다. 예시의 `REPLACE-WITH-RANDOM-24-CHARS-01` 같은 값이 남아 있으면 GitHub Actions 빌드가 실패합니다.


## 개인 코드 자동 생성

npm 설치 없이 저장소 루트에서 다음 명령을 실행하면 암호학적으로 안전한 24자 코드를 생성합니다.

```powershell
node scripts/generate-letter-code.mjs
```

원하는 길이를 인자로 전달할 수도 있습니다. 최소 길이는 24자입니다.

```powershell
node scripts/generate-letter-code.mjs 32
```

출력된 코드를 편지의 `code` 값에 붙여 넣고, 편지를 받을 사람에게 별도 메시지로 전달합니다.
## 여러 명 저장하기

같은 `THANKS_LETTERS_MD` Secret 안에서 각 사람의 Markdown 편지 사이에 다음 구분선을 한 줄로 넣습니다.

```text
---8<---LETTER---8<---
```

구분선 다음에 같은 형식의 편지를 다시 붙이면 됩니다. 예시 파일은 이미 이 구분선으로 세 명의 편지를 나눠 둔 상태입니다.


## PC에서 작성할 때

실제 편지를 작성하면서 저장할 파일은 tracked 예시 파일이 아니라 `_private_letters/thanks-letters.local.md`를 사용합니다.

- `_private_letters/`는 `.gitignore`에 들어 있어서 git에 올라가지 않습니다.
- `examples/thanks-letter.example.md`는 형식 설명용 tracked 파일입니다. 실제 이름, 실제 편지, 실제 코드를 넣지 않습니다.
- 작성이 끝나면 `_private_letters/thanks-letters.local.md`의 전체 내용을 GitHub Secret `THANKS_LETTERS_MD`에 복사합니다.
- 이후 Actions에서 `Deploy encrypted Jekyll site to Pages`를 수동 실행하거나 `master`에 push하면 반영됩니다.


## 테스트용 편지

2026년 7월 10일 00:00(KST) 전에는 기본적으로 실제 편지를 열람할 수 없습니다. 테스트용으로 바로 열어볼 편지만 front matter에 다음 값을 추가합니다.

```yaml
test: true
```

이 값이 없는 편지는 이름과 개인 코드가 맞아도 `/thanks_for_rcv/not-yet/` 안내 페이지로 이동합니다.

## 저장 후 배포

`master` 브랜치에 push하면 `.github/workflows/build.yml`이 다음 작업을 자동 실행합니다.

1. `THANKS_LETTERS_MD` Secret을 Action 러너에 주입
2. 이름 확인값과 편지 본문 암호화
3. Jekyll 사이트 빌드
4. GitHub Pages artifact 배포

Secret 내용만 수정했을 때는 코드 push가 발생하지 않으므로 Actions 화면에서 `Deploy encrypted Jekyll site to Pages`를 선택하고 `Run workflow`를 한 번 누릅니다.

Repository의 `Settings → Pages → Build and deployment → Source`는 `GitHub Actions`로 설정해야 합니다.

## 보안 주의사항

- 개인 코드는 비밀번호 관리자의 생성기로 만든 24자 이상의 무작위 문자열을 사용합니다.
- 개인 코드는 편지를 받을 사람에게 별도 메신저로 전달합니다.
- 코드나 편지 원문을 저장소, Issue, 커밋 메시지, Actions 입력값에 작성하지 않습니다.
- Secret을 바꾼 뒤 워크플로를 다시 실행해야 배포 결과에 반영됩니다.
