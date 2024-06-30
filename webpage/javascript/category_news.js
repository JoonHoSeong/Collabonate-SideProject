let selectedKeyword = '';

// URL에서 키워드 파라미터를 가져오는 함수
function getSelectedKeywordFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('keyword') || '경제'; // 기본값은 '경제'
}

// 뉴스 데이터를 가져오는 함수 (예시)
function fetchNews(page = 1) {
    // 실제로는 서버에서 데이터를 가져와야 합니다
    const totalNews = 53; // 총 뉴스 수
    const newsPerPage = 10;
    const startIndex = (page - 1) * newsPerPage;
    const endIndex = Math.min(startIndex + newsPerPage, totalNews);

    const news = [];
    for (let i = startIndex; i < endIndex; i++) {
        news.push({
            title: `${selectedKeyword} 관련 뉴스 제목 ${i + 1}`,
            summary: `${selectedKeyword}에 관한 뉴스 ${i + 1} 요약입니다. 여기에 뉴스 내용이 간략하게 들어갑니다.`,
            source: `뉴스 출처 ${i % 3 + 1}`
        });
    }

    return {
        news,
        totalPages: Math.ceil(totalNews / newsPerPage),
        currentPage: page
    };
}

// 페이지 로드 시 실행되는 함수
function init() {
    selectedKeyword = getSelectedKeywordFromURL();
    updatePageTitle();
    updateUserProfile();
    loadNews(1);
    setupPagination();
}

// 페이지 제목 업데이트
function updatePageTitle() {
    const keywordTitle = document.getElementById('keyword-title');
    keywordTitle.textContent = `'${selectedKeyword}' 키워드 뉴스`;
    document.title = `'${selectedKeyword}' 키워드 뉴스`;
}

// 사용자 프로필 업데이트 (예시)
function updateUserProfile() {
    const userNickname = document.getElementById('user-nickname');
    userNickname.textContent = "사용자";
    
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = `
        <a href="#">프로필 설정</a>
        <a href="#">로그아웃</a>
    `;
}

// 뉴스 로드 및 렌더링
function loadNews(page) {
    const { news, totalPages, currentPage } = fetchNews(page);
    renderNews(news);
    updatePagination(currentPage, totalPages);
}

// 뉴스 렌더링
function renderNews(news) {
    const newsList = document.getElementById('news-list');
    newsList.innerHTML = '';

    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h2 class="news-title">${item.title}</h2>
            <p class="news-summary">${item.summary}</p>
            <p class="news-source">출처: ${item.source}</p>
        `;
        newsList.appendChild(newsItem);
    });
}

// 페이지네이션 설정
function setupPagination() {
    const firstPageBtn = document.getElementById('first-page');
    const lastPageBtn = document.getElementById('last-page');
    
    firstPageBtn.addEventListener('click', () => loadNews(1));
    lastPageBtn.addEventListener('click', () => {
        const { totalPages } = fetchNews();
        loadNews(totalPages);
    });
}

// 페이지네이션 업데이트
function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const firstPageBtn = document.getElementById('first-page');
    const lastPageBtn = document.getElementById('last-page');

    firstPageBtn.disabled = currentPage === 1;
    lastPageBtn.disabled = currentPage === totalPages;

    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.disabled = i === currentPage;
        button.addEventListener('click', () => loadNews(i));
        paginationContainer.appendChild(button);
    }
}

// 드롭다운 토글
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// 페이지 로드 시 init 함수 실행
document.addEventListener('DOMContentLoaded', init);