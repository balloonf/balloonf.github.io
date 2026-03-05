/**
 * about.js — 소개 페이지
 * 프로필 히어로 + 기술 스택 + 관심 분야
 */
const AboutPage = {
    render(selector) {
        const root = document.querySelector(selector);
        if (!root) return;

        root.className = 'page-root animate-page';
        root.innerHTML = this._template();
        this._initScrollReveal(root);
    },

    _template() {
        return `
        <div class="about-page">
            <div class="container--narrow">

                <!-- ===== 프로필 히어로 ===== -->
                <section class="profile animate-fade-in-up">
                    <div class="profile__avatar" aria-hidden="true">
                        <span class="profile__avatar-emoji">🎈</span>
                    </div>
                    <div class="profile__info">
                        <div class="profile__badge">웹 개발자</div>
                        <h1 class="profile__name">balloonf</h1>
                        <p class="profile__bio">
                            웹 표준과 접근성을 중시하며, 복잡한 것을 단순하게 만드는 것을 즐깁니다.
                            바닐라 JS의 가능성을 탐구하고, 깔끔한 코드와 좋은 사용자 경험을 추구합니다.
                            배운 것을 기록하고 나누는 것을 좋아합니다.
                        </p>
                        <div class="profile__links">
                            <a href="https://github.com/balloonf"
                               class="profile__link"
                               target="_blank"
                               rel="noopener noreferrer">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                                GitHub
                            </a>
                            <a href="archive/" class="profile__link profile__link--outline">
                                🗂 아카이브
                            </a>
                        </div>
                    </div>
                </section>

                <!-- ===== 기술 스택 ===== -->
                <section class="about-section reveal">
                    <h2 class="about-section__title">기술 스택</h2>

                    <div class="skill-groups">
                        <div class="skill-group">
                            <h3 class="skill-group__label">프론트엔드</h3>
                            <div class="skill-chips">
                                ${this._chip('HTML5',      '#fee2e2', '#991b1b', '#ef4444')}
                                ${this._chip('CSS3',       '#ede9fe', '#5b21b6', '#8b5cf6')}
                                ${this._chip('JavaScript', '#fef3c7', '#92400e', '#f59e0b')}
                                ${this._chip('Web APIs',   '#d1fae5', '#065f46', '#10b981')}
                                ${this._chip('반응형 디자인', '#fce7f3', '#9d174d', '#ec4899')}
                            </div>
                        </div>

                        <div class="skill-group">
                            <h3 class="skill-group__label">도구 &amp; 배포</h3>
                            <div class="skill-chips">
                                ${this._chip('Git',          '#f3f4f6', '#374151', '#6b7280')}
                                ${this._chip('GitHub',       '#f3f4f6', '#374151', '#6b7280')}
                                ${this._chip('GitHub Pages', '#dbeafe', '#1e40af', '#3b82f6')}
                                ${this._chip('VS Code',      '#dbeafe', '#1e40af', '#3b82f6')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- ===== 관심 분야 ===== -->
                <section class="about-section reveal">
                    <h2 class="about-section__title">관심 분야</h2>

                    <div class="interest-grid">
                        ${this._interestCard('⚡', '웹 성능',
                            'Core Web Vitals, lazy loading, 렌더링 최적화 등 빠른 웹을 만드는 방법에 관심이 많습니다.')}
                        ${this._interestCard('🎨', 'UI/UX 디자인',
                            '개발자이지만 좋은 디자인을 깊이 이해하고, 사용하기 쉬운 인터페이스를 만들고 싶습니다.')}
                        ${this._interestCard('♿', '웹 접근성',
                            '시맨틱 HTML과 ARIA로 모든 사람이 사용할 수 있는 웹을 만드는 것을 중요하게 생각합니다.')}
                        ${this._interestCard('📝', '기술 글쓰기',
                            '배운 것을 글로 정리하면 더 깊이 이해하게 됩니다. 이 블로그가 그 기록입니다.')}
                    </div>
                </section>

                <!-- ===== 연락 ===== -->
                <section class="about-section reveal">
                    <div class="contact-card">
                        <div class="contact-card__text">
                            <h2 class="contact-card__title">함께 이야기해요</h2>
                            <p class="contact-card__desc">
                                궁금한 점, 피드백, 협업 제안 등 언제든지 환영합니다.
                            </p>
                        </div>
                        <a href="https://github.com/balloonf"
                           class="btn btn--primary"
                           target="_blank"
                           rel="noopener noreferrer">
                            GitHub에서 찾기
                        </a>
                    </div>
                </section>

            </div>
        </div>
        `;
    },

    /** 스킬 칩 HTML 생성 */
    _chip(label, bg, text, dot) {
        return `<span class="skill-chip" style="background:${bg}; color:${text};">
            <span class="skill-chip__dot" style="background:${dot};"></span>${label}
        </span>`;
    },

    /** 관심 분야 카드 HTML 생성 */
    _interestCard(icon, title, desc) {
        return `
        <div class="interest-card">
            <span class="interest-card__icon" aria-hidden="true">${icon}</span>
            <h3 class="interest-card__title">${title}</h3>
            <p class="interest-card__desc">${desc}</p>
        </div>`;
    },

    _initScrollReveal(root) {
        ScrollReveal.init(root, { threshold: 0.08 });
    },
};
