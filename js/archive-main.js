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

// ========================================
// DOM Elements
// ========================================
const fileListContainer = document.getElementById('file-list');
const emptyStateElement = document.getElementById('empty-state');
const searchInput = document.getElementById('search-input');
const tabs = document.querySelectorAll('.tab');
const totalFilesElement = document.getElementById('total-files');

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

    // 파일이 있을 때
    emptyStateElement.style.display = 'none';
    const cardsHTML = files.map(file => createFileCard(file)).join('');
    fileListContainer.innerHTML = cardsHTML;

    // 페이드인 애니메이션 적용
    const cards = fileListContainer.querySelectorAll('.file-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.4s ease ${index * 0.05}s both`;
    });
}

/**
 * 통계 정보 업데이트
 */
function updateStats() {
    const totalFiles = filesData.length;

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
    let filteredFiles = filesData;

    // 1. 카테고리 필터링
    if (currentFilter !== 'all') {
        filteredFiles = filteredFiles.filter(file => file.type === currentFilter);
    }

    // 2. 검색어 필터링
    if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        filteredFiles = filteredFiles.filter(file => {
            const nameMatch = file.name.toLowerCase().includes(query);
            const descMatch = file.description && file.description.toLowerCase().includes(query);
            return nameMatch || descMatch;
        });
    }

    // 3. 결과 렌더링
    renderFiles(filteredFiles);
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
