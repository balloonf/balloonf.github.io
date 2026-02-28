/**
 * posts.js — 블로그 포스트 데이터
 *
 * 새 글 추가 방법:
 * 1. posts 배열에 객체 추가 (id는 URL에 사용되므로 영문 + 하이픈)
 * 2. content 필드에 Markdown을 그대로 작성하면 됩니다
 *
 * Markdown 지원 문법:
 *   ## 헤딩   **굵게**   *기울임*   `코드`
 *   ```js ... ```  코드 블록
 *   - 목록   1. 순서 목록   > 인용   [링크](url)   ---
 */

// ============================================================
// 포스트 데이터
// ============================================================
const posts = [
    {
        id: 'vanilla-js-spa',
        title: 'Vanilla JS로 SPA 만들기',
        summary: '빌드 도구 없이 순수 자바스크립트로 해시 라우터 기반 SPA를 구현하는 전 과정을 정리합니다.',
        tags: ['javascript', 'web'],
        date: '2026-02-28',
        readTime: 5,
        content: `
## 들어가며

React, Vue 같은 프레임워크 없이도 SPA를 만들 수 있습니다.
핵심은 \`hashchange\` 이벤트와 동적 \`innerHTML\` 렌더링입니다.

## 해시 라우터 구조

\`window.location.hash\`를 파싱해 현재 경로를 확인하고,
등록된 핸들러를 실행하는 간단한 라우터를 만들 수 있습니다.

\`\`\`javascript
const Router = {
    routes: {},

    register(path, handler) {
        this.routes[path] = handler;
    },

    resolve() {
        const path = window.location.hash.slice(1) || '/';
        const handler = this.routes[path];
        if (handler) handler();
    },

    init() {
        window.addEventListener('hashchange', () => this.resolve());
        this.resolve();
    }
};
\`\`\`

## 컴포넌트 패턴

각 페이지는 \`render(selector)\` 메서드를 가진 객체로 정의합니다.
\`innerHTML\`을 갱신하는 방식이라 상태가 단순한 사이트에 적합합니다.

\`\`\`javascript
const HomePage = {
    render(selector) {
        const root = document.querySelector(selector);
        root.innerHTML = \`<h1>안녕하세요!</h1>\`;
    }
};
\`\`\`

## 장단점

**장점**

- 외부 의존성이 전혀 없어 번들 크기가 0입니다
- GitHub Pages 같은 정적 호스팅에 바로 배포 가능합니다
- 빌드 단계가 없으므로 배포가 단순합니다

**단점**

- 복잡한 상태 관리는 직접 구현해야 합니다
- 앱이 커질수록 유지보수가 어려워질 수 있습니다

## 마치며

소규모 프로젝트라면 프레임워크 없이도 충분합니다.
도구에 의존하기 전에, 브라우저 API가 얼마나 강력한지 직접 경험해보세요.
`,
    },
    {
        id: 'css-custom-properties',
        title: 'CSS 변수로 디자인 시스템 만들기',
        summary: 'CSS Custom Properties를 활용해 일관성 있고 유지보수하기 쉬운 디자인 시스템을 구축하는 방법을 소개합니다.',
        tags: ['css', 'web'],
        date: '2026-02-20',
        readTime: 4,
        content: `
## CSS 변수란?

\`--\`로 시작하는 CSS Custom Properties는 값을 변수처럼 재사용할 수 있게 해줍니다.
Sass 변수와 달리 **런타임에도 변경이 가능**해 훨씬 유연합니다.

\`\`\`css
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
\`\`\`

## 디자인 토큰으로 활용하기

색상, 간격, 폰트 크기를 변수로 정의하면 **테마 변경이 한 곳에서** 이루어집니다.
다크 모드도 미디어 쿼리 안에서 변수 값만 바꾸면 됩니다.

\`\`\`css
@media (prefers-color-scheme: dark) {
    :root {
        --color-primary: #a78bfa;
        --color-bg: #0f0f13;
        --color-text-primary: #f9fafb;
    }
}
\`\`\`

## 네이밍 전략

변수명은 *용도* 중심으로 짓는 게 좋습니다.

- **나쁜 예**: \`--color-blue\` → 색이 바뀌면 이름이 거짓말을 합니다
- **좋은 예**: \`--color-primary\` → 역할이 명확하고 재사용하기 쉽습니다

## 브라우저 지원

모든 현대 브라우저에서 지원합니다. IE11 이하가 대상이 아니라면 오늘 바로 사용해도 됩니다.

> CSS 변수는 Sass나 PostCSS 없이도 강력한 디자인 시스템을 만들 수 있게 해줍니다.
`,
    },
    {
        id: 'github-pages-guide',
        title: 'GitHub Pages 완전 정복',
        summary: '정적 사이트를 GitHub Pages로 무료 배포하는 방법부터 커스텀 도메인 설정까지 한 번에 정리합니다.',
        tags: ['web', 'tips'],
        date: '2026-02-15',
        readTime: 3,
        content: `
## GitHub Pages란?

GitHub 저장소를 그대로 정적 웹사이트로 서빙해주는 **무료 호스팅 서비스**입니다.
\`username.github.io\` 형태의 도메인을 자동으로 제공합니다.

## 배포 설정 방법

1. GitHub 저장소 **Settings** 탭으로 이동
2. 좌측 메뉴에서 **Pages** 선택
3. Source: \`Deploy from a branch\` 선택
4. Branch: \`main\`, 폴더: \`/ (root)\` 선택
5. **Save** 클릭

몇 분 후 \`https://username.github.io\`에서 사이트를 확인할 수 있습니다.

## 커스텀 도메인 연결

\`\`\`
# 저장소 루트에 CNAME 파일 생성
echo "yourdomain.com" > CNAME
\`\`\`

DNS 설정에서 \`A\` 레코드를 GitHub IP로 등록하면 됩니다.

## 주의 사항

- 파일 크기 제한: **100MB / 파일**, **1GB / 저장소**
- 대용량 동영상은 외부 CDN(YouTube, Vimeo 등)을 활용하세요
- 서버 사이드 처리 불가 — 순수 정적 파일만 호스팅됩니다

> 무료이고 설정도 간단해서 개인 블로그나 포트폴리오를 시작하기에 최적입니다.
`,
    },
    {
        id: 'intersection-observer',
        title: 'IntersectionObserver로 스크롤 애니메이션 만들기',
        summary: 'scroll 이벤트 대신 IntersectionObserver API를 사용해 성능 좋은 스크롤 트리거 애니메이션을 구현합니다.',
        tags: ['javascript', 'tips'],
        date: '2026-02-08',
        readTime: 6,
        content: `
## 왜 IntersectionObserver인가?

\`scroll\` 이벤트는 스크롤할 때마다 수십 번 실행됩니다.
\`IntersectionObserver\`는 요소가 뷰포트에 **진입 / 이탈**할 때만 콜백을 실행해 훨씬 효율적입니다.

## 기본 사용법

\`\`\`javascript
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
\`\`\`

## CSS 연동

\`\`\`css
.reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.visible {
    opacity: 1;
    transform: translateY(0);
}
\`\`\`

## threshold 값 가이드

| 값 | 동작 |
|---|---|
| \`0\` | 1픽셀이라도 보이면 즉시 트리거 |
| \`0.1\` | 10% 진입 시 (기본적으로 많이 사용) |
| \`0.5\` | 절반 이상 보일 때 |
| \`1.0\` | 전체가 뷰포트 안에 들어올 때 |

## rootMargin 활용

\`rootMargin\`으로 트리거 기준을 뷰포트 기준에서 오프셋할 수 있습니다.

\`\`\`javascript
const observer = new IntersectionObserver(callback, {
    rootMargin: '0px 0px -100px 0px'
    // 뷰포트 하단에서 100px 위에서 트리거
});
\`\`\`

> 스크롤 애니메이션의 성능 문제는 대부분 IntersectionObserver로 해결됩니다.
`,
    },
    {
        id: 'semantic-html-guide',
        title: '시맨틱 HTML로 접근성 높이기',
        summary: 'div와 span 대신 시맨틱 태그를 사용해 스크린 리더 친화적이고 SEO에 유리한 HTML 구조를 작성하는 방법입니다.',
        tags: ['html', 'tips'],
        date: '2026-01-30',
        readTime: 4,
        content: `
## 시맨틱 HTML이란?

태그 자체가 **의미**를 갖는 HTML입니다.
\`<div>\` 대신 \`<article>\`, \`<section>\`, \`<nav>\` 등을 사용해 구조를 명확히 표현합니다.

## 대표적인 시맨틱 태그

### 페이지 레이아웃

\`\`\`html
<header>   <!-- 머리글: 로고, 네비게이션 -->
<nav>      <!-- 내비게이션 링크 모음 -->
<main>     <!-- 페이지의 주요 콘텐츠 (페이지당 1개) -->
<aside>    <!-- 부가 정보, 사이드바 -->
<footer>   <!-- 바닥글: 저작권, 연락처 -->
\`\`\`

### 콘텐츠 구조

\`\`\`html
<article>  <!-- 독립적으로 배포 가능한 콘텐츠 (블로그 글, 뉴스) -->
<section>  <!-- 주제별 구획, 제목을 가져야 함 -->
<figure>   <!-- 이미지, 도표 등 독립적 미디어 -->
<figcaption>  <!-- figure의 설명 -->
<time datetime="2026-01-30">2026년 1월 30일</time>
\`\`\`

## ARIA 속성으로 보완하기

시맨틱 태그만으로 부족할 때는 ARIA 속성을 추가합니다.

\`\`\`html
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
\`\`\`

## 스크린 리더가 읽는 방식

시맨틱 태그를 올바르게 쓰면 스크린 리더가 구조를 파악해 사용자에게 다음과 같이 안내합니다.

- *"탐색 랜드마크"* → \`<nav>\`
- *"기사 시작"* → \`<article>\`
- *"주요 콘텐츠"* → \`<main>\`

> **div와 span을 없애는 것이 목표가 아닙니다.**
> 의미 없는 컨테이너로 사용하는 건 여전히 적절합니다.
> 핵심은 콘텐츠의 *역할*에 맞는 태그를 선택하는 것입니다.
`,
    },
];

// ============================================================
// 태그별 색상 매핑
// ============================================================
const tagColors = {
    javascript: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    css:        { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
    html:       { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    web:        { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
    tips:       { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
    review:     { bg: '#ffedd5', text: '#9a3412', dot: '#f97316' },
};

/**
 * 태그 색상 반환 (미등록 태그는 회색 기본값)
 * @param {string} tag
 */
function getTagColor(tag) {
    return tagColors[tag] ?? { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
}

// 최신순 정렬된 포스트 배열
const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
);

// 전체 태그 목록 (중복 제거 + 알파벳 정렬)
const allTags = [...new Set(posts.flatMap(p => p.tags))].sort();

/**
 * id로 포스트 조회
 * @param {string} id
 * @returns {Object|undefined}
 */
function getPostById(id) {
    return posts.find(p => p.id === id);
}
