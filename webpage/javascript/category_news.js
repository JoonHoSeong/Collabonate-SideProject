// category_news.js

let currentPage = 1;
let totalPages = 1;
const newsPerPage = 5;

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || '정치';

    updateCategoryTitle(category);
    loadCategoryNews(category, currentPage);

    document.getElementById('first-page').addEventListener('click', () => goToPage(1));
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));
    document.getElementById('last-page').addEventListener('click', () => goToPage(totalPages));
});

function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('category-title');
    categoryTitle.textContent = `${category} 뉴스`;
    document.title = `${category} 뉴스 - Keyword Ranking News`;
}

function loadCategoryNews(category, page) {
    fetch(`/api/news?category=${category}&page=${page}&perPage=${newsPerPage}`)
        .then(response => response.json())
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
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('first-page').disabled = currentPage === 1;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
    document.getElementById('last-page').disabled = currentPage === totalPages;
}

function changePage(direction) {
    currentPage += direction;
    const category = new URLSearchParams(window.location.search).get('category') || '정치';
    loadCategoryNews(category, currentPage);
}

function goToPage(page) {
    currentPage = page;
    const category = new URLSearchParams(window.location.search).get('category') || '정치';
    loadCategoryNews(category, currentPage);
}

// 서버 API를 시뮬레이션하는 함수 (실제 구현에서는 이 부분이 서버에 있어야 함)
function fetch(url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const urlParams = new URLSearchParams(url.split('?')[1]);
            const page = parseInt(urlParams.get('page'));
            const perPage = parseInt(urlParams.get('perPage'));
            
            const allNews = [
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다. 주요 내용으로는 경제 활성화, 일자리 창출, 복지 정책 강화 등이 포함되었습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다. 쟁점은 예산안과 민생법안으로, 여야는 각자의 입장 차이를 좁히지 못하고 있는 상황입니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다. 주요 정당들은 경선을 통해 후보를 확정하고 있으며, 일부 지역에서는 무소속 후보들의 약진도 주목받고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다. 이번 로드맵에는 역사 문제 해결을 위한 양국 간 대화 채널 구축, 경제 협력 강화 방안 등이 포함되었습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다. 이번 정책에는 주택 공급 확대, 투기 억제 방안, 서민 주거 안정 대책 등이 포함될 것으로 예상됩니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다. 불필요한 해외 출장을 줄이고 출장 성과를 엄격히 관리하는 내용이 포함될 전망입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다. 기초생활보장 수급자 선정 기준 완화, 근로장려금 확대 등의 내용이 포함되어 있습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다. 인구 변화와 지역 균형 발전을 고려한 선거구 조정이 주요 쟁점으로 떠오르고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다. 태양광, 풍력 등 청정에너지 비중을 높이고 관련 산업 육성에 집중 투자할 계획입니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다. 공공서비스의 디지털화, 데이터 기반 정책 수립 등을 위한 법제도 정비가 주요 과제로 다뤄질 예정입니다." },
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다. 주요 내용으로는 경제 활성화, 일자리 창출, 복지 정책 강화 등이 포함되었습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다. 쟁점은 예산안과 민생법안으로, 여야는 각자의 입장 차이를 좁히지 못하고 있는 상황입니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다. 주요 정당들은 경선을 통해 후보를 확정하고 있으며, 일부 지역에서는 무소속 후보들의 약진도 주목받고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다. 이번 로드맵에는 역사 문제 해결을 위한 양국 간 대화 채널 구축, 경제 협력 강화 방안 등이 포함되었습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다. 이번 정책에는 주택 공급 확대, 투기 억제 방안, 서민 주거 안정 대책 등이 포함될 것으로 예상됩니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다. 불필요한 해외 출장을 줄이고 출장 성과를 엄격히 관리하는 내용이 포함될 전망입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다. 기초생활보장 수급자 선정 기준 완화, 근로장려금 확대 등의 내용이 포함되어 있습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다. 인구 변화와 지역 균형 발전을 고려한 선거구 조정이 주요 쟁점으로 떠오르고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다. 태양광, 풍력 등 청정에너지 비중을 높이고 관련 산업 육성에 집중 투자할 계획입니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다. 공공서비스의 디지털화, 데이터 기반 정책 수립 등을 위한 법제도 정비가 주요 과제로 다뤄질 예정입니다." },
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다. 주요 내용으로는 경제 활성화, 일자리 창출, 복지 정책 강화 등이 포함되었습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다. 쟁점은 예산안과 민생법안으로, 여야는 각자의 입장 차이를 좁히지 못하고 있는 상황입니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다. 주요 정당들은 경선을 통해 후보를 확정하고 있으며, 일부 지역에서는 무소속 후보들의 약진도 주목받고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다. 이번 로드맵에는 역사 문제 해결을 위한 양국 간 대화 채널 구축, 경제 협력 강화 방안 등이 포함되었습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다. 이번 정책에는 주택 공급 확대, 투기 억제 방안, 서민 주거 안정 대책 등이 포함될 것으로 예상됩니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다. 불필요한 해외 출장을 줄이고 출장 성과를 엄격히 관리하는 내용이 포함될 전망입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다. 기초생활보장 수급자 선정 기준 완화, 근로장려금 확대 등의 내용이 포함되어 있습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다. 인구 변화와 지역 균형 발전을 고려한 선거구 조정이 주요 쟁점으로 떠오르고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다. 태양광, 풍력 등 청정에너지 비중을 높이고 관련 산업 육성에 집중 투자할 계획입니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다. 공공서비스의 디지털화, 데이터 기반 정책 수립 등을 위한 법제도 정비가 주요 과제로 다뤄질 예정입니다." },
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다. 주요 내용으로는 경제 활성화, 일자리 창출, 복지 정책 강화 등이 포함되었습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다. 쟁점은 예산안과 민생법안으로, 여야는 각자의 입장 차이를 좁히지 못하고 있는 상황입니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다. 주요 정당들은 경선을 통해 후보를 확정하고 있으며, 일부 지역에서는 무소속 후보들의 약진도 주목받고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다. 이번 로드맵에는 역사 문제 해결을 위한 양국 간 대화 채널 구축, 경제 협력 강화 방안 등이 포함되었습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다. 이번 정책에는 주택 공급 확대, 투기 억제 방안, 서민 주거 안정 대책 등이 포함될 것으로 예상됩니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다. 불필요한 해외 출장을 줄이고 출장 성과를 엄격히 관리하는 내용이 포함될 전망입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다. 기초생활보장 수급자 선정 기준 완화, 근로장려금 확대 등의 내용이 포함되어 있습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다. 인구 변화와 지역 균형 발전을 고려한 선거구 조정이 주요 쟁점으로 떠오르고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다. 태양광, 풍력 등 청정에너지 비중을 높이고 관련 산업 육성에 집중 투자할 계획입니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다. 공공서비스의 디지털화, 데이터 기반 정책 수립 등을 위한 법제도 정비가 주요 과제로 다뤄질 예정입니다." },
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다. 주요 내용으로는 경제 활성화, 일자리 창출, 복지 정책 강화 등이 포함되었습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다. 쟁점은 예산안과 민생법안으로, 여야는 각자의 입장 차이를 좁히지 못하고 있는 상황입니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다. 주요 정당들은 경선을 통해 후보를 확정하고 있으며, 일부 지역에서는 무소속 후보들의 약진도 주목받고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다. 이번 로드맵에는 역사 문제 해결을 위한 양국 간 대화 채널 구축, 경제 협력 강화 방안 등이 포함되었습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다. 이번 정책에는 주택 공급 확대, 투기 억제 방안, 서민 주거 안정 대책 등이 포함될 것으로 예상됩니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다. 불필요한 해외 출장을 줄이고 출장 성과를 엄격히 관리하는 내용이 포함될 전망입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다. 기초생활보장 수급자 선정 기준 완화, 근로장려금 확대 등의 내용이 포함되어 있습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다. 인구 변화와 지역 균형 발전을 고려한 선거구 조정이 주요 쟁점으로 떠오르고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다. 태양광, 풍력 등 청정에너지 비중을 높이고 관련 산업 육성에 집중 투자할 계획입니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다. 공공서비스의 디지털화, 데이터 기반 정책 수립 등을 위한 법제도 정비가 주요 과제로 다뤄질 예정입니다." },
                { title: "대통령, 신년 국정 운영 계획 발표", content: "대통령이 오늘 청와대에서 신년 국정 운영 계획을 발표했습니다. 주요 내용으로는 경제 활성화, 일자리 창출, 복지 정책 강화 등이 포함되었습니다." },
                { title: "국회, 주요 법안 처리 앞두고 여야 협상 난항", content: "여야가 주요 법안 처리를 앞두고 협상에 난항을 겪고 있습니다. 쟁점은 예산안과 민생법안으로, 여야는 각자의 입장 차이를 좁히지 못하고 있는 상황입니다." },
                { title: "지방선거 앞두고 각 정당 후보 윤곽 드러나", content: "다가오는 지방선거를 앞두고 각 정당의 후보 윤곽이 드러나고 있습니다. 주요 정당들은 경선을 통해 후보를 확정하고 있으며, 일부 지역에서는 무소속 후보들의 약진도 주목받고 있습니다." },
                { title: "외교부, 한일 관계 개선 위한 로드맵 제시", content: "외교부가 한일 관계 개선을 위한 로드맵을 제시했습니다. 이번 로드맵에는 역사 문제 해결을 위한 양국 간 대화 채널 구축, 경제 협력 강화 방안 등이 포함되었습니다." },
                { title: "정부, 새로운 부동산 정책 발표 예정", content: "정부가 다음 주 새로운 부동산 정책을 발표할 예정입니다. 이번 정책에는 주택 공급 확대, 투기 억제 방안, 서민 주거 안정 대책 등이 포함될 것으로 예상됩니다." },
                { title: "국회의원 국외출장 규정 강화 추진", content: "국회가 의원들의 국외출장 규정을 강화하는 방안을 추진 중입니다. 불필요한 해외 출장을 줄이고 출장 성과를 엄격히 관리하는 내용이 포함될 전망입니다." },
                { title: "신규 복지 정책 발표, 저소득층 지원 확대", content: "정부가 저소득층을 위한 새로운 복지 정책을 발표했습니다. 기초생활보장 수급자 선정 기준 완화, 근로장려금 확대 등의 내용이 포함되어 있습니다." },
                { title: "여야, 선거구 획정 논의 본격화", content: "다가오는 선거를 앞두고 여야가 선거구 획정 논의를 본격화하고 있습니다. 인구 변화와 지역 균형 발전을 고려한 선거구 조정이 주요 쟁점으로 떠오르고 있습니다." },
                { title: "정부, 신재생에너지 정책 강화 방침", content: "정부가 신재생에너지 정책을 강화하겠다는 방침을 밝혔습니다. 태양광, 풍력 등 청정에너지 비중을 높이고 관련 산업 육성에 집중 투자할 계획입니다." },
                { title: "국회, 디지털 정부 전환 특별위원회 구성", content: "국회가 디지털 정부 전환을 위한 특별위원회를 구성했습니다. 공공서비스의 디지털화, 데이터 기반 정책 수립 등을 위한 법제도 정비가 주요 과제로 다뤄질 예정입니다." },
            ];

            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            const paginatedNews = allNews.slice(startIndex, endIndex);

            resolve({
                json: () => Promise.resolve({
                    news: paginatedNews,
                    totalPages: Math.ceil(allNews.length / perPage)
                })
            });
        }, 300); // 300ms 딜레이로 네트워크 요청 시뮬레이션
    });
}