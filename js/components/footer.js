/**
 * footer.js — 사이트 푸터 컴포넌트
 */
const Footer = {
    /**
     * 푸터를 지정 셀렉터에 렌더링
     * @param {string} selector — '#footer-root'
     */
    render(selector) {
        const root = document.querySelector(selector);
        if (!root) return;
        root.innerHTML = this._template();
    },

    _template() {
        const year = new Date().getFullYear();
        return `
        <footer class="site-footer">
            <div class="container">
                <div class="footer__inner">
                    <p class="footer__copy">
                        © ${year} <span class="footer__brand">balloonf</span>
                        · Powered by GitHub Pages
                    </p>
                    <nav class="footer__links" aria-label="소셜 링크">
                        <a
                            href="https://github.com/balloonf"
                            class="footer__link"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub 프로필"
                        >GitHub</a>
                        <a href="archive/" class="footer__link">아카이브</a>
                    </nav>
                </div>
            </div>
        </footer>
        `;
    },
};
