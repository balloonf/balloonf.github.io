---
title: 시맨틱 HTML로 접근성 높이기
summary: div와 span 대신 시맨틱 태그를 사용해 스크린 리더 친화적이고 SEO에 유리한 HTML 구조를 작성하는 방법입니다.
tags: [html, tips]
date: 2026-01-30
readTime: 4
---

## 시맨틱 HTML이란?

태그 자체가 **의미**를 갖는 HTML입니다.
`<div>` 대신 `<article>`, `<section>`, `<nav>` 등을 사용해 구조를 명확히 표현합니다.

## 대표적인 시맨틱 태그

### 페이지 레이아웃

```html
<header>   <!-- 머리글: 로고, 네비게이션 -->
<nav>      <!-- 내비게이션 링크 모음 -->
<main>     <!-- 페이지의 주요 콘텐츠 (페이지당 1개) -->
<aside>    <!-- 부가 정보, 사이드바 -->
<footer>   <!-- 바닥글: 저작권, 연락처 -->
```

### 콘텐츠 구조

```html
<article>  <!-- 독립적으로 배포 가능한 콘텐츠 (블로그 글, 뉴스) -->
<section>  <!-- 주제별 구획, 제목을 가져야 함 -->
<figure>   <!-- 이미지, 도표 등 독립적 미디어 -->
<figcaption>  <!-- figure의 설명 -->
<time datetime="2026-01-30">2026년 1월 30일</time>
```

## ARIA 속성으로 보완하기

시맨틱 태그만으로 부족할 때는 ARIA 속성을 추가합니다.

```html
<!-- 버튼 상태 표현 -->
<button aria-expanded="false" aria-controls="menu">
    메뉴 열기
</button>

<!-- 라이브 영역 (동적으로 바뀌는 내용) -->
<div aria-live="polite" id="status-message"></div>

<!-- 아이콘만 있는 버튼에 레이블 추가 -->
<button aria-label="검색">
    <svg>...</svg>
</button>
```

## 스크린 리더가 읽는 방식

시맨틱 태그를 올바르게 쓰면 스크린 리더가 구조를 파악해 사용자에게 다음과 같이 안내합니다.

- *"탐색 랜드마크"* → `<nav>`
- *"기사 시작"* → `<article>`
- *"주요 콘텐츠"* → `<main>`

> **div와 span을 없애는 것이 목표가 아닙니다.**
> 의미 없는 컨테이너로 사용하는 건 여전히 적절합니다.
> 핵심은 콘텐츠의 *역할*에 맞는 태그를 선택하는 것입니다.
