---
title: CSS 변수로 디자인 시스템 만들기
summary: CSS Custom Properties를 활용해 일관성 있고 유지보수하기 쉬운 디자인 시스템을 구축하는 방법을 소개합니다.
tags: [css, web]
date: 2026-02-20
readTime: 4
---

## CSS 변수란?

`--`로 시작하는 CSS Custom Properties는 값을 변수처럼 재사용할 수 있게 해줍니다.
Sass 변수와 달리 **런타임에도 변경이 가능**해 훨씬 유연합니다.

```css
:root {
    --color-primary: #7c3aed;
    --space-4: 1rem;
    --radius-md: 10px;
}

.button {
    background: var(--color-primary);
    padding: var(--space-4);
    border-radius: var(--radius-md);
}
```

## 디자인 토큰으로 활용하기

색상, 간격, 폰트 크기를 변수로 정의하면 **테마 변경이 한 곳에서** 이루어집니다.
다크 모드도 미디어 쿼리 안에서 변수 값만 바꾸면 됩니다.

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-primary: #a78bfa;
        --color-bg: #0f0f13;
        --color-text-primary: #f9fafb;
    }
}
```

## 네이밍 전략

변수명은 *용도* 중심으로 짓는 게 좋습니다.

- **나쁜 예**: `--color-blue` → 색이 바뀌면 이름이 거짓말을 합니다
- **좋은 예**: `--color-primary` → 역할이 명확하고 재사용하기 쉽습니다

## 브라우저 지원

모든 현대 브라우저에서 지원합니다. IE11 이하가 대상이 아니라면 오늘 바로 사용해도 됩니다.

> CSS 변수는 Sass나 PostCSS 없이도 강력한 디자인 시스템을 만들 수 있게 해줍니다.
