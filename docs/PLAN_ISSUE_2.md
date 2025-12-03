# 🧠 Implementation Plan: Obsidian Pipeline (Issue 2)

**목표**: 로컬 마크다운 파일들을 읽어 웹사이트에서 사용할 수 있는 **게시글 데이터**와 **지식 그래프 데이터**로 변환한다.

---

## 1. 데이터 구조 설계 (Type Definitions)

가장 먼저 데이터의 형태를 정의합니다.

### `Post` (게시글)
```typescript
export interface Post {
  slug: string;       // URL 및 ID로 사용 (예: "the-beginning")
  title: string;      // 제목
  date: string;       // 작성일
  tags: string[];     // 태그 목록
  content: string;    // 원본 마크다운 (또는 컴파일된 MDX)
  excerpt?: string;   // 요약문
}
```

### `GraphData` (그래프)
```typescript
export interface GraphNode {
  id: string;   // Post slug
  name: string; // Post title
  val: number;  // 노드 크기 (연결된 링크 수에 비례)
}

export interface GraphLink {
  source: string; // 시작 노드 ID
  target: string; // 도착 노드 ID
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
```

---

## 2. 구현 상세 (Implementation Details)

### A. 포스트 파서 (`src/lib/obsidian/post.ts`)
*   **기능**:
    1.  `getAllPosts()`: `/content/posts` 폴더의 모든 `.md` 파일을 읽어서 최신순 정렬하여 반환.
    2.  `getPostBySlug(slug)`: 특정 슬러그의 파일 내용을 읽어서 반환.
*   **핵심 로직**:
    *   `fs.readdirSync`로 파일 목록 스캔.
    *   `gray-matter`로 Frontmatter 파싱.
    *   `slug`는 파일명에서 `.md`를 제거한 값으로 사용.

### B. 그래프 추출기 (`src/lib/obsidian/graph.ts`)
*   **기능**: `getAllPosts()`로 가져온 포스트들을 분석하여 `GraphData` 생성.
*   **알고리즘**:
    1.  모든 포스트를 순회하며 `nodes` 배열 생성.
    2.  각 포스트의 `content`에서 정규식 `\[\[(.*?)\]\]`을 사용하여 내부 링크 추출.
    3.  추출된 링크의 대상이 실제로 존재하는지 확인 (선택 사항: 존재하지 않아도 'Ghost Node'로 표시할지 결정).
    4.  `links` 배열에 `{ source: 현재포스트, target: 링크대상 }` 추가.
    5.  링크가 많은 노드(Post)는 `val` 값을 높여서 그래프에서 더 크게 표시.

---

## 3. 검증 계획 (Verification Plan)

### 자동화 테스트 대신 '육안 검증' (빠른 개발을 위해)
1.  **임시 페이지 생성**: `/app/test/page.tsx` (나중에 삭제).
2.  **데이터 출력**:
    *   `getAllPosts()` 결과를 `JSON.stringify`로 화면에 출력.
    *   `getGraphData()` 결과를 화면에 출력.
3.  **체크리스트**:
    *   [ ] `beginning.md`와 `process.md`가 잘 읽히는가?
    *   [ ] `beginning` -> `process` 링크가 `links` 배열에 생성되었는가?
    *   [ ] 한글 파일명도 잘 처리되는가?

---

## 4. 파일 구조 변경
```diff
 src/
   lib/
     obsidian/
+      types.ts       (신규)
+      post.ts        (신규)
+      graph.ts       (신규)
```
