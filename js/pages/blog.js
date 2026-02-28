/**
 * blog.js — 블로그 목록 페이지
 * 전체 글 목록 + 태그 필터
 */
const BlogPage = {
    _activeTag: 'all',

    /**
     * @param {string}          selector
     * @param {URLSearchParams} query — Router에서 넘겨주는 쿼리스트링
     */
    render(selector, query) {
        const root = document.querySelector(selector);
        if (!root) return;

        this._activeTag = query?.get('tag') || 'all';

        root.className = 'page-root animate-page';
        root.innerHTML = this._template();

        // 이벤트 위임: root에만 한 번 등록
        root.addEventListener('click', e => {
            const btn = e.target.closest('.tag-btn');
            if (!btn) return;
            this._switchTag(root, btn.getAttribute('data-tag'));
        });
    },

    _template() {
        return `
        <div class="blog-page">
            <div class="container">

                <!-- 헤더 -->
                <div class="blog-header">
                    <h1 class="blog-title">블로그</h1>
                    <p class="blog-desc">웹 개발과 기술에 대한 이야기들</p>
                </div>

                <!-- 태그 필터 -->
                <div class="tag-filter" id="tag-filter" role="group" aria-label="태그 필터">
                    ${this._renderFilterBtns()}
                </div>

                <!-- 글 목록 -->
                <div class="post-list" id="post-list" aria-live="polite">
                    ${this._renderPosts()}
                </div>

            </div>
        </div>
        `;
    },

    // ── 필터 버튼 렌더링 ────────────────────────────────────────
    _renderFilterBtns() {
        const allActive = this._activeTag === 'all';

        const allBtn = `
            <button class="tag-btn ${allActive ? 'active' : ''}" data-tag="all">
                전체 <span class="tag-count">${sortedPosts.length}</span>
            </button>`;

        const tagBtns = allTags.map(tag => {
            const count    = sortedPosts.filter(p => p.tags.includes(tag)).length;
            const isActive = this._activeTag === tag;
            const c        = getTagColor(tag);
            const style    = isActive
                ? `background:${c.bg}; color:${c.text}; border-color:${c.dot};`
                : '';
            return `
            <button class="tag-btn ${isActive ? 'active' : ''}"
                    data-tag="${tag}" style="${style}">
                <span class="tag__dot" style="background:${c.dot};"></span>
                ${tag} <span class="tag-count">${count}</span>
            </button>`;
        }).join('');

        return allBtn + tagBtns;
    },

    // ── 포스트 목록 렌더링 ───────────────────────────────────────
    _renderPosts() {
        const filtered = this._activeTag === 'all'
            ? sortedPosts
            : sortedPosts.filter(p => p.tags.includes(this._activeTag));

        if (filtered.length === 0) {
            return `
            <div class="blog-empty">
                <p class="blog-empty__icon">🔍</p>
                <p class="blog-empty__msg">해당 태그의 글이 없습니다</p>
            </div>`;
        }

        return filtered.map(post => PostCard.render(post, 'list')).join('');
    },

    // ── 태그 전환 ────────────────────────────────────────────────
    _switchTag(root, tag) {
        if (tag === this._activeTag) return;

        // URL 갱신 (hashchange 없이)
        history.replaceState(null, '', tag === 'all' ? '#/blog' : `#/blog?tag=${tag}`);
        this._activeTag = tag;

        // 필터 버튼 갱신
        const filterEl = root.querySelector('#tag-filter');
        if (filterEl) filterEl.innerHTML = this._renderFilterBtns();

        // 글 목록 갱신 + 카드 진입 애니메이션
        const listEl = root.querySelector('#post-list');
        if (listEl) {
            listEl.innerHTML = this._renderPosts();
            listEl.querySelectorAll('.post-card').forEach((card, i) => {
                card.style.animation = `fadeInUp 0.35s ease ${i * 0.06}s both`;
            });
        }
    },
};
