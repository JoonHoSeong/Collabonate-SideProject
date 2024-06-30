// mypage.js

let allNews = []; // 모든 뉴스를 저장할 배열
let currentDisplayCount = 5; // 현재 표시된 뉴스 개수

// 최근 본 뉴스 예시 데이터
const mockNewsData = [
    { id: 1, title: "코로나19 백신 접종 시작", summary: "전국적으로 코로나19 백신 접종이 시작되었습니다." },
    { id: 2, title: "새로운 AI 기술 개발", summary: "국내 연구진이 혁신적인 AI 기술을 개발했다고 발표했습니다." },
    { id: 3, title: "올림픽 개막식 성황리에 열려", summary: "2024년 올림픽이 화려한 개막식과 함께 시작되었습니다." },
    { id: 4, title: "글로벌 기후 변화 대책 논의", summary: "세계 각국 정상들이 모여 기후 변화 대응책을 논의했습니다." },
    { id: 5, title: "신규 창업 지원 정책 발표", summary: "정부가 청년 창업을 위한 새로운 지원 정책을 발표했습니다." },
    { id: 6, title: "우주 탐사선 화성 착륙 성공", summary: "국제 우주 탐사선이 화성 표면에 성공적으로 착륙했습니다." },
    { id: 7, title: "새로운 교육 시스템 도입", summary: "교육부가 AI를 활용한 새로운 교육 시스템 도입을 발표했습니다." },
    { id: 8, title: "세계 경제 포럼 개최", summary: "세계 각국의 경제 전문가들이 모여 경제 전망을 논의했습니다." },
    { id: 9, title: "신규 문화재 발굴", summary: "국내에서 새로운 고대 유적이 발견되어 학계의 주목을 받고 있습니다." },
    { id: 10, title: "국제 영화제 개막", summary: "세계적인 영화인들이 참석한 국제 영화제가 개막되었습니다." },
    { id: 1, title: "코로나19 백신 접종 시작", summary: "전국적으로 코로나19 백신 접종이 시작되었습니다." },
    { id: 2, title: "새로운 AI 기술 개발", summary: "국내 연구진이 혁신적인 AI 기술을 개발했다고 발표했습니다." },
    { id: 3, title: "올림픽 개막식 성황리에 열려", summary: "2024년 올림픽이 화려한 개막식과 함께 시작되었습니다." },
    { id: 4, title: "글로벌 기후 변화 대책 논의", summary: "세계 각국 정상들이 모여 기후 변화 대응책을 논의했습니다." },
    { id: 5, title: "신규 창업 지원 정책 발표", summary: "정부가 청년 창업을 위한 새로운 지원 정책을 발표했습니다." },
    { id: 6, title: "우주 탐사선 화성 착륙 성공", summary: "국제 우주 탐사선이 화성 표면에 성공적으로 착륙했습니다." },
    { id: 7, title: "새로운 교육 시스템 도입", summary: "교육부가 AI를 활용한 새로운 교육 시스템 도입을 발표했습니다." },
    { id: 8, title: "세계 경제 포럼 개최", summary: "세계 각국의 경제 전문가들이 모여 경제 전망을 논의했습니다." },
    { id: 9, title: "신규 문화재 발굴", summary: "국내에서 새로운 고대 유적이 발견되어 학계의 주목을 받고 있습니다." },
    { id: 10, title: "국제 영화제 개막", summary: "세계적인 영화인들이 참석한 국제 영화제가 개막되었습니다." },
    { id: 1, title: "코로나19 백신 접종 시작", summary: "전국적으로 코로나19 백신 접종이 시작되었습니다." },
    { id: 2, title: "새로운 AI 기술 개발", summary: "국내 연구진이 혁신적인 AI 기술을 개발했다고 발표했습니다." },
    { id: 3, title: "올림픽 개막식 성황리에 열려", summary: "2024년 올림픽이 화려한 개막식과 함께 시작되었습니다." },
    { id: 4, title: "글로벌 기후 변화 대책 논의", summary: "세계 각국 정상들이 모여 기후 변화 대응책을 논의했습니다." },
    { id: 5, title: "신규 창업 지원 정책 발표", summary: "정부가 청년 창업을 위한 새로운 지원 정책을 발표했습니다." },
    { id: 6, title: "우주 탐사선 화성 착륙 성공", summary: "국제 우주 탐사선이 화성 표면에 성공적으로 착륙했습니다." },
    { id: 7, title: "새로운 교육 시스템 도입", summary: "교육부가 AI를 활용한 새로운 교육 시스템 도입을 발표했습니다." },
    { id: 8, title: "세계 경제 포럼 개최", summary: "세계 각국의 경제 전문가들이 모여 경제 전망을 논의했습니다." },
    { id: 9, title: "신규 문화재 발굴", summary: "국내에서 새로운 고대 유적이 발견되어 학계의 주목을 받고 있습니다." },
    { id: 10, title: "국제 영화제 개막", summary: "세계적인 영화인들이 참석한 국제 영화제가 개막되었습니다." },
    // ... 추가 20개의 뉴스 항목 (총 30개가 되도록)
];

