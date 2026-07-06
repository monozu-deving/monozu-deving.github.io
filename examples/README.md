# GitHub Actions 암호화 편지 설정

편지 원문과 개인 코드는 저장소 파일에 두지 않습니다. GitHub Actions의 멀티라인 Repository Secret에서만 관리합니다.

## 1. Secret 등록

저장소의 `Settings → Secrets and variables → Actions → New repository secret`에서 다음 Secret을 만듭니다.

- 이름: `THANKS_LETTERS_MD`
- 값: `thanks-letters-secret.example.md` 형식으로 작성한 전체 내용

한 명만 작성할 때는 Markdown 파일 하나를 그대로 붙여 넣습니다. 여러 명일 때는 각 Markdown 편지 사이에 다음 구분선을 한 줄로 넣습니다.

```text
---8<---LETTER---8<---
```

Secret 안의 각 편지는 YAML front matter와 Markdown 본문으로 구성됩니다. 지원하는 Markdown 문법은 제목, 문단, 인용문, 목록, 굵게, 기울임, 인라인 코드, HTTP(S) 링크, 구분선입니다.

## 2. 배포

`master` 브랜치에 push하면 `.github/workflows/build.yml`이 다음 작업을 자동 실행합니다.

1. `THANKS_LETTERS_MD` Secret을 Action 러너에 주입
2. 이름 확인값과 편지 본문 암호화
3. Jekyll 사이트 빌드
4. GitHub Pages artifact 배포

Actions 화면의 `Deploy encrypted Jekyll site to Pages` 워크플로에서 `Run workflow`를 눌러 수동 재배포할 수도 있습니다.

Repository의 `Settings → Pages → Build and deployment → Source`는 `GitHub Actions`로 설정해야 합니다.

## 보안 주의사항

- 개인 코드는 비밀번호 관리자의 생성기로 만든 16자 이상의 무작위 문자열을 사용합니다.
- 개인 코드는 편지를 받을 사람에게 별도 메신저로 전달합니다.
- 코드나 편지 원문을 저장소, Issue, 커밋 메시지, Actions 입력값에 작성하지 않습니다.
- Secret을 바꾼 뒤 워크플로를 다시 실행해야 배포 결과에 반영됩니다.
