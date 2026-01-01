# 3D Cover Flow Carousel Implementation Guide

## 1. Overview
이 문서는 프로젝트에 구현된 **3D Cover Flow Carousel**의 기술적 세부사항, 컴포넌트 구조, 핵심 로직 및 스타일링 기법을 상세하게 정리한 기술 문서입니다.

### 핵심 컨셉 (Hybrid Architecture)
- **Physics**: CSS Scroll Snap (`snap-x`, `snap-center`)을 사용하여 브라우저 네이티브의 부드러운 스크롤 경험을 제공합니다.
- **Visuals**: Framer Motion (`useScroll`, `useTransform`)을 사용하여 스크롤 위치에 연동된 3D 회전, 스케일링, 투명도 조절 효과를 부여합니다.
- **Sync**: Intersection Observer를 사용하여 현재 활성화된 아이템을 감지하고 타이틀을 동기화합니다.

---

## 2. Directory Structure & Dependencies

### 파일 구조
```
src/
├── components/
│   ├── home/
│   │   ├── carousel/
│   │   │   ├── CarouselContainer.tsx  # 메인 컨테이너 (스크롤 & 옵저버)
│   │   │   ├── CarouselItem.tsx       # 개별 카드 (3D 트랜스폼)
│   │   │   ├── TitleSync.tsx          # 타이틀 동기화 컴포넌트
│   │   │   └── constants.ts           # 설정 상수 (Overlap 값 등)
```

### 필수 라이브러리
- `framer-motion`: 애니메이션 및 스크롤 값 추적
- `clsx` / `tailwind-merge`: (Optional) 클래스명 조합

---

## 3. Component Deep Dive

### A. CarouselContainer.tsx
캐러셀의 전체적인 레이아웃과 스크롤 동작을 제어하며, 현재 보고 있는 아이템(`activeIndex`)을 관리합니다.

#### 주요 로직 1: Center Line Detection (Intersection Observer)
타이틀 동기화의 정확도를 높이기 위해, 아이템이 화면의 "정중앙 선"을 건드리는 순간을 감지합니다.
```typescript
const observer = new IntersectionObserver(callback, {
  root: container,
  threshold: 0, 
  rootMargin: '0px -50% 0px -50%' // 뷰포트 좌우를 50%씩 깎아서 중앙선만 남김
});
```
이 방식은 카드가 조금이라도 중앙을 벗어나면 즉시 이전/다음 상태로 전환되도록 보장합니다.

#### 주요 로직 2: Responsive Padding Calculation
첫 번째 카드와 마지막 카드가 스크롤 끝에 도달했을 때 정확히 화면 중앙에 위치하도록 패딩을 동적으로 계산합니다.
```typescript
style={{
  // 왼쪽 패딩: (화면너비 - 카드너비) / 2
  paddingLeft: 'calc(50vw - min(40vw, 200px))',
  // 오른쪽 패딩: 왼쪽 패딩 + 겹침 보정값(OVERLAP)
  paddingRight: `calc(50vw - min(40vw, 200px) + ${CAROUSEL_OVERLAP}px)`
}}
```

---

### B. CarouselItem.tsx
개별 카드의 3D 효과와 위치 계산을 담당하는 핵심 컴포넌트입니다.

#### 주요 로직 1: Absolute Center Calculation
부모의 패딩이나 마진에 의존하지 않고, 절대적인 화면 중앙 좌표를 계산합니다.
```typescript
// 공식: (내 왼쪽 오프셋 + 내 너비의 절반) - (화면 전체 너비의 절반)
const centerScroll = el.offsetLeft + width / 2 - window.innerWidth / 2;
```
이 값(`myPosition`)은 "스크롤이 이 값일 때 나는 화면 정중앙에 있다"를 의미합니다.

#### 주요 로직 2: 3D Transforms Map
스크롤 위치(`containerScrollX`)와 내 위치(`myPosition`)의 거리에 따라 스타일을 변형합니다.
- `range`: `[myPosition - totalWidth, myPosition, myPosition + totalWidth]`
- **RotateY**: `[20, 0, -20]` (왼쪽에서 오면 20도, 중앙 0도, 오른쪽 가면 -20도)
- **TranslateZ**: `[-50, 0, -50]` (양옆은 뒤로 들어감)
- **Z-Index**: `[0, 10, 0]` (중앙에 있는 카드가 스택킹 컨텍스트 최상위)

#### 주요 로직 3: Negative Margin (Cover Flow Effect)
카드를 겹치게 하기 위해 음수 마진을 사용합니다.
```typescript
style={{ marginRight: -CAROUSEL_OVERLAP }}
```
이때 겹친 만큼 애니메이션 타이밍(`totalWidth`)도 보정(`cardWidth - OVERLAP`)해야 3D 효과가 자연스럽습니다.

---

### C. TitleSync.tsx
활성화된 포스트 정보를 표시합니다.

