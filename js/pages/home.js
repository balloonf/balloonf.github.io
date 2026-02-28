/**
 * home.js — 홈 페이지
 * 히어로 섹션 + 최신 글 3개
 */
const HomePage = {
    render(selector) {
        const root = document.querySelector(selector);
        if (!root) return;

        root.className = 'page-root animate-page';
        root.innerHTML = this._template();
        this._initScrollReveal(root);
    },

    _template() {
        const latestPosts = sortedPosts.slice(0, 3);
        const cardsHTML = latestPosts
            .map(post => PostCard.render(post, 'grid'))
            .join('');

        return `
        <!-- ===== 히어로 ===== -->
        <section class="hero">
            <div class="hero__bg"></div>
            <div class="container">
                <div class="hero__content">
                    <p class="hero__eyebrow animate-fade-in-up">
                        안녕하세요 👋
                    </p>
                    <h1 class="hero__title animate-fade-in-up delay-1">
                        저는 <span class="hero__name">balloonf</span>입니다
                    </h1>
                    <p class="hero__desc animate-fade-in-up delay-2">
                        웹 개발과 기술에 대한 이야기를 기록하는 공간입니다.<br>
                        배운 것들, 만든 것들, 생각한 것들을 나눕니다.
                    </p>
                    <div class="hero__cta animate-fade-in-up delay-3">
                        <a href="#/blog" class="btn btn--primary">블로그 보기</a>
                        <a href="#/about" class="btn btn--secondary" style="color:var(--color-primary);">소개 보기</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ===== 최신 글 ===== -->
        <section class="home-section reveal">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">최근 글</h2>
                    <a href="#/blog" class="section-more">전체 보기 →</a>
                </div>
                <div class="post-grid">
                    ${cardsHTML}
                </div>
            </div>
        </section>
        `;
    },

    _initScrollReveal(root) {
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            }),
            { threshold: 0.1 }
        );
        root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },
};
