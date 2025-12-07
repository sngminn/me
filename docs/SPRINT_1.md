# 🏃‍♂️ SPRINT 1: The Neural Foundation (신경망 기초 공사)

**기간**: 1주차 (Day 1 ~ Day 5)
**목표**: "옵시디언 데이터를 파싱하여 그래프로 시각화하고, 클릭 시 해당 문서로 이동하는 프로토타입 완성"

---

## ✅ Checklist

### 1. 환경 설정 & 의존성 설치 (Setup)
- [ ] **필수 라이브러리 설치 및 설명**
    ```bash
    pnpm add framer-motion lucide-react next-themes clsx tailwind-merge
    pnpm add react-force-graph-2d
    pnpm add -D @types/d3
    ```
    *   **`framer-motion`**: 페이지 전환 시 "줌인" 효과와 부드러운 인터랙션을 구현하기 위한 필수 애니메이션 라이브러리.
    *   **`lucide-react`**: 깔끔하고 일관된 아이콘 팩. 가볍고 커스터마이징이 쉬워 모던 웹 개발의 표준임.
    *   **`next-themes`**: 시스템 설정에 따른 다크/라이트 모드 자동 전환 및 깜빡임(FOUC) 방지.
    *   **`clsx` & `tailwind-merge`**: 조건부 스타일링 시 Tailwind 클래스 충돌을 방지하고 깔끔하게 병합하기 위한 유틸리티 조합.
    *   **`react-force-graph-2d`**: 옵시디언의 'Graph View'를 웹에서 구현하기 위한 핵심 물리 엔진 라이브러리. (3D는 성능 이슈와 가독성 문제로 2D 채택)
    *   **`@types/d3`**: `react-force-graph`가 내부적으로 사용하는 D3.js의 타입 정의. 커스텀 그래프 조작 시 필요함.
- [ ] **Tailwind v4 설정 확인**
    - 현재 v4가 설치되어 있음. CSS 변수 기반의 테마 설정(`globals.css`)이 제대로 동작하는지 확인.
- [ ] **디렉토리 구조 잡기**
    - `/content`: 옵시디언 마크다운 파일들이 위치할 곳 (Git Submodule 또는 단순 폴더).
    - `/src/lib/obsidian`: 마크다운 파싱 및 그래프 데이터 변환 로직.

### 2. 옵시디언 파이프라인 구축 (The Brain)
- [ ] **MDX 파싱 로직 구현 (`src/lib/obsidian/post.ts`)**
    - `gray-matter`로 Frontmatter 파싱.
    - `next-mdx-remote`로 본문 컴파일.
- [ ] **그래프 데이터 추출기 구현 (`src/lib/obsidian/graph.ts`)**
    - **핵심**: 모든 마크다운 파일을 순회하며 `[[Link]]` 형태의 내부 링크를 정규식으로 추출.
    - **출력 포맷**:
        ```json
        {
          "nodes": [{ "id": "post-slug", "name": "Post Title", "val": 1 }],
          "links": [{ "source": "post-a", "target": "post-b" }]
        }
        ```
    - 이 데이터가 있어야 메인 화면의 '신경망'을 그릴 수 있음.

### 3. UI 스켈레톤 & 라우팅 (Skeleton)
- [ ] **테마 프로바이더 설정**
    - `next-themes`를 사용하여 다크/라이트 모드 지원 (시스템 설정 따라가기).
- [ ] **기본 레이아웃 (`layout.tsx`)**
    - 헤더: 로고(홈), 테마 토글.
    - 메인: `children`.
    - 푸터: "Server Status" (Sprint 3 예정이지만 공간만 확보).
- [ ] **라우팅 구현**
    - `/`: 메인 페이지 (Graph View가 들어갈 곳).
    - `/posts/[slug]`: 게시글 상세 페이지.

### 4. 핵심 기능 구현: Neural Navigation (Idea 1)
- [ ] **Graph View 컴포넌트 (`src/components/graph/NeuralGraph.tsx`)**
    - `react-force-graph-2d` 사용.
    - 노드 클릭 이벤트 핸들러: 클릭 시 `/posts/[id]`로 라우팅.
    - 노드 호버 효과: 연결된 노드만 하이라이트.
- [ ] **메인 페이지 통합**
    - 서버 컴포넌트에서 그래프 데이터를 생성하여 클라이언트 컴포넌트(`NeuralGraph`)에 주입.

### 5. 배포 & 테스트 (Deploy)
- [ ] **CI/CD 파이프라인 동작 확인**
    - `main` 브랜치 푸시 시 홈서버로 자동 배포되는지 확인.
- [ ] **모바일 대응 확인**
    - 그래프 뷰가 모바일에서도 터치로 조작 가능한지 확인.

---

## 💡 깡통's Tip
*   **그래프 데이터**: 처음엔 파일이 별로 없어서 그래프가 썰렁할 겁니다. 더미 데이터(Dummy Data)를 50개 정도 만들어서 테스트하세요. 그래야 '간지'가 나는지 확인 가능합니다.
*   **Tailwind v4**: v4는 설정 파일(`tailwind.config.ts`)보다 CSS 파일(`globals.css`)에서의 설정을 권장합니다. 공식 문서를 꼭 참고하세요.