#### 주요 로직: Derived State for Direction
Props로 들어오는 `activeIndex`와 이전 `activeIndex`를 비교하여 스크롤 방향(좌/우)을 감지합니다. 이 방향값(`custom`)을 `AnimatePresence`에 전달하여 텍스트가 슬라이드되는 방향을 결정합니다.

---

## 4. Styling Checklist (CSS/Tailwind)

### 필수 클래스
1.  **Perspective** (`.perspective-midrange` 등): 3D 원근감을 위해 부모 컨테이너에 반드시 필요합니다.
    ```css
    perspective: 2000px; /* 값이 작을수록 원근감이 심함 */
    ```
2.  **Transform Style** (`.transform-3d`): 자식 요소의 3D 효과를 유지하기 위해 필요합니다.
    ```css
    transform-style: preserve-3d;
    ```
3.  **Scroll Snap**:
    - Container: `snap-x snap-mandatory scroll-smooth`
    - Item: `snap-center`

---

## 5. Troubleshooting (FAQ)

**Q. 양 끝 카드가 중앙에 안 오고 잘려요.**
A. `CarouselContainer`의 `paddingLeft` / `paddingRight` 계산식이 잘못되었을 가능성이 큽니다. 카드 너비(`min(40vw, 200px)`)가 변경되었다면 패딩 계산식도 맞춰주세요.

**Q. 카드가 겹칠 때 순서가 이상해요 (뒤에 있는 게 앞으로 옴).**
A. `CarouselItem`의 `zIndex` 트랜스폼이 적용되었는지 확인하세요. 또한 `translateZ` 값만으로는 DOM 순서를 이길 수 없으므로 `zIndex` 명시가 필수입니다.

**Q. 타이틀이 한 박자 늦게 떠요.**
A. `CarouselContainer`의 `IntersectionObserver` 옵션 중 `rootMargin`을 확인하세요. `threshold: 0`과 `0px -50% ...` 조합이어야 칼같이 반응합니다.

**Q. 모바일에서 스크롤바가 보여요.**
A. `global.css` 혹은 유틸리티 클래스에 `.hide-scrollbar` (webkit-scrollbar: none)가 적용되어 있는지 확인하세요.

---

## 6. Challenges & Solutions (Retrospective)

개발 과정에서 마주친 주요 난관들과 그 해결책을 기록합니다.

### 🛑 Issue 1: 스크롤 위치 불일치 (Misalignment)
- **증상**: 카드가 화면 중앙에 왔는데도 3D 회전이 완전히 펴지지 않거나(0도가 아님), 약간 기울어진 상태로 멈춤.
- **원인**: 초기 구현에서 `offsetLeft`를 그대로 사용했으나, 부모 컨테이너의 `padding`이나 `margin` 값에 따라 상대 좌표가 달라져 오차가 발생함.
- **해결**: "절대 중앙"을 찾는 공식 도입.
  > `(내 위치 + 내 절반) - (화면 절반)` = `0` (중앙)
  > 이 공식은 부모의 스타일이나 패딩과 무관하게, 뷰포트 절대 좌표를 기준으로 0점을 잡아내므로 오차가 원천 차단됨.

### 🛑 Issue 2: 겹침 효과와 Z-Index 싸움
- **증상**: `margin`을 음수로 줘서 카드를 겹치게 했더니, 오른쪽(다음) 카드가 왼쪽(현재) 카드 위를 덮어버림. (DOM 순서상 뒤에 있는 요소가 위로 올라오는 기본 동작)
- **원인**: `preserve-3d` 환경에서는 `translateZ`가 영향을 주지만, 겹침 정도가 심하면 DOM 스택킹 컨텍스트가 우선됨.
- **해결**: `useTransform`으로 `zIndex`를 동적 제어.
  > 중앙에 가까울수록 `zIndex: 10`, 멀어지면 `0`. 강제로 현재 카드를 최상단으로 끌어올림.

### 🛑 Issue 3: 마지막 카드가 잘림 (Clipping)
- **증상**: 스크롤을 끝까지 밀었는데도 마지막 카드가 화면 중앙에 오지 못하고 오른쪽에 처박힘.
- **원인**: 카드를 겹치면서(`OVERLAP`) 전체 스크롤 길이는 줄어들었는데, 컨테이너 오른쪽 패딩은 그대로라서 스크롤이 더 갈 수 있는 공간이 부족해짐.
- **해결**: 패딩에 `OVERLAP` 값을 더해줌.
  > `paddingRight: calc(DefaultPadding + OVERLAP)`

### 🛑 Issue 4: 타이틀 싱크 엇박자
- **증상**: 스크롤을 빠르게 넘길 때 타이틀이 한 템포 늦게 바뀌거나, 지나간 카드의 타이틀이 잠깐 뜸.
- **원인**: `IntersectionObserver`의 `threshold: 0.5` (50% 보임) 설정이 겹쳐진 카드들 사이에서는 부정확했음.
- **해결**: "레이저 라인" 기법 도입.
  > `rootMargin: '0px -50% 0px -50%'`
  > 뷰포트 좌우를 다 잘라내고 정중앙 1px만 감지하게 하여, 정확도 100% 달성.

