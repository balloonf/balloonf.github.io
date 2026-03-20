/**
 * posts.js — 블로그 포스트 데이터
 *
 * posts/ 디렉토리의 .md 파일을 GitHub API로 자동 감지합니다.
 * 각 .md 파일은 YAML frontmatter를 포함해야 합니다:
 *
 * ---
 * title: 포스트 제목
 * summary: 요약 설명
 * tags: [tag1, tag2]
 * date: 2026-03-01
 * readTime: 5
 * ---
 * 본문 마크다운...
 */

// GitHub 레포 정보 (data.js와 공유)
const POSTS_DIR = 'posts';
const POSTS_API_URL = `https://api.github.com/repos/balloonf/balloonf.github.io/contents/${POSTS_DIR}`;
const RAW_BASE_URL = 'https://raw.githubusercontent.com/balloonf/balloonf.github.io/main';

// ============================================================
// 동적으로 채워지는 포스트 배열
// ============================================================
let posts = [];

// ============================================================
// Frontmatter 파서
// ============================================================

/**
 * YAML frontmatter를 파싱하여 메타데이터와 본문을 분리
 * @param {string} raw - 전체 마크다운 텍스트
 * @returns {{ meta: Object, content: string }}
 */
function parseFrontmatter(raw) {
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
        return { meta: {}, content: raw };
    }

    const yamlBlock = match[1];
    const content = match[2];
    const meta = {};

    for (const line of yamlBlock.split('\n')) {
        const colonIdx = line.indexOf(':');
        if (colonIdx === -1) continue;

        const key = line.slice(0, colonIdx).trim();
        let value = line.slice(colonIdx + 1).trim();

        // 배열 파싱: [tag1, tag2]
        if (value.startsWith('[') && value.endsWith(']')) {
            value = value.slice(1, -1).split(',').map(s => s.trim());
        }
        // 숫자 파싱
        else if (/^\d+$/.test(value)) {
            value = parseInt(value, 10);
        }

        meta[key] = value;
    }

    return { meta, content };
}

// ============================================================
// GitHub API에서 포스트 로드
// ============================================================

/**
 * GitHub에서 posts/ 디렉토리의 .md 파일을 가져와 posts 배열을 채움
 * @returns {Promise<boolean>} 성공 여부
 */
async function loadPostsFromGitHub() {
    try {
        // 1. 디렉토리 목록 가져오기 (API 1회 호출)
        const listRes = await fetch(POSTS_API_URL);
        if (!listRes.ok) throw new Error(`API ${listRes.status}`);
        const files = await listRes.json();

        // .md 파일만 필터링
        const mdFiles = files.filter(f =>
            f.type === 'file' && f.name.endsWith('.md') && f.name !== '.gitkeep'
        );

        if (mdFiles.length === 0) {
            posts = [];
            return true;
        }

        // 2. 각 파일의 raw 내용을 병렬로 가져오기 (raw URL은 rate limit 미적용)
        const postPromises = mdFiles.map(async (file) => {
            try {
                const rawRes = await fetch(`${RAW_BASE_URL}/${POSTS_DIR}/${encodeURIComponent(file.name)}`);
                if (!rawRes.ok) return null;
                const rawText = await rawRes.text();

                const { meta, content } = parseFrontmatter(rawText);

                // 파일명에서 id 추출 (확장자 제거)
                const id = file.name.replace(/\.md$/, '');

                return {
                    id,
                    title: meta.title || id.replace(/-/g, ' '),
                    summary: meta.summary || '',
                    tags: Array.isArray(meta.tags) ? meta.tags : [],
                    date: meta.date || '1970-01-01',
                    readTime: meta.readTime || 3,
                    content
                };
            } catch {
                return null;
            }
        });

        const results = await Promise.all(postPromises);
        const loaded = results.filter(p => p !== null);

        if (loaded.length > 0) {
            posts = loaded;
            return true;
        }

        posts = fallbackPosts;
        return false;
    } catch (error) {
        console.warn('포스트 로드 실패, fallback 데이터 사용:', error);
        posts = fallbackPosts;
        return false;
    }
}

// ============================================================
// API 실패 시 fallback 정적 데이터
// ============================================================
const fallbackPosts = [
    {
        id: 'vanilla-js-spa',
        title: 'Vanilla JS로 SPA 만들기',
        summary: '빌드 도구 없이 순수 자바스크립트로 해시 라우터 기반 SPA를 구현하는 전 과정을 정리합니다.',
        tags: ['javascript', 'web'],
        date: '2026-02-28',
        readTime: 5,
        content: `
## 들어가며

React, Vue 같은 프레임워크 없이도 SPA를 만들 수 있습니다.
핵심은 \`hashchange\` 이벤트와 동적 렌더링입니다.

## 마치며

소규모 프로젝트라면 프레임워크 없이도 충분합니다.
`
    }
];

// ============================================================
// 태그별 색상 매핑
// ============================================================
const tagColors = {
    javascript: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
    css:        { bg: '#ede9fe', text: '#5b21b6', dot: '#8b5cf6' },
    html:       { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
    web:        { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
    tips:       { bg: '#fce7f3', text: '#9d174d', dot: '#ec4899' },
    review:     { bg: '#ffedd5', text: '#9a3412', dot: '#f97316' },
};

/**
 * 태그 색상 반환 (미등록 태그는 회색 기본값)
 * @param {string} tag
 */
function getTagColor(tag) {
    return tagColors[tag] ?? { bg: '#f3f4f6', text: '#374151', dot: '#6b7280' };
}

/**
 * 포스트 데이터에서 파생되는 값들을 재계산
 * loadPostsFromGitHub() 완료 후 호출해야 함
 */
function refreshPostDerivedData() {
    // 최신순 정렬
    sortedPosts = [...posts].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    // 전체 태그 목록
    allTags = [...new Set(posts.flatMap(p => p.tags))].sort();
}

// 최신순 정렬된 포스트 배열 (동적 업데이트)
let sortedPosts = [];

// 전체 태그 목록 (동적 업데이트)
let allTags = [];

/**
 * id로 포스트 조회
 * @param {string} id
 * @returns {Object|undefined}
 */
function getPostById(id) {
    return posts.find(p => p.id === id);
}
