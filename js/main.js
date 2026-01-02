/**
 * Personal Archive - Main Application Logic
 *
 * 기능:
 * 1. 파일 목록 렌더링
 * 2. 카테고리 탭 필터링
 * 3. 검색 기능
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
    const typeLabel = fileTypeLabels[file.type] || 'File';

    return `
        <a href="${file.path}" class="file-card" data-type="${file.type}" target="_blank">
            <div class="file-card__icon">${icon}</div>
            <div class="file-card__content">
                <div class="file-card__title">${file.name}</div>
                <div class="file-card__meta">${file.description || 'No description'}</div>
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
        card.style.animation = `fadeIn 0.3s ease ${index * 0.05}s both`;
    });
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
 * 키보드 단축키 (ESC로 검색 초기화)
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchInput.value) {
        searchInput.value = '';
        setSearchQuery('');
        searchInput.blur();
    }
});

// ========================================
// Initialization
// ========================================

/**
 * 앱 초기화
 */
function initApp() {
    console.log('🚀 Personal Archive initialized');
    console.log(`📦 Loaded ${filesData.length} files`);

    // 초기 렌더링 (모든 파일 표시)
    renderFiles(filesData);
}

// DOM이 완전히 로드된 후 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
