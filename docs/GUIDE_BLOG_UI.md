# 📘 블로그 UI 및 네비게이션 구현 가이드 (Next.js 16 + React 19)

햄! 요청하신 대로 **Next.js 16 (App Router)**와 **React 19** 환경에 맞춘 블로그 UI 구현 가이드를 준비했습니다.
프론트엔드가 낯설어도 괜찮아요! 하나씩 아주 자세하게 설명해 드릴게요.

---

## 0. 기초 개념 잡기 (Basics)

### Q. MDX가 뭔가요?
**MDX = Markdown + JSX (React)**
쉽게 말해 **"살아있는 마크다운"**입니다.
보통 마크다운은 글자만 쓸 수 있지만, MDX를 쓰면 마크다운 문서 안에 **리액트 컴포넌트**를 집어넣을 수 있어요.
예를 들어, 글 중간에 `<Button>클릭</Button>` 같은 버튼을 넣거나, 움직이는 그래프를 넣을 수도 있죠.
우리는 블로그 글을 예쁘게 보여주기 위해 이 기술을 사용합니다.

### Q. Server Component가 뭔가요?
**"서버에서 미리 다 만들어서 보내주는 부품"**입니다.
사용자 브라우저(크롬 등)에서 자바스크립트로 화면을 그리는 게 아니라, 서버에서 HTML을 완성해서 보내주니까 **속도가 엄청 빠르고 검색엔진(SEO)에도 좋아요.**
우리는 가능한 모든 페이지를 서버 컴포넌트로 만들 겁니다.

---

## 1. 컴포넌트 구조 (Component Structure)

우리가 만들 파일들은 이런 역할을 해요.

*   `Sidebar.tsx`: **메뉴판** 역할. 왼쪽에 글 목록을 보여줘요.
*   `PostLayout.tsx`: **액자** 역할. 메뉴판과 본문을 예쁘게 배치해줘요.
*   `app/posts/[slug]/page.tsx`: **진짜 페이지**. 주소창에 입력한 글을 찾아서 보여줘요.

---

## 2. 단계별 구현 (Step-by-Step)

### Step 1: 사이드바 컴포넌트 만들기

**파일 위치**: `src/components/layout/Sidebar.tsx` (파일이 없으면 만들어주세요!)

이 컴포넌트는 글 목록(`posts`)을 받아서 링크(`Link`)로 만들어줍니다.

```tsx
// Link: 페이지 이동할 때 쓰는 Next.js 전용 태그 (a 태그보다 빨라요!)
import Link from "next/link";
// Post: 우리가 정의한 글 데이터 모양 (타입)
import { Post } from "@/lib/obsidian/types";
// cn: 클래스 이름을 조건부로 합쳐주는 유틸리티 (우리가 만들었죠?)
import { cn } from "@/lib/utils/cn";

// SidebarProps: 이 컴포넌트가 받을 재료들의 목록표
interface SidebarProps {
  posts: Post[];          // 전체 글 목록
  relatedPosts?: Post[];  // 연관된 글 목록 (있을 수도 있고 없을 수도 있음 -> ?)
  className?: string;     // 추가로 꾸밀 스타일
}

// export function: 다른 파일에서 갖다 쓸 수 있게 내보낸다는 뜻
export function Sidebar({ posts, relatedPosts, className }: SidebarProps) {
  return (
    // aside: 사이드바 같은 부가 정보를 담는 태그
    // hidden md:block: 모바일엔 숨기고(hidden), 중간 화면(md)부터 보임(block)
    <aside className={cn("w-64 shrink-0 hidden md:block", className)}>
      <div className="sticky top-8 space-y-8">
        
        {/* 1. 연관 포스트 (relatedPosts가 있을 때만 보여줌) */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div>
            <h3 className="font-bold text-sm text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
              Related
            </h3>
            <ul className="space-y-2">
              {relatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`} // 클릭하면 이 주소로 이동!
                    className="block text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 2. 전체 포스트 목록 */}
        <div>
          <h3 className="font-bold text-sm text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
            All Posts
          </h3>
          <ul className="space-y-2">
            {/* posts 배열을 돌면서 하나씩 리스트(li)로 만듦 */}
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="block text-sm text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
```

### Step 2: 포스트 레이아웃 만들기

**파일 위치**: `src/components/layout/PostLayout.tsx`

이 컴포넌트는 **[사이드바] + [본문]** 형태를 잡아주는 틀입니다.

```tsx
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Post } from "@/lib/obsidian/types";

