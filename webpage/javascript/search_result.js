document.addEventListener('DOMContentLoaded', function() {
    const searchResultsList = document.getElementById('search-results-list');
    const searchKeywordSpan = document.getElementById('search-keyword');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 예시 기사 데이터
    let articles = [
        {
            title: '예시 기사 제목 1',
            content: '예시 기사 내용 1',
            newsOutlet: '예시 언론사 1',
            keywords: ['키워드1', '키워드2'],
            publishedDate: '2024-07-01'
        },
        {
            title: '예시 기사 제목 1',
            content: '예시 기사 내용 1',
            newsOutlet: '예시 언론사 1',
            keywords: ['키워드1', '키워드2'],
            publishedDate: '2024-07-01'
        },
        {
            title: '예시 기사 제목 1',
            content: '예시 기사 내용 1',
            newsOutlet: '예시 언론사 1',
            keywords: ['키워드1', '키워드2'],
            publishedDate: '2024-07-01'
        },
        // 추가 기사 데이터...
    ];

    // URL에서 검색어 파라미터 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const initialSearchKeyword = urlParams.get('q') || '';

    // 초기 검색어 설정
    searchInput.value = initialSearchKeyword;
    searchKeywordSpan.textContent = initialSearchKeyword || '전체 기사';

    // 초기 검색 수행
    if (initialSearchKeyword) {
        performSearch(initialSearchKeyword);
    } else {
        displaySearchResults(articles);
    }

    // 검색 결과 표시 함수
    function displaySearchResults(results) {
        searchResultsList.innerHTML = '';
        if (results.length === 0) {
            searchResultsList.innerHTML = '<p>검색 결과가 없습니다.</p>';
            return;
        }
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <h3>${result.title}</h3>
                <p>${result.content}</p>
                <p class="news-outlet">언론사: ${result.newsOutlet}</p>
                <p class="keywords">키워드: ${result.keywords.join(', ')}</p>
                <p class="published-date">게시일: ${result.publishedDate}</p>
            `;
            searchResultsList.appendChild(resultItem);
        });
    }

    // 검색 함수
    function performSearch(keyword) {
        keyword = keyword.toLowerCase();
        const filteredResults = articles.filter(article =>
            article.title.toLowerCase().includes(keyword) ||
            article.content.toLowerCase().includes(keyword) ||
            article.newsOutlet.toLowerCase().includes(keyword) ||
            article.keywords.some(k => k.toLowerCase().includes(keyword))
        );
        searchKeywordSpan.textContent = keyword || '전체 기사';
        displaySearchResults(filteredResults);
    }

    // 검색 버튼 클릭 이벤트
    searchButton.addEventListener('click', function() {
        const keyword = searchInput.value.trim();
        performSearch(keyword);
        // URL 업데이트
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('q', keyword);
        window.history.pushState({}, '', newUrl);
    });

    // 엔터 키 이벤트
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});
