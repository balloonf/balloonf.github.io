/**
 * scrollReveal.js — 통합 스크롤 리빌 유틸리티
 * home.js, about.js 등에서 공통 사용
 */
const ScrollReveal = {
    /**
     * 주어진 root 내의 .reveal 요소에 IntersectionObserver 등록
     * @param {Element} root
     * @param {Object} [options]
     * @param {number} [options.threshold=0.1]
     * @param {number} [options.staggerDelay=0.06] — 자식 카드 스태거 딜레이(초)
     */
    init(root, options = {}) {
        const threshold = options.threshold ?? 0.1;

        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    observer.unobserve(e.target);
                }
            }),
            { threshold }
        );

        root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    },
};
