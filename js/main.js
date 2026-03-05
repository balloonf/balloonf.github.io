/**
 * main.js — 앱 진입점
 * GitHub API에서 포스트를 로드한 뒤 컴포넌트 초기화 → 라우트 등록 → 라우터 시작
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
        const root = document.querySelector('#page-root');
        if (!root) { renderFn(ctx); return; }

        // Exit animation
        root.classList.add('page-exit');
        root.classList.remove('page-enter', 'animate-page');

        const doEnter = () => {
            root.classList.remove('page-exit');
            window.scrollTo({ top: 0, behavior: 'instant' });
            renderFn(ctx);
            root.classList.add('page-enter');
        };

        // Wait for exit animation (200ms) then enter
        if (getComputedStyle(root).animationDuration !== '0s') {
            setTimeout(doEnter, 200);
        } else {
            doEnter();
        }
    };
}

/**
 * 로딩 상태 표시/숨김
 */
function showAppLoading() {
    const root = document.querySelector('#page-root');
    if (!root) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'app-loading';

    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';

    const text = document.createElement('p');
    text.textContent = '불러오는 중...';

    wrapper.appendChild(spinner);
    wrapper.appendChild(text);
    root.appendChild(wrapper);
}

function hideAppLoading() {
    const el = document.querySelector('.app-loading');
    if (el) el.remove();
}

async function initApp() {
    // 0. 테마 초기화
    ThemeManager.init();

    // 1. 로딩 표시
    showAppLoading();

    // 2. GitHub API에서 포스트 로드
    await loadPostsFromGitHub();
    refreshPostDerivedData();

    // 3. 로딩 숨김
    hideAppLoading();

    // 4. 공통 컴포넌트 렌더링
    Header.render('#header-root');
    Footer.render('#footer-root');

    // 5. 라우트 등록
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
        PostPage.render('#page-root', params.id);
    }));

    Router.register('/about', withTransition(() => {
        setTitle('소개');
        AboutPage.render('#page-root');
    }));

    // 6. 라우터 시작
    Router.init();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
