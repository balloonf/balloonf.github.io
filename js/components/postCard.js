/**
 * postCard.js — 포스트 카드 컴포넌트
 * home.js(그리드), blog.js(목록) 양쪽에서 재사용
 */
const PostCard = {
    /**
     * 포스트 카드 HTML 문자열 반환
     * @param {Object}  post
     * @param {'grid'|'list'} layout — 'grid': 홈 그리드용 / 'list': 블로그 목록용
     */
    render(post, layout = 'grid') {
        const dateStr  = this._formatDate(post.date);
        const tagsHTML = post.tags
            .map(tag => {
                const c = getTagColor(tag);
                return `<span class="tag" style="background:${c.bg}; color:${c.text};">
                    <span class="tag__dot" style="background:${c.dot};"></span>${tag}
                </span>`;
            })
            .join('');

        return `
        <article class="post-card post-card--${layout}">
            <a href="#/post/${post.id}" class="post-card__link">
                <div class="post-card__body">
                    <div class="post-card__tags">${tagsHTML}</div>
                    <h3 class="post-card__title">${post.title}</h3>
                    <p class="post-card__summary">${post.summary}</p>
                </div>
                <footer class="post-card__footer">
                    <time class="post-card__date" datetime="${post.date}">${dateStr}</time>
                    <span class="post-card__read-time">${post.readTime}분 읽기</span>
                </footer>
            </a>
        </article>
        `;
    },

    /** 날짜 문자열 → 한국어 형식 */
    _formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year:  'numeric',
            month: 'long',
            day:   'numeric',
        });
    },
};