interface PostLayoutProps {
  children: ReactNode; // children: 이 레이아웃 안에 들어올 '본문 내용'
  allPosts: Post[];    // 사이드바에 넘겨줄 전체 글 목록
  relatedPosts?: Post[]; // 사이드바에 넘겨줄 연관 글 목록
}

export function PostLayout({ children, allPosts, relatedPosts }: PostLayoutProps) {
  return (
    // 전체 배경색 설정 (다크모드 지원)
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* 중앙 정렬 컨테이너 */}
      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-12">
        
        {/* 왼쪽: 사이드바 (우리가 만든 거!) */}
        <Sidebar posts={allPosts} relatedPosts={relatedPosts} />

        {/* 오른쪽: 메인 컨텐츠 (여기에 글 내용이 들어감) */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Step 3: 상세 페이지 구현 (Next.js 16 핵심)

**파일 위치**: `app/posts/[slug]/page.tsx` (폴더 없으면 만들어주세요!)

여기가 마법이 일어나는 곳입니다. 주소창의 `slug`를 읽어서 해당 글을 찾아 보여줍니다.

```tsx
import { notFound } from "next/navigation"; // 404 페이지 띄우는 함수
import { MDXRemote } from "next-mdx-remote/rsc"; // MDX를 HTML로 바꿔주는 도구
import { getAllPosts, getPostBySlug } from "@/lib/obsidian/post"; // 우리가 만든 데이터 함수들
import { PostLayout } from "@/components/layout/PostLayout"; // 방금 만든 레이아웃

// 페이지가 받을 재료 (주소창의 slug)
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 1. 정적 경로 생성 (빌드 최적화)
// 미리 어떤 글들이 있는지 Next.js에게 알려줘서, HTML을 미리 만들어두게 함 (엄청 빨라짐!)
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// 2. 실제 페이지 컴포넌트
// async: 데이터를 가져와야 하니까 '비동기'로 동작함
export default async function PostPage({ params }: PageProps) {
  // Next.js 15/16부터는 주소창 파라미터(params)를 기다렸다가(await) 꺼내야 함
  const { slug } = await params;

  // 글 데이터 가져오기
  const post = getPostBySlug(slug);
  const allPosts = getAllPosts();

  // 글이 없으면? 404 페이지 보여주기
  if (!post) {
    notFound();
  }

  return (
    // 레이아웃으로 감싸기
    <PostLayout allPosts={allPosts}>
      {/* article: 글 본문을 감싸는 태그 */}
      {/* prose: Tailwind Typography 플러그인. 마크다운 스타일을 예쁘게 잡아줌 */}
      <article className="prose dark:prose-invert max-w-none">
        {/* 제목 */}
        <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
        
        {/* 날짜 */}
        <div className="mb-8 text-zinc-500 dark:text-zinc-400 text-sm">
          {post.date}
        </div>
        
        {/* 본문 내용 (MDX -> HTML 변환) */}
        <MDXRemote source={post.content} />
      </article>
    </PostLayout>
  );
}
```

---

## 3. 요약 (Summary)

1.  **MDX**: 마크다운을 웹페이지로 예쁘게 보여주는 기술.
2.  **구조**: `Sidebar`(메뉴) -> `PostLayout`(틀) -> `Page`(내용) 순서로 조립.
3.  **데이터 흐름**: `post.ts`에서 파일 읽기 -> `Page`에서 데이터 받기 -> `MDXRemote`로 화면에 뿌리기.

천천히 따라 해보시고, "이 코드는 왜 여기 있지?" 싶은 게 있으면 바로 물어봐주세요!
