# 🏗️ DevOps Architecture

이 문서는 프로젝트의 전체 DevOps 파이프라인과 자동화 흐름을 설명합니다.

## 🔄 워크플로우 다이어그램 (Mermaid)

```mermaid
graph TD
    User[🐹 햄 (Developer)]
    
    subgraph Local["💻 Local Environment"]
        Code[Code Changes]
        SmartCommit["🤖 Smart Commit (pnpm commit)"]
        Husky["🐶 Husky (Pre-commit)"]
        LintStaged["✨ Lint-staged (Biome)"]
        GitCommit["💾 Git Commit"]
        GitPush["🚀 Git Push"]
    end
    
    subgraph GitHub["☁️ GitHub Actions"]
        PushEvent[Push Event]
        AutoPR["🔀 Auto PR Workflow"]
        Gemini["🧠 Gemini AI"]
        TodoIssue["📝 TODO to Issue"]
        ProjectAuto["kanban Project Automation"]
    end
    
    subgraph Deploy["🏠 Home Server"]
        CD["📦 CD Pipeline"]
        Docker["🐳 Docker Container"]
    end

    %% Flow
    User -->|Writes Code| Code
    Code -->|Runs| SmartCommit
    SmartCommit -->|Generates Msg| Gemini
    Gemini -->|Returns Msg| SmartCommit
    SmartCommit -->|Triggers| Husky
    Husky -->|Runs| LintStaged
    LintStaged -->|Formats| Code
    LintStaged -->|Passes| GitCommit
    User -->|Manually Runs| GitPush
    
    GitPush -->|Triggers| PushEvent
    PushEvent -->|Triggers| AutoPR
    PushEvent -->|Triggers| TodoIssue
    
    AutoPR -->|Analyzes Diff| Gemini
    Gemini -->|Generates Description| AutoPR
    AutoPR -->|Creates| PR[Pull Request]
    PR -->|Triggers| ProjectAuto
    
    PushEvent -->|Main Branch| CD
    CD -->|Deploys to| Docker
```

## 🛠️ 구성 요소 설명

### 1. Local Automation
- **Smart Commit**: `pnpm commit` 명령어로 실행. Gemini 2.5 Flash Lite를 사용하여 변경 사항을 분석하고 한국어 커밋 메시지를 자동 생성합니다.
- **Husky & Lint-staged**: 커밋 직전에 실행되어, 변경된 파일만 Biome로 포맷팅하고 린트 검사를 수행합니다. 코드가 더러우면 커밋되지 않습니다.

### 2. GitHub Automation
- **Auto PR**: `main`이 아닌 브랜치에 푸시하면 자동으로 PR을 생성합니다. Gemini가 커밋 내역과 Diff를 분석해 상세한 PR 본문을 작성합니다.
- **TODO to Issue**: 코드 내의 `// TODO:` 주석을 감지하여 GitHub Issue로 변환합니다.
- **Project Automation**: PR과 Issue를 GitHub Project 보드에 자동으로 추가합니다.

### 3. Deployment
- **Docker**: Next.js 애플리케이션을 Standalone 모드로 빌드하여 경량 컨테이너로 패키징합니다.
- **CD**: GitHub Actions가 홈서버에 SSH로 접속하여 최신 이미지를 배포합니다.
