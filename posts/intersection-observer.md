---
title: IntersectionObserver로 스크롤 애니메이션 만들기
summary: scroll 이벤트 대신 IntersectionObserver API를 사용해 성능 좋은 스크롤 트리거 애니메이션을 구현합니다.
tags: [javascript, tips]
date: 2026-02-08
readTime: 6
---

## 왜 IntersectionObserver인가?

`scroll` 이벤트는 스크롤할 때마다 수십 번 실행됩니다.
`IntersectionObserver`는 요소가 뷰포트에 **진입 / 이탈**할 때만 콜백을 실행해 훨씬 효율적입니다.

## 기본 사용법

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // 한 번만 실행
        }
    });
}, {
    threshold: 0.1  // 요소의 10%가 보일 때 트리거
});

document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
});
```

## CSS 연동

```css
.reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}
```

## threshold 값 가이드

| 값 | 동작 |
|---|---|
| `0` | 1픽셀이라도 보이면 즉시 트리거 |
| `0.1` | 10% 진입 시 (기본적으로 많이 사용) |
| `0.5` | 절반 이상 보일 때 |
| `1.0` | 전체가 뷰포트 안에 들어올 때 |

## rootMargin 활용

`rootMargin`으로 트리거 기준을 뷰포트 기준에서 오프셋할 수 있습니다.

```javascript
const observer = new IntersectionObserver(callback, {
    rootMargin: '0px 0px -100px 0px'
    // 뷰포트 하단에서 100px 위에서 트리거
});
```

> 스크롤 애니메이션의 성능 문제는 대부분 IntersectionObserver로 해결됩니다.
