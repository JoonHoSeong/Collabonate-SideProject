// mypage.js

let allNews = []; // 모든 뉴스를 저장할 배열
let currentDisplayCount = 5; // 현재 표시된 뉴스 개수

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
            // 여기에 서버로 새 닉네임을 보내는 로직을 구현
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

        // 여기에 서버로 비밀번호 변경 요청을 보내는 로직을 구현
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
    // 실제로는 서버에서 JSON을 받아오는 API 호출이 필요합니다.
    // 여기서는 예시 데이터를 사용합니다.
    const mockNewsData = [
        { id: 1, title: "첫 번째 뉴스 제목", summary: "첫 번째 뉴스 요약..." },
        { id: 2, title: "두 번째 뉴스 제목", summary: "두 번째 뉴스 요약..." },
        { id: 3, title: "세 번째 뉴스 제목", summary: "세 번째 뉴스 요약..." },
        { id: 1, title: "첫 번째 뉴스 제목", summary: "첫 번째 뉴스 요약..." },
        { id: 2, title: "두 번째 뉴스 제목", summary: "두 번째 뉴스 요약..." },
        { id: 3, title: "세 번째 뉴스 제목", summary: "세 번째 뉴스 요약..." },
        { id: 1, title: "첫 번째 뉴스 제목", summary: "첫 번째 뉴스 요약..." },
        { id: 2, title: "두 번째 뉴스 제목", summary: "두 번째 뉴스 요약..." },
        { id: 3, title: "세 번째 뉴스 제목", summary: "세 번째 뉴스 요약..." },
        { id: 1, title: "첫 번째 뉴스 제목", summary: "첫 번째 뉴스 요약..." },
        { id: 2, title: "두 번째 뉴스 제목", summary: "두 번째 뉴스 요약..." },
        { id: 3, title: "세 번째 뉴스 제목", summary: "세 번째 뉴스 요약..." },
        // ... 더 많은 뉴스 항목
    ];

    displayNews(mockNewsData);
}

// function loadRecentNews() {
//     // 실제로는 서버에서 JSON을 받아오는 API 호출이 필요합니다.
//     // 여기서는 예시 데이터를 사용합니다.
//     fetch('/api/recent-news')
//         .then(response => response.json())
//         .then(data => {
//             allNews = data; // 받아온 모든 뉴스 데이터 저장
//             displayNews(allNews.slice(0, currentDisplayCount)); // 처음 5개만 표시
//             updateToggleButton();
//         })
//         .catch(error => {
//             console.error('뉴스를 불러오는 데 실패했습니다:', error);
//         });
// }

function displayNews(newsToShow) {
    const newsContainer = document.getElementById('news-history');
    newsContainer.innerHTML = ''; // 기존 내용을 비웁니다.

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
        // 더 보기
        currentDisplayCount = Math.min(currentDisplayCount + 5, allNews.length);
        displayNews(allNews.slice(0, currentDisplayCount));
    } else {
        // 접기
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

    // 총 뉴스 개수가 5개 이하면 버튼 숨기기
    toggleButton.style.display = allNews.length <= 5 ? 'none' : 'block';
}

// function toggleNewsDisplay() {
//     const toggleButton = document.querySelector('.show-more');
    
//     if (currentDisplayCount < allNews.length) {
//         // 더 보기
//         currentDisplayCount = Math.min(currentDisplayCount + 5, allNews.length);
//         displayNews(allNews.slice(0, currentDisplayCount));
//     } else {
//         // 접기
//         currentDisplayCount = 5;
//         displayNews(allNews.slice(0, currentDisplayCount));
//     }
    
//     updateToggleButton();
// }

// function loadMoreHistory() {
//     // 여기에 추가 뉴스를 로드하는 로직을 구현합니다.
//     // 실제로는 서버에 추가 데이터를 요청하고 받아와야 합니다.
//     console.log('추가 뉴스 로드');
//     alert('추가 뉴스를 로드합니다.');
// }