document.addEventListener('DOMContentLoaded', function() {
    // 프로필 이미지 업로드
    const imageUpload = document.getElementById('image-upload');
    const profileImage = document.getElementById('profile-image');

    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 닉네임 변경
    const changeNicknameBtn = document.getElementById('change-nickname');
    const nicknameInput = document.getElementById('nickname');

    changeNicknameBtn.addEventListener('click', function() {
        const newNickname = nicknameInput.value.trim();
        if (newNickname) {
            console.log('새 닉네임:', newNickname);
            alert('닉네임이 변경되었습니다.');
        } else {
            alert('유효한 닉네임을 입력해주세요.');
        }
    });

    // 비밀번호 변경
    const changePasswordBtn = document.getElementById('change-password');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    changePasswordBtn.addEventListener('click', function() {
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
            return;
        }

        console.log('비밀번호 변경 요청');
        alert('비밀번호가 변경되었습니다.');
    });

    // 최근 본 뉴스 로드
    loadRecentNews();

    // 더보기/접기 버튼 이벤트 리스너
    const toggleButton = document.querySelector('.show-more');
    toggleButton.addEventListener('click', toggleNewsDisplay);
});

function loadRecentNews() {
    // 예시 데이터 사용
    allNews = mockNewsData;
    displayNews(allNews.slice(0, currentDisplayCount));
    updateToggleButton();
}

function displayNews(newsToShow) {
    const newsContainer = document.getElementById('news-history');
    newsContainer.innerHTML = '';

    newsToShow.forEach(news => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <h3>${news.title}</h3>
            <p>${news.summary}</p>
        `;
        newsContainer.appendChild(newsElement);
    });
}

function toggleNewsDisplay() {
    const toggleButton = document.querySelector('.show-more');
    
    if (currentDisplayCount < allNews.length) {
        currentDisplayCount = Math.min(currentDisplayCount + 5, allNews.length);
        displayNews(allNews.slice(0, currentDisplayCount));
    } else {
        currentDisplayCount = 5;
        displayNews(allNews.slice(0, currentDisplayCount));
    }
    
    updateToggleButton();
}

function updateToggleButton() {
    const toggleButton = document.querySelector('.show-more');
    
    if (currentDisplayCount >= allNews.length) {
        toggleButton.textContent = '접기';
    } else {
        toggleButton.textContent = '더보기';
    }

    toggleButton.style.display = allNews.length <= 5 ? 'none' : 'block';
}

// main.js 파일의 끝부분에 추가
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    searchButton.addEventListener('click', function() {
        const keyword = searchInput.value.trim();
        if (keyword) {
            window.location.href = `search-results.html?q=${encodeURIComponent(keyword)}`;
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});