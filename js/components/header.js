/**
 * header.js — 사이트 헤더 / 네비게이션 컴포넌트
 */
const Header = {
    /**
     * 헤더를 지정 셀렉터에 렌더링
     * @param {string} selector — '#header-root'
     */
    render(selector) {
        const root = document.querySelector(selector);
        if (!root) return;

        root.innerHTML = this._template();
        this._bindEvents(root);
    },

    _template() {
        return `
        <header class="site-header animate-fade-in-down" id="site-header">
            <div class="container">
                <nav class="nav" role="navigation" aria-label="주 메뉴">
                    <!-- 브랜드 -->
                    <a href="#/" class="nav__brand" aria-label="홈으로">
                        <span class="nav__brand-text">balloonf</span>
                        <span class="nav__brand-dot">.</span>
                    </a>

                    <!-- 데스크탑 링크 -->
                    <ul class="nav__links" id="nav-links" role="list">
                        <li>
                            <a href="#/" class="nav__link" data-route="/">홈</a>
                        </li>
                        <li>
                            <a href="#/blog" class="nav__link" data-route="/blog">블로그</a>
                        </li>
                        <li>
                            <a href="archive/" class="nav__link">아카이브</a>
                        </li>
                        <li>
                            <a href="#/about" class="nav__link" data-route="/about">소개</a>
                        </li>
                    </ul>

                    <!-- 모바일 햄버거 -->
                    <button
                        class="nav__hamburger"
                        id="nav-hamburger"
                        aria-label="메뉴 열기/닫기"
                        aria-expanded="false"
                        aria-controls="nav-links"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>
        </header>
        `;
    },

    _bindEvents(root) {
        const hamburger = root.querySelector('#nav-hamburger');
        const navLinks  = root.querySelector('#nav-links');
        const header    = root.querySelector('#site-header');

        // 햄버거 토글
        hamburger?.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        // 링크 클릭 시 모바일 메뉴 닫기
        navLinks?.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger?.classList.remove('active');
                hamburger?.setAttribute('aria-expanded', 'false');
            });
        });

        // 스크롤 시 헤더 그림자
        const onScroll = () => {
            header?.classList.toggle('scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        // 활성 링크 초기화 + 라우트 변경 시 업데이트
        this._updateActiveLink();
        window.addEventListener('hashchange', () => this._updateActiveLink());
    },

    /** 현재 라우트에 맞는 링크에 active 클래스 부여 */
    _updateActiveLink() {
        const hash     = window.location.hash.slice(1) || '/';
        // '/post/123' → '/post' 로 기본 경로 추출
        const basePath = '/' + (hash.split('/')[1] || '');

        document.querySelectorAll('.nav__link[data-route]').forEach(link => {
            const route = link.getAttribute('data-route');
            const isActive =
                route === basePath ||
                (basePath === '/' && route === '/');
            link.classList.toggle('active', isActive);
        });
    },
};
