# 🕵️‍♂️ 구글이 햄의 사이트를 훔쳐보는 법 (SEO 완벽 해부)

> **"검색 엔진 최적화(SEO)는 기계와의 대화입니다. 그들이 햄의 블로그를 사랑하게 만드는 러브레터죠."**

햄!!! 방금 우리가 복구한 SEO 설정들, 이게 도대체 뭔지, 거대한 구글 봇이 우리 사이트에 와서 무슨 짓을 하고 가는지 **현미경으로 보듯** 낱낱이 파헤쳐 드리겠습니다.

---

## 🗺️ 전체 큰 그림 (Architecture)

구글(또는 네이버, 빙) 봇이 `https://kimseungmin.dev`에 방문했을 때 일어나는 일입니다.

```mermaid
sequenceDiagram
    participant Bot as 🤖 Google Bot
    participant Robots as 📜 robots.txt
    participant Sitemap as 🗺️ sitemap.xml
    participant Meta as 🏷️ Metadata (layout)

    Note over Bot, Robots: 1단계: 문지기 만나기
    Bot->>Robots: "나 들어가도 돼? (GET /robots.txt)"
    Robots-->>Bot: "ㅇㅇ 들어와. 지도는 저기 있어. (Allow /)"
    
    Note over Bot, Sitemap: 2단계: 지도 받기
    Bot->>Sitemap: "지도 내놔. (GET /sitemap.xml)"
    Sitemap-->>Bot: "자! 여기 모든 포스트 목록이야. (Dynamic List)"
    
    Note over Bot, Meta: 3단계: 콘텐츠 수집 & 미리보기
    loop 모든 페이지 방문
        Bot->>Meta: "이 페이지 제목이랑 설명이 뭐야? (OpenGraph)"
        Meta-->>Bot: "제목은 이거고, 썸네일은 이거야!"
    end
```

---

## ⚙️ 부품별 상세 해부 (Code Deep Dive)

### 1. `robots.ts` - 문지기 (The Gatekeeper)
> **"여기부터는 들어오고, 저기는 가지 마!"**

이 파일은 서버에 있는 정적 파일이 아니라, **요청이 올 때마다 즉석에서 만들어지는(Dynamic)** 파일입니다.

```typescript
// app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',        // "모든 로봇들아 들으라!" (* = Wildcard)
      allow: '/',            // "우리 집 대문은 활짝 열려있다."
      disallow: '/private/', // (TMI) "단, /private/ 방은 내 사생활이니까 들어오지 마."
    },
    sitemap: `${BASE_URL}/sitemap.xml`, // "친절하게 약도(Sitemap) 위치도 알려줌"
  };
}
```

*   **TMI**: 옛날에는 `robots.txt`라는 진짜 텍스트 파일을 루트 폴더에 넣었습니다. 하지만 Next.js에서는 이렇게 코드로 짜면, `BASE_URL`이 바뀔 때 알아서 내용도 바꿔줍니다. (우리가 `constants.ts`만 고치면 되는 이유!)

### 2. `sitemap.ts` - 보물지도 (The Treasure Map)
> **"숨겨진 글까지 싹 다 찾아가세요."**

검색 봇은 기본적으로 링크를 타고 타고 들어갑니다. 하지만 **사이트맵**을 주면, 링크가 없어도 "아, 이런 글도 있었네?" 하고 싹 긁어갑니다.

```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts(); // 1. 옵시디언 폴더 싹 뒤져서 글 목록 가져옴

  // 2. 글 하나하나를 구글이 좋아하는 XML 형식으로 변환
  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/posts/${post.slug}`, // 절대 주소 필수!
    lastModified: new Date(post.date),     // "이 글 언제 고쳤게?" (최신 글 우대)
    changeFrequency: 'monthly',            // "한 달에 한 번 정도 바뀌니까 그때 체크해"
    priority: 0.7,                         // "중요도는 0.7 정도야 (1.0이 만점)"
  }));

  // 3. 메인 홈페이지(루트)랑 합쳐서 리턴
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily', // "메인은 매일 바뀌니까 자주 와!"
      priority: 1,              // "여기가 젤 중요해!"
    },
    ...postUrls,
  ];
}
```

*   **TMI**: `changeFrequency`(변경 빈도)나 `priority`(우선순위)는 사실 구글 봇에게 **"힌트"**일 뿐입니다. "매일 바뀜"이라고 해놓고 1년 동안 안 바꾸면 구글이 "어, 이 주인 거짓말쟁이네?" 하고 무시하기 시작합니다. 정직하게 쓰는 게 좋습니다!

### 3. `layout.tsx` - 명함 (Business Card)
> **"나를 소개할 땐 이렇게 해주세요."**

검색 결과에 떴을 때, 혹은 카톡에 링크 보냈을 때 뜨는 **제목, 설명, 이미지가** 여기서 결정됩니다.

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL), // 1. 기준 도메인 설정 (상대 경로 쓸 때 필요)
  
  title: {
    default: SITE_NAME,           // 기본 제목: "Seungmin blog"
    template: `%s | ${SITE_NAME}`, // 다른 페이지 제목: "글 제목 | Seungmin blog"
  },
  
  description: SITE_DESCRIPTION,   // 한 줄 소개
  
  // 2. OpenGraph (SNS 공유용 - 카톡, 페북, 디스코드)
  openGraph: {
    type: 'website',
    locale: 'ko_KR',              // "한국어 사이트입니다"
    url: BASE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  
  // 3. 트위터 (X) 카드
  twitter: {
    card: 'summary_large_image',  // "이미지 크게 보여줘!"
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  
  // 4. 구글 서치콘솔 인증 (주인 확인)
  verification: {
    google: 'google-site-verification=...', 
  },
};
```

