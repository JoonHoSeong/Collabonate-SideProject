let currentPage = 1;
let totalPages = 1;
const newsPerPage = 5;
const paginationRange = 2;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || '정치';

    updateCategoryTitle(category);
    loadCategoryNews(category, currentPage);

    document.getElementById('pagination-container').addEventListener('click', handlePaginationClick);
});

function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('category-title');
    categoryTitle.textContent = `${category} 뉴스`;
    document.title = `${category} 뉴스 - Keyword Ranking News`;
}

function loadCategoryNews(category, page) {
    fetchNews(category, page)
        .then(data => {
            if (data.news.length > 0) {
                displayNews(data.news);
                totalPages = data.totalPages;
                updatePagination(page, totalPages);
            } else {
                displayNoNewsMessage();
            }
        })
        .catch(error => console.error('뉴스를 불러오는 데 실패했습니다:', error));
}

function displayNews(newsList) {
    const newsListElement = document.getElementById('news-list');
    newsListElement.innerHTML = '';

    newsList.forEach(news => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h2>${news.title}</h2>
            <p>${news.content}</p>
        `;
        newsListElement.appendChild(newsItem);
    });
}

function displayNoNewsMessage() {
    const newsListElement = document.getElementById('news-list');
    newsListElement.innerHTML = '<p>현재 페이지에 표시할 뉴스가 없습니다.</p>';
    updatePagination(currentPage, totalPages);
}

function updatePagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    paginationContainer.appendChild(createPageButton('<<', 1, currentPage === 1));
    paginationContainer.appendChild(createPageButton('<', Math.max(1, currentPage - 1), currentPage === 1));

    const startPage = Math.max(1, currentPage - paginationRange);
    const endPage = Math.min(totalPages, currentPage + paginationRange);

    for (let i = startPage; i <= endPage; i++) {
        paginationContainer.appendChild(createPageButton(i.toString(), i, false, i === currentPage));
    }

    paginationContainer.appendChild(createPageButton('>', Math.min(totalPages, currentPage + 1), currentPage === totalPages));
    paginationContainer.appendChild(createPageButton('>>', totalPages, currentPage === totalPages));
}

function createPageButton(text, pageNumber, isDisabled, isCurrent = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.disabled = isDisabled;
    button.dataset.page = pageNumber;
    if (isCurrent) {
        button.classList.add('current-page');
    }
    return button;
}

function handlePaginationClick(event) {
    if (event.target.tagName === 'BUTTON' && !event.target.disabled) {
        goToPage(parseInt(event.target.dataset.page));
    }
}

function goToPage(page) {
    currentPage = page;
    const category = new URLSearchParams(window.location.search).get('category') || '정치';
    loadCategoryNews(category, currentPage);
}

function fetchNews(category, page) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const allNews = [
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다." },
                
            ];

            const startIndex = (page - 1) * newsPerPage;
            const endIndex = startIndex + newsPerPage;
            const paginatedNews = allNews.slice(startIndex, endIndex);

            resolve({
                news: paginatedNews,
                totalPages: Math.ceil(allNews.length / newsPerPage)
            });
        }, 300);
    });
}