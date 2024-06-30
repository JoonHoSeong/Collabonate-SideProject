// 가상의 JSON 데이터
const newsOutlets = {
    "items": ["KBS", "MBC", "SBS", "JTBC", "YTN", "연합뉴스", "중앙일보", "동아일보", "한겨레", "경향신문"]
};
const newsCategories = {
    "items": ["정치", "경제", "사회", "문화", "스포츠", "국제", "과학", "IT", "연예", "생활"]
};

function createNewsItems(containerId, items) {
    const container = document.getElementById(containerId);
    items.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.textContent = item;
        newsItem.style.display = index < 5 ? 'block' : 'none';
        container.appendChild(newsItem);
    });
}

function toggleItems(containerId, showMore) {
    const container = document.getElementById(containerId);
    const items = container.getElementsByClassName('news-item');
    const showMoreButton = container.nextElementSibling;
    const showLessButton = showMoreButton.nextElementSibling;

    for (let i = 0; i < items.length; i++) {
        if (showMore) {
            items[i].style.display = 'block';
        } else {
            items[i].style.display = i < 5 ? 'block' : 'none';
        }
    }

    showMoreButton.style.display = showMore ? 'none' : 'block';
    showLessButton.style.display = showMore ? 'block' : 'none';
}

function toggleDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// 드롭다운 메뉴 외부 클릭 시 닫기
window.onclick = function(event) {
    if (!event.target.matches('.profile-image')) {
        var dropdown = document.getElementById("dropdown");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
}
// 가상의 인기 뉴스 데이터 (언론사 정보 추가)
const popularNews = {
    "items": [
        {
            "title": "코로나19 백신 접종 시작",
            "content": "오늘부터 전국에서 코로나19 백신 접종이 시작됩니다. 의료진을 시작으로 단계적으로 확대될 예정입니다.",
            "image": "https://via.placeholder.com/300x150?text=Vaccine",
            "source": "KBS 뉴스"
        },
        {
            "title": "국내 IT 기업, 해외 진출 가속화",
            "content": "국내 주요 IT 기업들의 해외 시장 진출이 빠르게 진행되고 있습니다. 특히 동남아시아 시장에서 큰 성과를 거두고 있습니다.",
            "image": "https://via.placeholder.com/300x150?text=IT",
            "source": "매일경제"
        },
        {
            "title": "올해 장마, 평년보다 길어질 전망",
            "content": "기상청은 올해 장마가 평년보다 길어질 것으로 전망했습니다. 농작물 관리에 각별한 주의가 필요할 것으로 보입니다.",
            "image": "https://via.placeholder.com/300x150?text=Weather",
            "source": "YTN"
        },
        {
            "title": "신규 택지 개발 계획 발표",
            "content": "정부가 수도권 주택난 해소를 위한 신규 택지 개발 계획을 발표했습니다. 총 10만 가구 규모의 주택 공급이 예상됩니다.",
            "image": "https://via.placeholder.com/300x150?text=Housing",
            "source": "조선일보"
        },
        {
            "title": "국제 유가 상승세 지속",
            "content": "국제 유가가 상승세를 이어가며 6년 만에 최고치를 기록했습니다. 이에 따른 물가 상승 우려도 제기되고 있습니다.",
            "image": "https://via.placeholder.com/300x150?text=Oil",
            "source": "한국경제"
        },
        {
            "title": "新 한류 열풍, K-푸드 인기",
            "content": "한국 음식의 인기가 전 세계적으로 확산되고 있습니다. 특히 김치와 비빔밥이 큰 인기를 얻고 있습니다.",
            "image": "https://via.placeholder.com/300x150?text=K-Food",
            "source": "MBC 뉴스"
        }
    ]
};

function createNewsCards(containerId, items) {
    const container = document.getElementById(containerId);
    items.forEach((item, index) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'news-card';
        newsCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="news-card-content">
                <h3>${item.title}</h3>
                <p>${item.content}</p>
                <p class="source">${item.source}</p>
            </div>
        `;
        newsCard.style.display = index < 3 ? 'block' : 'none';
        container.appendChild(newsCard);
    });
}

function toggleItems(containerId, showMore) {
    const container = document.getElementById(containerId);
    const items = container.getElementsByClassName('news-card');
    const showMoreButton = container.nextElementSibling;
    const showLessButton = showMoreButton.nextElementSibling;

    for (let i = 0; i < items.length; i++) {
        items[i].style.display = showMore || i < 3 ? 'block' : 'none';
    }

    showMoreButton.style.display = showMore ? 'none' : 'block';
    showLessButton.style.display = showMore ? 'block' : 'none';
}

// 페이지 로드 시 뉴스 아이템 생성
window.onload = function() {
    createNewsItems('news-outlets', newsOutlets.items);
    createNewsItems('news-categories', newsCategories.items);
    createNewsCards('popular-news', popularNews.items);
}
// 로그인 상태를 시뮬레이션하는 변수 (실제로는 서버에서 이 정보를 가져와야 합니다)
let isLoggedIn = true;
let userNickname = "Nicname";

function toggleDropdown() {
    var dropdown = document.getElementById("dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    if (dropdown.style.display === "block") {
        updateDropdownMenu();
    }
}

function updateDropdownMenu() {
    var dropdown = document.getElementById("dropdown");
    var nicknameSpan = document.getElementById("user-nickname");
    dropdown.innerHTML = ''; // 기존 메뉴 항목을 모두 제거

    if (isLoggedIn) {
        nicknameSpan.textContent = userNickname;
        dropdown.innerHTML += '<a href="#"><i class="fas fa-user"></i> 마이페이지</a>';
        dropdown.innerHTML += '<a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> 로그아웃</a>';
    } else {
        nicknameSpan.textContent = "로그인";
        dropdown.innerHTML += '<a href="#" onclick="login()"><i class="fas fa-sign-in-alt"></i> 로그인</a>';
    }
}

function login() {
    isLoggedIn = flase;
    userNickname = "사용자"; // 실제로는 서버에서 사용자 정보를 받아와야 합니다
    alert("로그인되었습니다.");
    updateDropdownMenu();
}

function logout() {
    isLoggedIn = false;
    userNickname = "";
    alert("로그아웃되었습니다.");
    updateDropdownMenu();
}

// 드롭다운 메뉴 토글을 위한 이벤트 리스너
document.querySelector('.profile-container').addEventListener('click', toggleDropdown);

// 드롭다운 메뉴 외부 클릭 시 닫기
window.onclick = function(event) {
    if (!event.target.matches('.profile-container') && !event.target.matches('.profile-image') && !event.target.matches('.user-nickname')) {
        var dropdown = document.getElementById("dropdown");
        if (dropdown.style.display === "block") {
            dropdown.style.display = "none";
        }
    }
}

// 페이지 로드 시 실행되는 함수
window.onload = function() {
    createNewsItems('news-outlets', newsOutlets.items);
    createNewsItems('news-categories', newsCategories.items);
    createNewsCards('popular-news', popularNews.items);
    updateDropdownMenu(); // 초기 메뉴 상태 설정
}