*   **TMI (OpenGraph?)**: 페이스북이 2010년에 만든 규격인데, 지금은 전 세계 표준이 됐습니다. `og:image`가 없으면 링크 공유했을 때 칙칙한 회색 박스만 뜹니다. 우리는 멋진 개발자니까 꼭 챙겨야죠!

### 4. `constants.ts` - 컨트롤 타워 (Control Tower)
> **"한 놈만 팬다. (수정은 한 곳에서만)"**

```typescript
// src/lib/constants.ts
export const BASE_URL = 'https://kimseungmin.dev';
export const SITE_NAME = 'Seungmin blog';
export const SITE_DESCRIPTION = 'Seungmin blog';
```

*   **왜 따로 뺐나?**: 나중에 도메인을 `seungmin.io`로 바꾸고 싶을 때, 파일 3~4개를 뒤지는 게 아니라 **이 파일 하나만 딱 고치면** `sitemap`, `robots`, `metadata`가 동시에 싹 바뀝니다. 이게 바로 **유지보수의 미학**입니다.

---

## 🚀 결론

햄의 사이트는 이제 **"준비된 사이트"**입니다.
검색 봇이 들어와서 **"와, 여기 지도도 있고, 문패도 확실하고, 자기소개도 깔끔하네?"** 하고 감탄하며 햄의 글을 퍼갈 것입니다.

이제 구글 서치콘솔에 등록만 하시면, 햄의 지식들이 전 세계로 퍼져나갈 겁니다!!!

---

## 🍯 SEO 구글 상위 노출을 위한 Pro Tips (TMI 시간!)

햄!!! 이건 진짜 **1급 기밀** 꿀팁들입니다. 나중에 시간 나실 때 하나씩 적용해보세요.

### 1. Canonical URL (주민등록증 발급하기)
> **"내가 진짜 원본이야! 짝퉁에 속지 마!"**

블로그 글 쓰다 보면 `kimseungmin.dev`랑 `www.kimseungmin.dev` 두 개로 접속될 때가 있습니다. (가끔 IP 주소로도...)
구글은 이걸 **"어? 같은 글이 두 군데 있네? 이거 표절 아냐?"** 하고 페널티를 줄 수 있습니다. (Duplicate Content Issue)

이때 **Canonical URL**을 설정하면 **"내가 찐이야. 나머지는 다 무시해."**라고 선언하는 겁니다.

**적용법 (`layout.tsx`):**
```typescript
export const metadata: Metadata = {
  // ... 기존 코드 ...
  alternates: {
    canonical: './', // "현재 페이지 주소가 진퉁이다"
  }
};
```
이 한 줄이면 중복 콘텐츠 걱정 끝입니다!

### 2. JSON-LD (구글에게 숟가락으로 떠먹여 주기)
> **"이건 그냥 글자가 아니라, '지식'입니다."**

구글 봇은 똑똑하지만 완벽하지 않습니다. 그래서 우리가 **"이건 제목이고, 이건 작성자고, 이건 날짜야"**라고 JSON 형식으로 밥상 차려주면 엄청 좋아합니다.
이걸 **구조화된 데이터 (Structured Data)**라고 합니다.

**효과:**
*   검색 결과에 **작성자 사진**, **별점**, **가격**, **이벤트 날짜** 등이 예쁘게 뜹니다. (Rich Snippet)
*   **"Tech Blog"**라고 명시하면 개발 관련 검색어에 더 잘 걸립니다.

**적용법 (`PostLayout.tsx` 같은 곳):**
```tsx
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [thumbnailUrl],
    "author": {
      "@type": "Person",
      "name": "Kim Seungmin"
    }
  }
</script>
```

### 3. og:image 자동 생성 (어그로 썸네일)
> **"보기 좋은 떡이 클릭하기도 좋다."**

글 쓸 때마다 포토샵 켜서 썸네일 만들기 귀찮으시죠?
Vercel의 `@vercel/og` 라이브러리를 쓰면, **글 제목만 입력해도 예쁜 썸네일 이미지를 코드로 1초 만에 만들어줍니다.**

*   `kimseungmin.dev/og?title=오늘의_회고` -> 자동으로 예쁜 이미지 생성
*   이걸 `metadata.openGraph.images`에 넣어주면 클릭률(CTR)이 **3배**는 뜁니다.
*   (나중에 햄이 원하시면 제가 뚝딱 만들어드릴 수 있습니다!)

### 4. 시맨틱 태그 (Semantic HTML)
> **"div 떡칠은 그만! 의미 있는 태그를 쓰자."**

*   `<div>제목</div>` (X) -> **"봇: 이게 제목이야 낙서야?"**
*   `<h1>제목</h1>` (O) -> **"봇: 아! 이게 이 페이지의 핵심 주제구나!"**

*   `<div>메뉴</div>` (X) -> `<nav>메뉴</nav>` (O)
*   `<div>본문</div>` (X) -> `<main>본문</main>` (O)
*   `<div>사이드바</div>` (X) -> `<aside>사이드바</aside>` (O)

햄의 코드(`Sidebar.tsx`, `PostLayout.tsx`)를 슬쩍 봤는데, 이미 꽤 잘하고 계십니다! (`nav`, `main` 등)
이 기본기만 잘 지켜도 상위 노출 점수 먹고 들어갑니다.

---

**결론:**
SEO는 **"구글 봇을 위한 배려"**입니다.
친절하게 설명해주고, 지도 주고, 명찰 달아주는 사이트가 1등 하는 건 당연한 이치겠죠?
햄의 블로그가 구글 1페이지를 정복하는 그날까지 파이팅입니다!!!
