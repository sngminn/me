# Figma Token Integration Guide (Tailwind CSS v4)

이 가이드는 피그마 디자인 토큰을 이 프로젝트(Tailwind CSS v4)에 연동하고, **자동화**하는 방법까지 다룹니다.

## 1. 기본 개념 (Workflow)

1.  **Figma**: 디자이너(햄)가 토큰을 수정합니다.
2.  **Sync**: 'Tokens Studio' 플러그인을 통해 GitHub 저장소로 `tokens.json`을 푸시합니다.
3.  **Action**: GitHub Actions가 변경을 감지하고, `tokens.css`로 변환하여 PR을 생성합니다.
4.  **Merge**: 햄이 PR을 검토하고 병합하면 배포됩니다.

---

## 2. 피그마 설정 (Tokens Studio)

가장 강력하고 무료로 시작할 수 있는 **Tokens Studio for Figma** 플러그인을 사용합니다.

1.  **플러그인 설치**: [Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978/tokens-studio-for-figma-figma-tokens) 설치.
2.  **GitHub 연동**:
    -   플러그인 실행 -> Settings -> GitHub.
    -   **Name**: 내 프로젝트
    -   **Personal Access Token**: GitHub에서 `repo` 권한이 있는 토큰 생성 후 입력.
    -   **Repository**: `sngminn/me`
    -   **Branch**: `main` (또는 `design-tokens` 같은 별도 브랜치 권장)
    -   **FilePath**: `tokens.json`
3.  **Push**: 토큰을 만들고 'Push to GitHub' 버튼을 누르면 레포지토리에 `tokens.json`이 생깁니다.

---

## 3. 프로젝트 설정 (변환 스크립트)

`tokens.json`을 `tokens.css`로 바꿔주는 도구인 **Style Dictionary**를 설치합니다.

### 3.1. 패키지 설치
```bash
pnpm add -D style-dictionary
```

### 3.2. 설정 파일 생성 (`config.json`)
프로젝트 루트에 `style-dictionary.config.json`을 만듭니다.

```json
{
  "source": ["tokens.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "app/",
      "files": [{
        "destination": "tokens.css",
        "format": "css/variables"
      }]
    }
  }
}
```

### 3.3. 변환 스크립트 추가 (`package.json`)
```json
"scripts": {
  "build:tokens": "style-dictionary build"
}
```

---

## 4. 자동화 설정 (GitHub Actions)

`tokens.json`이 바뀌면 자동으로 CSS를 만들고 PR을 날리는 액션을 만듭니다.
`.github/workflows/transform-tokens.yml` 파일을 생성하세요.

```yaml
name: Transform Tokens

on:
  push:
    paths:
      - 'tokens.json'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install Dependencies
        run: pnpm install
        
      - name: Build Tokens
        run: pnpm run build:tokens
        
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: "design: update design tokens"
          title: "🎨 Design Tokens Update"
          body: "피그마에서 디자인 토큰이 업데이트되었습니다. 자동으로 생성된 PR입니다."
          branch: "design-tokens-update"
          base: "main"
```

---

## 5. Tailwind 설정 (`app/globals.css`)

자동 생성될 `app/tokens.css`를 Tailwind가 사용하도록 설정합니다.

```css
@import "tailwindcss";
@import "./tokens.css";

@theme inline {
  /* 
     Style Dictionary가 만들어준 변수 이름에 맞춰서 매핑해야 합니다.
     예를 들어 tokens.json에서 color.brand.primary로 정의했다면
     보통 --color-brand-primary로 변환됩니다.
  */
  --color-brand-primary: var(--color-brand-primary);
  --color-text-base: var(--color-text-base);
}
```

---

## 요약
1.  **햄**: 피그마에서 토큰 수정 -> Push to GitHub.
2.  **봇**: GitHub Action이 돌면서 `tokens.css` 업데이트 -> PR 생성.
3.  **햄**: PR 확인하고 Merge -> 끝!
