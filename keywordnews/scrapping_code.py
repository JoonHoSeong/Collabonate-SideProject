import asyncio
from playwright.async_api import async_playwright
from datetime import datetime
import os
import time
import psycopg2
import datetime
from categories.models import DetailCategory  # 실제 DetailCategory 모델을 import 해야 함

def connect_to_db():
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    return conn


def get_detail_category_id(category_name):
    try:
        detail_category = DetailCategory.objects.get(name=category_name)  # 예시에서는 이름으로 가져오는 예시
        return detail_category.id
    except DetailCategory.DoesNotExist:
        return None
    
    
# 스크랩했던 기사 링크 읽어오기
def read_scraped_urls(folder_path, today_date, category):
    file_path = os.path.join(folder_path, f"{today_date}_{category}_SCRAPED_URLS_FILE")
    if not os.path.exists(file_path):
        return set()
    with open(file_path, "r") as file:
        return set(line.strip() for line in file)


# 스크랩한 기사 목록 쓰기
def write_scraped_url(url, folder_path, today_date, category):
    file_path = os.path.join(folder_path, f"{today_date}_{category}_SCRAPED_URLS_FILE")
    with open(file_path, "a") as file:
        file.write(f"{url}\n")
        
# 오늘 날짜와 요일을 구하는 함수
def get_today_date_and_weekday():
    now = datetime.now()
    today_date = now.strftime('%Y-%m-%d')
    weekday = (now.weekday() + 1) % 7  # 일요일:0 ~ 토요일:6
    return today_date, weekday


def insert_data(conn, table_name, data):
    try:
        cursor = conn.cursor()

        # Detail 카테고리 ID 가져오기
        detail_category_id = get_detail_category_id(data['detail_category'])

        # 삽입 쿼리 작성
        insert_query = f"""
        INSERT INTO {table_name} (title, link, thumbnail, publication_date, media, summary, detail_category_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        # 데이터를 튜플 형태로 변환하여 쿼리 실행
        cursor.execute(insert_query, (
            data['title'],
            data['link'],
            data['thumbnail'],
            data['publication_date'],
            data['media'],
            data['summary'],
            detail_category_id  # 가져온 detail_category_id 사용
        ))

        conn.commit()
        print(f"Saved to database: {data['title']}")

    except Exception as e:
        print(f"Error occurred while saving to database: {str(e)}")




async def main():
    async with async_playwright() as playwright:
        
        current_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        output_dir = './output'
        os.makedirs(output_dir, exist_ok=True)
        
        folder_path = "scraped_urls"

        # Ensure the folder exists; create if it doesn't
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        # launch a browser with headless mode to scrape data
        browser = await playwright.chromium.launch(headless=False)

        # create a new page
        page = await browser.new_page()
        
        conn = connect_to_db()
        
        # 네이버 뉴스 메인 페이지로 이동
        url = "https://news.naver.com/"
        
        await page.goto(url)
        
        # 상단에 메인 카테고리 정보 가져오기 -> 우리가 사용할 카테고리는 "정치"~"세계"까지만([1]~[6])
        category_urls = await page.eval_on_selector_all('.Nitem_link', 'elements => elements.map(element => element.href)')
        category_urls_use = category_urls[1:7]
        
        # 메인 카테고리로 이동
        for i in range(len(category_urls_use)):
            
            await page.goto(category_urls_use[i])
            
            # 메인 카테고리 데이터 수집
            category_main = await page.locator('.ct_snb_h2_a').all_inner_texts()
            category_main_text = category_main[0]
            category_main_cleaned = category_main_text.replace('/', ' ')
            
            # 세부 카테고리 데이터 수집
            category_detail_url = await page.eval_on_selector_all('.ct_snb_nav_item_link', 'elements => elements.map(element => element.href)')
            category_detail_text = await page.locator('.ct_snb_nav_item_link').all_inner_texts()
        
            category_detail_cleaned = [cat.replace('/', ' ') for cat in category_detail_text]


            # for loop for each category
            for i in range(len(category_detail_url)):
                
                start_time = time.time()  # 시작 시간 기록
                
                main_category = category_main_cleaned
                detail_category = category_detail_cleaned[i]
                category = f"{category_main_cleaned}_{category_detail_cleaned[i]}"
                
                
                print("--------------------------------------------")
                print(f"{current_time} : 데이터 수집 시작")
                print("카테고리 :", category)
                
                await page.goto(category_detail_url[i])

                today_date, weekday = get_today_date_and_weekday()
                
                scraped_urls = read_scraped_urls(folder_path, today_date, category)
            
                # 오늘 날짜 페이지로 이동
                await page.click(".section_title_btn.is_closed._CALENDAR_LAYER_TOGGLE")
                css_selector = f".day.is_today.is_selected.calendar-day-{today_date}.calendar-dow-{weekday}"
                await page.click(css_selector)
                
                # "더보기" 버튼 누르기
                while True:
                    try:
                        load_more_button = await page.wait_for_selector(".section_more_inner._CONTENT_LIST_LOAD_MORE_BUTTON", timeout=10000)
                        await load_more_button.click()
                        await page.wait_for_timeout(100)
                    except Exception as e:
                        print("더 이상 기사가 없습니다")
                        break
                
                urls = await page.eval_on_selector_all('a.sa_text_title', 'elements => elements.map(element => element.href)')
                
                for url in urls:
                    if url in scraped_urls:
                        break
                        

                    try:
                        await page.goto(url)
                        # wait for the 'article' tag to be loaded
                        await page.wait_for_selector('article')

                        # extract content from the 'article' tag
                        content = await page.text_content('article')

                        try:
                            date = await page.locator('span._ARTICLE_DATE_TIME').all_inner_texts()
                        except Exception:
                            date = "N/A"

                        try:
                            title = await page.locator('h2.media_end_head_headline').all_inner_texts()
                        except Exception:
                            title = "N/A"

                        try:
                            media = await page.locator('em.media_end_linked_more_point').all_inner_texts()
                        except Exception:
                            media = "N/A"

                        try:
                            thumbnail_link = await page.get_attribute('img._LAZY_LOADING', 'src')
                        except Exception:
                            thumbnail_link = "N/A"

                        data = {
                            'detail_category': detail_category,
                            'title': title,
                            'publication_date': date,
                            'summary': content,
                            'media': media,
                            'link': url,
                            'thumbnail': thumbnail_link
                        }
                        
                        
                        # 데이터베이스에 삽입 테이블:News
                        insert_data(conn,"News", data)
                        
                        write_scraped_url(url, folder_path, today_date, category)

                    except Exception as e:
                        print(f"Error occurred while scraping {url}: {str(e)}")
                    
                print(f"{len(urls)}개 데이터 수집 완료")
                    
                
                end_time = time.time()  # 종료 시간 기록
                elapsed_time = end_time - start_time  # 경과 시간 계산
                print(f"카테고리 '{category}' 수집에 걸린 시간: {elapsed_time:.2f} 초")
            
        conn.close()
        await browser.close()
        
try:
    asyncio.run(main())
except Exception as e:
    print(f"An error occurred: {str(e)}")
        
        