const newsData = [
    {
      title: "새로운 기술로 환경 문제 해결",
      outlet: "뉴스A",
      category: "기술",
      content: "혁신적인 기술이 환경 문제 해결에 기여하고 있다. 예를 들어, 태양광 에너지 기술은 화석 연료 의존도를 줄이고, 인공지능은 환경 데이터 분석을 통해 효율적인 자원 관리를 가능하게 한다.",
    }
  ];
  
  const newsContainer = document.getElementById('news-container');
  const commentInput = document.getElementById('comment-input');
  const commentButton = document.getElementById('comment-button');
  const commentList = document.getElementById('comment-list');
  
  displayNews(newsData[0]);
  
  function displayNews(news) {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
  
    const title = document.createElement('h3');
    title.textContent = news.title;
    newsItem.appendChild(title);
  
    const outlet = document.createElement('p');
    outlet.textContent = `언론사: ${news.outlet}`;
    newsItem.appendChild(outlet);
  
    const category = document.createElement('p');
    category.textContent = `카테고리: ${news.category}`;
    newsItem.appendChild(category);
  
    const content = document.createElement('p');
    content.textContent = news.content;
    newsItem.appendChild(content);
  
    newsContainer.appendChild(newsItem);
  }
  
  function addComment(commentText, parentComment = null) {
    const newComment = document.createElement('li');
    newComment.classList.add('comment');
  
    const commentContent = document.createElement('div');
    commentContent.textContent = commentText;
    newComment.appendChild(commentContent);
  
    const replyForm = document.createElement('div');
    replyForm.classList.add('reply-form', 'hidden');
    const replyInput = document.createElement('textarea');
    replyInput.placeholder = '대댓글을 입력하세요';
    const replyButton = document.createElement('button');
    replyButton.textContent = '대댓글 작성';
    replyForm.appendChild(replyInput);
    replyForm.appendChild(replyButton);
    newComment.appendChild(replyForm);
  
    replyButton.addEventListener('click', () => {
      const replyText = replyInput.value.trim();
      if (replyText) {
        addComment(replyText, newComment);
        replyInput.value = '';
        replyForm.classList.add('hidden');
      }
    });
  
    const replyToggle = document.createElement('button');
    replyToggle.textContent = '답글 달기';
    replyToggle.addEventListener('click', () => {
      replyForm.classList.toggle('hidden');
    });
    newComment.appendChild(replyToggle);
  
    if (parentComment) {
      if (!parentComment.querySelector('.reply-list')) {
        const replyList = document.createElement('ul');
        replyList.classList.add('reply-list');
        parentComment.appendChild(replyList);
      }
      parentComment.querySelector('.reply-list').appendChild(newComment);
    } else {
      commentList.appendChild(newComment);
    }
  }
  
  commentButton.addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
      addComment(commentText);
      commentInput.value = '';
    }
  });
  