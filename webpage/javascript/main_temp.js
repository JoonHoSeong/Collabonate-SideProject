// script.js

// 카테고리별, 키워드별, 언론사별 뉴스 항목을 가져옵니다
const categoryItems = document.querySelectorAll('.news-categories-detail ul li');
const keywordItems = document.querySelectorAll('.news-keywords-detail ul li');
const sourceItems = document.querySelectorAll('.news-sources-detail ul li');

// 각 섹션의 최대 표시 항목 수를 설정합니다
const maxItems = 5;

// 각 섹션의 더보기 버튼을 만듭니다
const categoryMoreBtn = createMoreButton('.news-categories');
const keywordMoreBtn = createMoreButton('.news-keywords');
const sourceMoreBtn = createMoreButton('.news-sources');

// 각 섹션의 항목을 초기에 maxItems 개만 표시합니다
showItems(categoryItems, maxItems);
showItems(keywordItems, maxItems);
showItems(sourceItems, maxItems);

// 더보기 버튼을 클릭하면 모든 항목을 표시합니다
categoryMoreBtn.addEventListener('click', () => showItems(categoryItems, categoryItems.length));
keywordMoreBtn.addEventListener('click', () => showItems(keywordItems, keywordItems.length));
sourceMoreBtn.addEventListener('click', () => showItems(sourceItems, sourceItems.length));

function createMoreButton(selector) {
  const moreBtn = document.createElement('button');
  moreBtn.textContent = '+';
  moreBtn.classList.add('more-btn');
  document.querySelector(selector).appendChild(moreBtn);
  moreBtn.style.display = 'block';
  moreBtn.style.marginLeft = 'auto';
  return moreBtn;
}

function showItems(items, maxCount) {
  items.forEach((item, index) => {
    item.style.display = index < maxCount ? 'inline-block' : 'none';
  });
}

const profileImage = document.getElementById('profile-image');
const dropdownMenu = document.getElementById('dropdown-menu');

profileImage.addEventListener('click', () => {
  dropdownMenu.classList.toggle('show');
});

window.addEventListener('click', (event) => {
  if (!event.target.matches('.profile-image')) {
    if (dropdownMenu.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
    }
  }
});
