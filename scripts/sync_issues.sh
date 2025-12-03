#!/bin/bash

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) could not be found."
    echo "Please install it using: brew install gh"
    echo "Then login using: gh auth login"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo "❌ You are not logged in to GitHub CLI."
    echo "Please login using: gh auth login"
    exit 1
fi

echo "🚀 Creating Sprint 1 Issues..."

# Issue 1
gh issue create \
    --title "🛠️ Issue 1: 프로젝트 초기 세팅 (Project Initialization)" \
    --body "## 목표
개발 환경을 구축하고 필수 라이브러리를 설치하여 개발 준비를 마친다.

## 세부 작업 (Tasks)
- [ ] 필수 라이브러리 설치 (framer-motion, lucide-react, next-themes, clsx, tailwind-merge, react-force-graph-2d, @types/d3)
- [ ] Tailwind CSS v4 설정 검증
- [ ] 디렉토리 구조 생성 (/content, /src/lib/obsidian, /src/components/graph)

## 완료 조건 (Acceptance Criteria)
- package.json에 모든 의존성이 추가되어야 함.
- pnpm dev 실행 시 에러 없이 서버가 켜져야 함.
- 다크 모드 전환이 동작해야 함." \
    --label "setup"

# Issue 2
gh issue create \
    --title "🧠 Issue 2: 옵시디언 파이프라인 구축 (Obsidian Pipeline)" \
    --body "## 목표
로컬의 마크다운 파일들을 읽어와서 웹에서 사용할 수 있는 데이터로 변환한다.

## 세부 작업 (Tasks)
- [ ] MDX 파서 구현 (src/lib/obsidian/post.ts)
- [ ] 그래프 데이터 추출기 구현 (src/lib/obsidian/graph.ts)

## 완료 조건 (Acceptance Criteria)
- /content 폴더에 있는 .md 파일을 읽어서 JSON 형태로 반환하는 함수가 있어야 함.
- 내부 링크([[Link]])가 올바르게 파싱되어 links 배열에 담겨야 함." \
    --label "feature"

# Issue 3
gh issue create \
    --title "🕸️ Issue 3: 신경망 네비게이션 구현 (Neural Navigation)" \
    --body "## 목표
메인 화면에 옵시디언 그래프를 띄우고, 인터랙티브한 네비게이션을 구현한다.

## 세부 작업 (Tasks)
- [ ] Graph View 컴포넌트 개발 (NeuralGraph.tsx)
- [ ] 인터랙션 구현 (Node Click, Hover)

## 완료 조건 (Acceptance Criteria)
- 메인 페이지 접속 시 그래프가 렌더링되어야 함.
- 노드를 클릭하면 해당 포스트 페이지로 이동해야 함.
- 그래프가 화면 중앙에 예쁘게 위치해야 함." \
    --label "feature"

# Issue 4
gh issue create \
    --title "📝 Issue 4: 포스트 상세 페이지 & UI (Post Detail & UI)" \
    --body "## 목표
개별 포스트를 읽을 수 있는 상세 페이지와 기본 레이아웃을 만든다.

## 세부 작업 (Tasks)
- [ ] 공통 레이아웃 (layout.tsx)
- [ ] 상세 페이지 (/posts/[slug]/page.tsx)

## 완료 조건 (Acceptance Criteria)
- /posts/hello-world 접속 시 글 내용이 보여야 함.
- 마크다운 문법이 예쁘게 스타일링되어야 함." \
    --label "feature"

# Issue 5
gh issue create \
    --title "🚀 Issue 5: 배포 및 검증 (Deploy & Verify)" \
    --body "## 목표
실제 서버에 배포하고 동작을 확인한다.

## 세부 작업 (Tasks)
- [ ] 배포 스크립트 확인
- [ ] 최종 테스트 (데스크탑/모바일)

## 완료 조건 (Acceptance Criteria)
- main 브랜치 푸시 후, 홈서버 URL로 접속 가능해야 함.
- 모바일에서도 그래프가 터치로 조작되어야 함." \
    --label "deploy"

echo "✅ All issues created successfully!"
