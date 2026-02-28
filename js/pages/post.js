/**
 * post.js — 포스트 상세 페이지
 * 제목/메타/태그 헤더 + 프로즈 본문 + 읽기 진행 바 + 이전/다음 네비게이션
 */
const PostPage = {
    /** 스크롤 리스너 레퍼런스 (페이지 이동 시 제거용) */
    _scrollHandler: null,

    /**
     * @param {string} selector
     * @param {string} id — Router에서 전달하는 :id 파라미터
     */
    render(selector, id) {
        const root = document.querySelector(selector);
        if (!root) return;

        // 이전 스크롤 핸들러 정리
        if (this._scrollHandler) {
            window.removeEventListener('scroll', this._scrollHandler);
            this._scrollHandler = null;
        }

        const post = getPostById(id);

        // 브라우저 탭 제목 갱신
        document.title = post ? `${post.title} | balloonf` : '404 | balloonf';

        root.className = 'page-root animate-page';
        root.innerHTML = post ? this._template(post) : this._template404(id);

        if (post) {
            this._initScrollProgress();
        }
    },

    // ── 포스트 본문 템플릿 ───────────────────────────────────────
    _template(post) {
        const idx  = sortedPosts.findIndex(p => p.id === post.id);
        const prev = sortedPosts[idx + 1]; // 이전 글 (더 오래된 것)
        const next = sortedPosts[idx - 1]; // 다음 글 (더 최신)

        const dateStr = new Date(post.date).toLocaleDateString('ko-KR', {
            year: 'numeric', month: 'long', day: 'numeric',
        });

        const tagsHTML = post.tags.map(tag => {
            const c = getTagColor(tag);
            return `<a href="#/blog?tag=${tag}" class="tag tag--link"
                       style="background:${c.bg}; color:${c.text};">
                        <span class="tag__dot" style="background:${c.dot};"></span>${tag}
                    </a>`;
        }).join('');

        return `
        <!-- 읽기 진행 바 -->
        <div class="read-progress" id="read-progress" role="progressbar"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>

        <div class="post-detail">
            <div class="container--narrow">

                <!-- 뒤로 가기 -->
                <a href="#/blog" class="post-back">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" stroke-width="1.8"
                              stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    블로그 목록
                </a>

                <!-- 헤더 -->
                <header class="post-detail__header">
                    <div class="post-detail__tags">${tagsHTML}</div>
                    <h1 class="post-detail__title">${post.title}</h1>
                    <div class="post-detail__meta">
                        <time datetime="${post.date}">${dateStr}</time>
                        <span class="post-detail__sep" aria-hidden="true">·</span>
                        <span>${post.readTime}분 읽기</span>
                    </div>
                </header>

                <!-- 본문 -->
                <div class="prose" id="post-content">
                    ${Markdown.parse(post.content)}
                </div>

                <!-- 이전/다음 네비게이션 -->
                <nav class="post-nav" aria-label="포스트 네비게이션">
                    <div class="post-nav__slot post-nav__slot--prev">
                        ${prev ? this._navCard(prev, 'prev') : ''}
                    </div>
                    <div class="post-nav__slot post-nav__slot--next">
                        ${next ? this._navCard(next, 'next') : ''}
                    </div>
                </nav>

            </div>
        </div>
        `;
    },

    // ── 이전/다음 카드 ──────────────────────────────────────────
    _navCard(post, direction) {
        const label = direction === 'prev' ? '← 이전 글' : '다음 글 →';
        const cls   = direction === 'next' ? 'post-nav__link--right' : '';
        return `
        <a href="#/post/${post.id}" class="post-nav__link ${cls}">
            <span class="post-nav__label">${label}</span>
            <span class="post-nav__title">${post.title}</span>
        </a>`;
    },

    // ── 404 템플릿 ───────────────────────────────────────────────
    _template404(id) {
        return `
        <div class="page-placeholder">
            <div class="page-placeholder__icon">🔍</div>
            <span class="page-placeholder__badge">404</span>
            <h1 class="page-placeholder__title">글을 찾을 수 없습니다</h1>
            <p class="page-placeholder__desc">
                "<strong>${id}</strong>" 포스트가 존재하지 않거나 삭제되었습니다.
            </p>
            <a href="#/blog" class="btn btn--secondary"
               style="margin-top:1.5rem; color:var(--color-primary);">
               블로그 목록으로
            </a>
        </div>`;
    },

    // ── 읽기 진행 바 ─────────────────────────────────────────────
    _initScrollProgress() {
        const bar     = document.getElementById('read-progress');
        const content = document.getElementById('post-content');
        if (!bar || !content) return;

        const update = () => {
            const { top, height } = content.getBoundingClientRect();
            const viewH  = window.innerHeight;
            // 콘텐츠 상단이 뷰포트 아래에 있으면 0, 전부 지나갔으면 100
            const pct    = Math.min(100, Math.max(0,
                ((-top) / (height - viewH)) * 100
            ));
            bar.style.width = pct + '%';
            bar.setAttribute('aria-valuenow', Math.round(pct));
        };

        this._scrollHandler = update;
        window.addEventListener('scroll', update, { passive: true });
        update(); // 초기 실행
    },
};
