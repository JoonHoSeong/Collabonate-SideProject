// main.js
window.onload = function() {
    // 예시 뉴스 데이터
    var newsData = {
        "title": "Example News Title",
        "thumbnail": "https://via.placeholder.com/150",
        "content": "This is an example news article. It contains information about the news topic."
    };

    // 예시 댓글 데이터
    var commentsData = [
        {
            "text": "This is an example comment."
        },
        {
            "text": "This is another example comment."
        }
    ];

    // 뉴스 데이터를 로드합니다
    document.getElementById('news-title').innerText = newsData.title;
    document.getElementById('news-thumbnail').src = newsData.thumbnail;
    document.getElementById('news-content').innerText = newsData.content;

    // 댓글 데이터를 로드합니다
    const commentsElement = document.getElementById('comments');
    commentsData.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.className = 'comment-card';
        commentCard.innerText = comment.text;
        commentsElement.appendChild(commentCard);
    });

    // 댓글 달기 버튼에 이벤트 리스너를 추가합니다
    document.getElementById('comment-button').addEventListener('click', function() {
        const commentInput = document.getElementById('comment-input');
        const commentText = commentInput.value;
        if (commentText) {
            const commentCard = document.createElement('div');
            commentCard.className = 'comment-card';
            commentCard.innerText = commentText;
            document.getElementById('comments').appendChild(commentCard);
            commentInput.value = '';
        }
    });
};
