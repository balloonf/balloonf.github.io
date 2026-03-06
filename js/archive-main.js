/**
 * 개인 아카이브 - 메인 애플리케이션 로직
 *
 * 기능:
 * 1. 파일 목록 렌더링
 * 2. 카테고리 탭 필터링
 * 3. 실시간 검색 기능
 * 4. 통계 정보 표시
 */

// ========================================
// State Management
// ========================================
let currentFilter = 'all'; // 현재 활성화된 필터
let currentSearchQuery = ''; // 현재 검색어
let currentFolderPath = null; // 현재 폴더 경로 (null = 루트)

// ========================================
// DOM Elements
// ========================================
const fileListContainer = document.getElementById('file-list');
const emptyStateElement = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const tabs = document.querySelectorAll('.tab');
const totalFilesElement = document.getElementById('total-files');
const breadcrumbElement = document.getElementById('breadcrumb');

// ========================================
// Render Functions
// ========================================

/**
 * 파일 카드 HTML 생성
 * @param {Object} file - 파일 객체
 * @returns {string} HTML 문자열
 */
function createFileCard(file) {
    const icon = fileIcons[file.type] || fileIcons.default;
    const typeLabel = fileTypeLabels[file.type] || '파일';

    // 이미지 파일은 썸네일 미리보기 표시
    const iconHTML = file.thumbnail
        ? `<div class="file-card__thumbnail"><img src="${file.thumbnail}" alt="${file.name}" loading="lazy"></div>`
        : `<div class="file-card__icon">${icon}</div>`;

    return `
        <a href="${file.path}" class="file-card" data-type="${file.type}" target="_blank">
            ${iconHTML}
            <div class="file-card__content">
                <div class="file-card__title">${file.name}</div>
                <div class="file-card__meta">${file.description || '설명 없음'}</div>
                <span class="file-card__badge">${typeLabel}</span>
            </div>
        </a>
    `;
}

/**
 * 폴더 카드 HTML 생성
 * @param {Object} folder - 폴더 객체
 * @returns {string} HTML 문자열
 */
function createFolderCard(folder) {
    const escapedName = folder.name.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    const escapedPath = folder.path.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    return `
        <div class="file-card folder-card" data-type="folder" data-path="${escapedPath}" role="button" tabindex="0">
            <div class="file-card__icon folder-icon">📁</div>
            <div class="file-card__content">
                <div class="file-card__title">${escapedName}</div>
                <div class="file-card__meta">폴더</div>
                <span class="file-card__badge folder-badge">폴더</span>
            </div>
            <svg class="folder-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    `;
}

/**
 * 브레드크럼 렌더링
 */
function createBreadcrumb() {
    if (!currentFolderPath) {
        breadcrumbElement.style.display = 'none';
        return;
    }

    const segments = getPathSegments(currentFolderPath);
    breadcrumbElement.textContent = '';

    segments.forEach((seg, i) => {
        const isLast = i === segments.length - 1;
        if (isLast) {
            const span = document.createElement('span');
            span.className = 'breadcrumb__current';
            span.textContent = seg.name;
            breadcrumbElement.appendChild(span);
        } else {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'breadcrumb__link';
            link.dataset.path = seg.path === null ? '' : seg.path;
            link.textContent = seg.name;
            breadcrumbElement.appendChild(link);

            const sep = document.createElement('span');
            sep.className = 'breadcrumb__separator';
            sep.textContent = '/';
            breadcrumbElement.appendChild(sep);
        }
    });

    breadcrumbElement.style.display = 'flex';
}

/**
 * 폴더로 이동
 * @param {string|null} path - 폴더 경로 (null = 루트)
 */
async function navigateToFolder(path) {
    currentFolderPath = path;
    currentPath = path;

    createBreadcrumb();

    if (path === null) {
        applyFiltersAndSearch();
        return;
    }

    setLoading(true);
    const entries = await loadSubfolder(path);
    setLoading(false);

    applyFiltersAndSearchForEntries(entries);
}

/**
 * 특정 엔트리 배열에 필터/검색 적용 후 렌더링
 */
function applyFiltersAndSearchForEntries(entries) {
    let filtered = entries;

    if (currentFilter !== 'all') {
        filtered = filtered.filter(e => {
            const itemCategory = e.category || e.parentDir;
            if (e.type === 'folder') {
                return itemCategory === currentFilter;
            }
            return e.type === currentFilter || itemCategory === currentFilter;
        });
    }

    if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        filtered = filtered.filter(e => {
            const nameMatch = e.name.toLowerCase().includes(query);
            const descMatch = e.description && e.description.toLowerCase().includes(query);
            return nameMatch || descMatch;
        });
    }

    renderFiles(filtered);
}

/**
 * 파일 목록 렌더링
 * @param {Array} files - 렌더링할 파일 배열
 */
