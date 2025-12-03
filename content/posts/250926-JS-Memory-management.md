---
title: 자바스크립트의 메모리 관리
date: 2025-09-26
updated: 2025-09-26
tags:
  - status/growing
  - type/web
published: false
aliases: []
---
# [[250926-JavaScript|자바스크립트]]의 메모리 관리
- a라는 변수를 1로 선언한다고 가정함
- [[250926- Primitive-Type|원시 타입]] 기준, 자바스크립트에서는 메모리 두 곳을 할당한다.

1. 값을 담을 메모리 공간
2. 1번을 [[250926-Reference|참조]] 중이며, 변수 이름 'a'가 담긴 메모리 공간

이후 `a = 2`와 같이 변수 a의 값을 변경하면,
a는 2라는 값이 담긴 새로운 메모리 공간을 만들고, 해당 주소를 참조한다.
1이라는 값이 담긴 메모리 공간은 버려지고, 이후 [[250926-Garbage-collector|가비지 콜렉터]]가 정리한다.

그리고 `let b = a`와 같이 변수를 복제하면,
변수 b는 a가 참조하고 있던 메모리 주소를 그대로 가져온다.
여기까진 마치 [[250926-Reference-Type|참조 타입]]처럼 동작한다.
다만 데이터를 [[250926-stack|stack]]에 넣는다는 점이 다르다.
참조 타입은 [[250926-heap|heap]]에 집어넣음

여기까지의 동작 방식을 [[250926-Implicit-Sharing|Implicit Sharing(암묵적 공유)]]이라고 한다.

하지만 `b = 3`과 같이 변수를 변경하면, 해당 값이 담긴 새로운 메모리를 할당하고, 그 주소를 참조한다.

이런 동작 방식을 [[250926-Copy-on-Write|Copy-on-Write]]라고 한다.

결국 [[250926-JS-Immutable|불변성]]을 가지고 있다는 것
참조 타입은 [[250926-Mutable|가변성]]이다.

[[250926-Reference-vs-Primitive|그럼 정확히 뭐가 다름??]]

[정말 자세히 알아보기](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Memory_management)