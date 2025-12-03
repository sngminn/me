# 옵시디언 파이프라인 아키텍처 문서

안녕하세요! 이 문서는 우리가 만든 **'옵시디언 파이프라인'**이 어떻게 동작하는지, 그리고 **왜 그렇게 만들었는지** 아주 상세하게 설명하는 문서예요.
햄이 작성하신 소중한 옵시디언 노트들이 웹사이트의 데이터로 변신하는 과정을 코드와 함께 살펴볼까요?

---

## 1. 전체적인 흐름 (Big Picture)

우리의 파이프라인은 크게 두 가지 일을 해요.

1.  **포스트 파싱 (Post Parsing)**: 마크다운 파일을 읽어서 제목, 날짜, 본문 내용을 가져와요.
2.  **그래프 추출 (Graph Extraction)**: 본문 속에 숨어있는 `[[링크]]`를 찾아서, 글과 글 사이의 관계(연결)를 찾아내요.

---

## 2. 상세 로직과 이유 (Logic & Why)

### A. 포스트 파서 (`src/lib/obsidian/post.ts`)

가장 먼저 파일을 읽어서 메타데이터와 본문을 분리해야 해요.

**Q. 왜 `gray-matter`를 썼나요?**
A. 마크다운 파일 맨 위에 있는 `---`로 감싸진 부분(Frontmatter)을 가장 안정적으로 파싱해주는 라이브러리라서 선택했어요.

**💻 코드 예시:**
```typescript
// 파일 내용을 읽어와서
const fileContents = fs.readFileSync(fullPath, "utf8");

// gray-matter로 메타데이터(data)와 본문(content)을 분리해요
const { data, content } = matter(fileContents);

return {
  slug,
  title: data.title || slug, // 제목이 없으면 파일명으로 대체!
  date: data.date || "",
  tags: data.tags || [],
  content,
};
```

### B. 그래프 추출기 (`src/lib/obsidian/graph.ts`)

여기가 핵심이에요! 글과 글 사이의 연결 고리를 찾아내는 작업이죠.

**Q. 왜 정규식(Regex)을 썼나요?**
A. 마크다운 전체를 분석(AST Parsing)하는 것보다, 단순히 `[[...]]` 패턴만 찾는 데에는 정규식이 훨씬 빠르고 간편하기 때문이에요.

**💻 코드 예시:**
```typescript
// [[링크]] 또는 [[링크|텍스트]] 패턴을 찾아요
const regex = /\[\[(.*?)\]\]/g;

while ((match = regex.exec(post.content)) !== null) {
  let linkTarget = match[1];
  
  // [[링크|텍스트]] 형태라면 '|' 앞부분만 가져와요
  if (linkTarget.includes("|")) {
    linkTarget = linkTarget.split("|")[0];
  }
  // ...
}
```

### C. 유령 노드 (Ghost Node)

**Q. '유령 노드'가 뭔가요? 왜 필요한가요?**
A. 옵시디언을 쓰다 보면, 아직 작성하지 않은 문서로 링크를 걸어두는 경우가 많아요. (예: `[[나중에 쓸 글]]`)
파일이 없다고 해서 이 링크를 무시하면, 햄의 **'생각의 흐름'**이 끊겨 보이게 돼요.
그래서 파일은 없지만 연결된 노드를 **'유령 노드'**라고 부르고 그래프에 표시해주기로 했어요.

**💻 코드 예시:**
```typescript
// 링크 대상(targetSlug)이 실제 파일로 존재하는지 확인해요
let targetSlug = slugMap.get(linkTarget.toLowerCase());

// 파일이 없다면? 유령 노드로 만들어요!
if (!targetSlug) {
  targetSlug = linkTarget.replace(/\s+/g, "-").toLowerCase();
  
  // 노드 목록에 없다면 추가 (중복 방지)
  if (!nodes.find(n => n.id === targetSlug)) {
    nodes.push({
      id: targetSlug,
      name: linkTarget,
      val: 0.5, // 유령이니까 크기를 좀 작게(0.5) 설정해요
    });
  }
}
```

---

## 3. 데이터 구조 (Type Definitions)

최종적으로 만들어지는 데이터의 형태예요.

```typescript
// 게시글 하나
interface Post {
  slug: string;    // 고유 ID (파일명)
  title: string;   // 글 제목
  content: string; // 본문 내용
  // ...
}

// 그래프 데이터
interface GraphData {
  nodes: {
    id: string;   // 노드 ID (slug)
    name: string; // 화면에 표시될 이름
    val: number;  // 노드 크기 (연결이 많을수록 커져요!)
  }[];
  links: {
    source: string; // 시작점 ID
    target: string; // 도착점 ID
  }[];
}
```

---

## 4. 마치며

이렇게 만들어진 데이터는 이제 **3D 그래프**로 시각화될 준비를 마쳤어요.
햄의 머릿속이 어떻게 연결되어 있는지, 곧 화면에서 보실 수 있을 거예요!

더 궁금한 점이나 수정하고 싶은 로직이 있다면 언제든 말씀해주세요.
항상 열려있답니다!