function renderFiles(files) {
    if (files.length === 0) {
        // 검색 결과가 없을 때
        fileListContainer.innerHTML = '';
        emptyStateElement.style.display = 'block';
        return;
    }

    // 파일이 있을 때 — 폴더를 앞에 배치
    emptyStateElement.style.display = 'none';
    const folders = files.filter(f => f.type === 'folder');
    const regularFiles = files.filter(f => f.type !== 'folder');
    const cardsHTML = folders.map(f => createFolderCard(f)).join('')
                    + regularFiles.map(f => createFileCard(f)).join('');
    fileListContainer.innerHTML = cardsHTML;

    // 페이드인 애니메이션 적용
    const cards = fileListContainer.querySelectorAll('.file-card, .folder-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s both`;
    });
}

/**
 * 통계 정보 업데이트
 */
function updateStats() {
    const totalFiles = filesData.filter(f => f.type !== 'folder').length;

    // 숫자 애니메이션 효과
    animateNumber(totalFilesElement, 0, totalFiles, 1000);
}

/**
 * 숫자 카운트 업 애니메이션
 * @param {HTMLElement} element - 대상 엘리먼트
 * @param {number} start - 시작 숫자
 * @param {number} end - 끝 숫자
 * @param {number} duration - 애니메이션 시간 (ms)
 */
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutQuad 이징 함수
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.floor(start + (end - start) * easeProgress);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// Filter & Search Logic
// ========================================

/**
 * 필터링 및 검색 적용
 */
function applyFiltersAndSearch() {
    const entries = currentFolderPath ? (folderCache.get(currentFolderPath) || []) : filesData;
    applyFiltersAndSearchForEntries(entries);
}

/**
 * 카테고리 필터 변경
 * @param {string} category - 선택된 카테고리
 */
function setFilter(category) {
    currentFilter = category;
    applyFiltersAndSearch();
}

/**
 * 검색어 변경
 * @param {string} query - 검색어
 */
function setSearchQuery(query) {
    currentSearchQuery = query;
    applyFiltersAndSearch();
}

// ========================================
// Event Listeners
// ========================================

/**
 * 탭 클릭 이벤트
 */
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // 모든 탭의 active 클래스 제거
        tabs.forEach(t => t.classList.remove('active'));

        // 클릭한 탭에 active 클래스 추가
        tab.classList.add('active');

        // 필터 적용
        const category = tab.getAttribute('data-category');
        setFilter(category);
    });
});

/**
 * 검색 입력 이벤트
 */
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    setSearchQuery(query);
});

/**
 * 검색창 포커스 이벤트 - 전체 선택
 */
searchInput.addEventListener('focus', (e) => {
    if (e.target.value) {
        e.target.select();
    }
});

/**
 * 키보드 단축키
 */
document.addEventListener('keydown', (e) => {
    // ESC: 검색 초기화
    if (e.key === 'Escape' && searchInput.value) {
        searchInput.value = '';
        setSearchQuery('');
        searchInput.blur();
    }

    // Ctrl/Cmd + K: 검색창 포커스
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// ========================================
// Folder Navigation Events
// ========================================

/**
 * 폴더 카드 클릭 이벤트 위임
 */
fileListContainer.addEventListener('click', (e) => {
    const folderCard = e.target.closest('.folder-card');
    if (!folderCard) return;
    e.preventDefault();
    const path = folderCard.dataset.path;
    if (path) navigateToFolder(path);
});

fileListContainer.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const folderCard = e.target.closest('.folder-card');
    if (!folderCard) return;
    const path = folderCard.dataset.path;
    if (path) navigateToFolder(path);
});

/**
 * 브레드크럼 클릭 이벤트
 */
breadcrumbElement.addEventListener('click', (e) => {
    const link = e.target.closest('.breadcrumb__link');
    if (!link) return;
    e.preventDefault();
    const path = link.dataset.path;
    navigateToFolder(path === '' ? null : path);
});

// ========================================
// Initialization
// ========================================

/**
 * 로딩 상태 표시/숨김
 */
function setLoading(isLoading) {
    const loadingEl = document.getElementById('loading-state');
    if (loadingEl) {
        loadingEl.style.display = isLoading ? 'block' : 'none';
    }
    if (isLoading) {
        fileListContainer.textContent = '';
        emptyStateElement.style.display = 'none';
    }
}

/**
 * 앱 초기화 (비동기 - GitHub API에서 파일 목록 로드)
 */
async function initApp() {
    setLoading(true);

    await loadFilesFromGitHub();

    setLoading(false);

    console.log(`📦 총 ${filesData.length}개의 파일 로드됨`);

    // 통계 업데이트
    updateStats();

    // 초기 렌더링 (모든 파일 표시)
    renderFiles(filesData);
}

// DOM이 완전히 로드된 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
