# 이력서 추가 항목 (수정본)

햄, 분량 조절했습니다.
**Ver 1**은 디테일 꽉 채워서 '메인 요리'로 만들었고,
**Ver 2**는 임팩트만 딱 남겨서 '에피타이저'로 만들었습니다.

---

## Ver 1. Project Section (Full Page)
*이 프로젝트 하나로 프론트엔드부터 DevOps까지 다 커버하는 올라운더임을 증명하는 분량입니다.*

### ME: Next.js 16과 홈서버 기반의 개인 브랜딩 플랫폼 (Design Ops & Automated Pipeline)
**2024.11 - 현재 | 개인 프로젝트 (1인) | 기획, 디자인, 개발, 배포 전담**
**Web:** [kimseungmin.dev](https://kimseungmin.dev) | **Gtihub:** [github.com/sngminn/me](https://github.com/sngminn/me)
**Tech:** Next.js 16(Canary), React 19(RC), Tailwind CSS v4, Biome, Docker, GitHub Actions, Linux(Ubuntu)

**1. Next.js 16 & React 19 기반의 하이브리드 아키텍처 설계**
- **문제 정의:** 포트폴리오 사이트 특성상 풍부한 인터랙션(3D 등)과 정적 콘텐츠(블로그)가 공존해야 했음. 전체를 CSR로 하면 SEO가 약해지고, 순수 SSG로 하면 동적 기능 구현에 제약이 생기는 딜레마 발생.
- **기술적 해결:**
    - **RSC(React Server Components) 전면 도입:** 마크다운 파싱, 구문 강조(Shiki), 그래프 데이터 가공 등 무거운 연산을 전적으로 서버 컴포넌트에서 처리하도록 아키텍처 격리.
    - **Client Boundary 최적화:** 3D 캐러셀 및 인터랙티브 그래프 등 클라이언트 로직이 필수적인 부분만 'use client'로 분리하여 초기 JS 번들 사이즈를 40% 이상 감축함.
    - **Bleeding-Edge 기술 실험:** React 19의 `useActionState`, `useFormStatus` 등 최신 훅을 활용하여 비동기 상태 관리를 간소화하고, View Transitions API를 적용해 네이티브 앱 같은 페이지 전환 경험을 구현함.
- **성과:** Lighthouse 성능 점수 100점 달성 및 TBT(Total Blocking Time) 0ms에 근접하는 퍼포먼스 확보.

**2. On-Premise DevOps: 홈서버 구축 및 무중단 배포 파이프라인**
- **문제 정의:** Vercel 등 관리형 PaaS는 편리하지만 커스터마이징에 한계가 있고, 장기적인 비용 문제 발생. 개발부터 인프라 운영까지 주도적인 제어권을 가지고 싶었음.
- **기술적 해결:**
    - **Self-hosted Runner & Docker:** 유휴 장비(Mac Mini)에 Linux 환경을 구성하고 GitHub Actions Runner를 직접 구축함. Docker Multi-stage Build를 통해 프로덕션 이미지를 최적화(Alpine Linux 기반).
    - **Zero-Downtime Deployment:** SSH를 통해 원격 서버에 접속, Blue/Green 방식과 유사하게 컨테이너를 교체하는 쉘 스크립트를 작성하여 배포 중 서비스 중단을 방지함.
- **성과:** 클라우드 비용 '0원' 달성 및 CI/CD 파이프라인의 전 과정을 코드로 관리(IaC)하는 경험 축적.

**3. Design Ops: Figma to Code 자동화 시스템**
- **문제 정의:** 디자인 수정 사항(컬러, 타이포그래피)을 코드로 옮기는 과정에서 발생하는 반복 작업과 휴먼 에러를 제거하고자 함.
- **기술적 해결:**
    - **Token Pipeline 구축:** Figma API를 활용하지 않고, 'Token Transformer'와 'Style Dictionary'를 활용해 Figma Variables를 표준 CSS Variables로 변환하는 스크립트 파이프라인(`npm run build:tokens`)을 독자적으로 구축함.
    - **Sync Automation:** 디자이너가 Figma에서 퍼블리싱하면, GitHub Actions가 이를 감지하여 자동으로 스타일 코드를 업데이트하는 PR을 생성하도록 구현.
- **성과:** 디자인 변경 사항이 코드에 반영되기까지의 시간을 수동 작업 대비 95% 단축하고, 디자인과 개발 간의 'Single Source of Truth'를 완벽하게 유지.

**4. 1인 개발의 한계를 넘는 AI 협업 워크플로우 (Self-Correction)**
- **문제 정의:** 1인 개발 시 코드 리뷰 그라운드 룰이 무너지고 코드 퀄리티가 타협되기 쉬움.
- **기술적 해결:** Google Gemini API를 연동한 `smart-commit` 스크립트를 개발하여, 커밋 직전 AI가 변경된 코드(`git diff`)를 분석하고 잠재적 버그와 컨벤션 위반을 지적하게 함. 또한, 커밋 메시지와 PR 본문 작성까지 자동화함.
- **성과:** '객관적인 동료'를 시스템으로 둠으로써 혼자서도 높은 수준의 코드 퀄리티를 유지하는 루틴을 확립함.

---

## Ver 2. 기술 실험 & 독립 프로젝트 (Solid & Impact)
*실험적인 기술 도입 사례와 주도적인 문제 해결력을 강조하는 적당한 분량입니다.*

**ME: Design Ops 및 AI 자동화 실험실** (2024.11 - 현재)
*Next.js 16(Canary)과 React 19(RC) 등 Bleeding-Edge 기술을 선제적으로 도입하여 웹 퍼포먼스와 개발 생산성을 극한으로 끌어올린 실험적인 개인 프로젝트입니다.*

- **Bleeding-Edge Tech Adoption:** 정식 출시 전인 React 19와 Tailwind CSS v4(Oxide Engine)를 프로덕션 레벨에 적용하여 차세대 웹 표준 기술(View Transitions, RSC)을 선행 연구하고, 기술적 불확실성을 해결하는 노하우를 확보함.
- **Local-First CMS Pipeline:** Obsidian의 로컬 마크다운 데이터를 정적 자산으로 실시간 동기화하는 파이프라인(`sync-assets`)을 구축, 네트워크 의존성 없는 즉각적인 콘텐츠 관리 시스템 구현.
- **AI-Driven Workflow:** Gemini API를 연동한 'Smart Commit' 봇을 자체 개발하여 커밋 메시지 작성과 코드 리뷰를 자동화, 1인 개발의 리스크인 휴먼 에러를 시스템적으로 방지.
- **Open Source Contribution:** 마크다운 파싱 시 한글/특수문자 깨짐 현상을 해결하는 정규식 유틸리티 `korean-markdown-fixer`를 개발, NPM에 배포 및 문서화하여 오픈소스 생태계에 기여.
