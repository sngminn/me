# 📋 Sprint 1: Detailed Issue List

햄! 스프린트 1주차 계획을 실무에서 바로 쓸 수 있는 **'이슈(Issue)'** 단위로 쪼개서 정리했습니다.
하나씩 도장 깨기 하듯이 처리하면 됩니다.

---

## 🛠️ Issue 1: 프로젝트 초기 세팅 (Project Initialization)
**목표**: 개발 환경을 구축하고 필수 라이브러리를 설치하여 개발 준비를 마친다.

### 세부 작업 (Tasks)
- [ ] **필수 라이브러리 설치**
    - `pnpm add framer-motion lucide-react next-themes clsx tailwind-merge`
    - `pnpm add react-force-graph-2d`
    - `pnpm add -D @types/d3`
- [ ] **Tailwind CSS v4 설정 검증**
    - `globals.css`에서 CSS 변수(`--background`, `--foreground` 등)가 정상 작동하는지 확인.
    - 다크 모드 토글 시 색상 반전 확인.
- [ ] **디렉토리 구조 생성**
    - `/content`: 마크다운 파일 저장소.
    - `/src/lib/obsidian`: 파싱 로직 저장소.
    - `/src/components/graph`: 그래프 컴포넌트 저장소.

### 완료 조건 (Acceptance Criteria)
- `package.json`에 모든 의존성이 추가되어야 함.
- `pnpm dev` 실행 시 에러 없이 서버가 켜져야 함.
- 다크 모드 전환이 동작해야 함.

---

## 🧠 Issue 2: 옵시디언 파이프라인 구축 (Obsidian Pipeline)
**목표**: 로컬의 마크다운 파일들을 읽어와서 웹에서 사용할 수 있는 데이터로 변환한다.

### 세부 작업 (Tasks)
- [ ] **MDX 파서 구현 (`src/lib/obsidian/post.ts`)**
    - `fs`로 파일 읽기.
    - `gray-matter`로 메타데이터(제목, 날짜, 태그) 추출.
    - `next-mdx-remote`로 본문 변환.
- [ ] **그래프 데이터 추출기 구현 (`src/lib/obsidian/graph.ts`)**
    - 정규식 `\[\[(.*?)\]\]`을 사용하여 내부 링크 추출.
    - 전체 포스트를 순회하며 `Nodes`와 `Links` 데이터 생성.
    - **Node 구조**: `{ id: 'slug', name: 'Title', val: 1 }`
    - **Link 구조**: `{ source: 'slug-a', target: 'slug-b' }`

### 완료 조건 (Acceptance Criteria)
- `/content` 폴더에 있는 `.md` 파일을 읽어서 JSON 형태로 반환하는 함수가 있어야 함.
- 내부 링크(`[[Link]]`)가 올바르게 파싱되어 `links` 배열에 담겨야 함.

---

## 🕸️ Issue 3: 신경망 네비게이션 구현 (Neural Navigation)
**목표**: 메인 화면에 옵시디언 그래프를 띄우고, 인터랙티브한 네비게이션을 구현한다.

### 세부 작업 (Tasks)
- [ ] **Graph View 컴포넌트 개발 (`NeuralGraph.tsx`)**
    - `react-force-graph-2d` 컴포넌트 배치.
    - `graphData` prop으로 노드와 링크 데이터 주입.
    - 배경색을 투명(`backgroundColor="rgba(0,0,0,0)"`)으로 설정하여 테마와 어우러지게 함.
- [ ] **인터랙션 구현**
    - `onNodeClick`: 클릭 시 `router.push('/posts/${node.id}')` 실행.
    - `onNodeHover`: 마우스 오버 시 커서 변경 (`pointer`).
    - `cooldownTicks={100}`: 초기 렌더링 후 물리 엔진 멈추게 하여 성능 최적화.

### 완료 조건 (Acceptance Criteria)
- 메인 페이지 접속 시 그래프가 렌더링되어야 함.
- 노드를 클릭하면 해당 포스트 페이지로 이동해야 함.
- 그래프가 화면 중앙에 예쁘게 위치해야 함.

---

## 📝 Issue 4: 포스트 상세 페이지 & UI (Post Detail & UI)
**목표**: 개별 포스트를 읽을 수 있는 상세 페이지와 기본 레이아웃을 만든다.

### 세부 작업 (Tasks)
- [ ] **공통 레이아웃 (`layout.tsx`)**
    - 상단 헤더: 홈 버튼(로고), 테마 토글 버튼.
    - 폰트 적용: `next/font` (Pretendard 또는 Inter 추천).
- [ ] **상세 페이지 (`/posts/[slug]/page.tsx`)**
    - `generateStaticParams`: 빌드 시 정적 페이지 생성 (SSG).
    - `MDXRemote`: 본문 렌더링.
    - 스타일링: `@tailwindcss/typography` (`prose` 클래스) 활용하여 마크다운 스타일 자동 적용.

### 완료 조건 (Acceptance Criteria)
- `/posts/hello-world` 접속 시 글 내용이 보여야 함.
- 마크다운 문법(헤딩, 리스트, 코드 블럭)이 예쁘게 스타일링되어야 함.

---

## 🚀 Issue 5: 배포 및 검증 (Deploy & Verify)
**목표**: 실제 서버에 배포하고 동작을 확인한다.

### 세부 작업 (Tasks)
- [ ] **배포 스크립트 확인**
    - 기존 CI/CD 파이프라인이 정상 동작하는지 확인.
    - 환경 변수 설정 확인.
- [ ] **최종 테스트**
    - 데스크탑/모바일 브라우저에서 그래프 조작 테스트.
    - 라이트/다크 모드 전환 테스트.

### 완료 조건 (Acceptance Criteria)
- `main` 브랜치 푸시 후, 홈서버 URL로 접속 가능해야 함.
- 모바일에서도 그래프가 터치로 조작되어야 함.
