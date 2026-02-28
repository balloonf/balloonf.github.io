/**
 * main.js — 앱 진입점
 * 컴포넌트 초기화 → 라우트 등록 → 라우터 시작
 */

/**
 * 브라우저 탭 제목 설정
 * @param {string} [sub] — 서브 타이틀 (없으면 'balloonf'만 표시)
 */
function setTitle(sub) {
    document.title = sub ? `${sub} | balloonf` : 'balloonf';
}

/**
 * 페이지 전환 래퍼:
 * 1. animate-page 클래스 제거 → reflow → 렌더(클래스 재추가) 순서로
 *    페이지 진입 애니메이션을 매번 재트리거한다.
 * 2. 스크롤을 맨 위로 이동한다.
 *
 * @param {Function} renderFn — ({ params, query }) 형태의 라우트 핸들러
 */
function withTransition(renderFn) {
    return (ctx) => {
        // 스크롤 최상단으로
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 애니메이션 리셋
        const root = document.querySelector('#page-root');
        if (root) {
            root.classList.remove('animate-page');
            void root.offsetHeight; // force reflow
        }

        renderFn(ctx);
    };
}

function initApp() {
    // 1. 공통 컴포넌트 렌더링
    Header.render('#header-root');
    Footer.render('#footer-root');

    // 2. 라우트 등록
    Router.register('/', withTransition(() => {
        setTitle();
        HomePage.render('#page-root');
    }));

    Router.register('/blog', withTransition(({ query }) => {
        const tag = query?.get('tag');
        setTitle(tag ? `#${tag} — 블로그` : '블로그');
        BlogPage.render('#page-root', query);
    }));

    Router.register('/post/:id', withTransition(({ params }) => {
        // 포스트 제목은 PostPage.render() 내부에서 설정
        PostPage.render('#page-root', params.id);
    }));

    Router.register('/about', withTransition(() => {
        setTitle('소개');
        AboutPage.render('#page-root');
    }));

    // 3. 라우터 시작
    Router.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
