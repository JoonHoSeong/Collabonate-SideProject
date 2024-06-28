import asyncio
from playwright.async_api import async_playwright
from datetime import datetime
import csv
import os
import time


async def main():
    async with async_playwright() as playwright:
        
        current_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        output_dir = './output'
        os.makedirs(output_dir, exist_ok=True)

        # launch a browser with headless mode to scrape data
        browser = await playwright.chromium.launch(headless=True)

        # create a new page
        page = await browser.new_page()
        
        url = "https://news.naver.com/section/100"
        
        await page.goto(url)
        
        # 메인 카테고리 데이터 수집
        category_main = await page.locator('.ct_snb_h2_a').all_inner_texts()
        category_main_text = category_main[0]
        category_main_cleaned = category_main_text.replace('/', ' ')
        
        # 세부 카테고리 데이터 수집
        category_detail_url = await page.eval_on_selector_all('.ct_snb_nav_item_link', 'elements => elements.map(element => element.href)')
        category_detail_text = await page.locator('.ct_snb_nav_item_link').all_inner_texts()
    
        category_detail_cleaned = [cat.replace('/', ' ') for cat in category_detail_text]

        # 오늘 날짜와 요일을 구하는 함수
        def get_today_date_and_weekday():
            now = datetime.now()
            today_date = now.strftime('%Y-%m-%d')
            weekday = (now.weekday() + 1) % 7  # 일요일:0 ~ 토요일:6
            return today_date, weekday

        # for loop for each category
        for i in range(len(category_detail_url)):
            
            start_time = time.time()  # 시작 시간 기록
            
            category = f"{category_main_text}_{category_detail_text[i]}"
            category_filename = f"{category_main_cleaned}_{category_detail_cleaned[i]}"
            
            print("--------------------------------------------")
            print(f"{current_time} : 데이터 수집 시작")
            print("카테고리 :", category)
            
            await page.goto(category_detail_url[i])

            today_date, weekday = get_today_date_and_weekday()
        
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
            
            information = []
            
            for url in urls:
                await page.goto(url)

                try:
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

                    information.append({
                        'category': category,
                        'title': title,
                        'date': date,
                        'content': content,
                        'media': media,
                        'url': url,
                        'thumbnail_link': thumbnail_link
                    })

                except Exception as e:
                    print(f"Error occurred while scraping {url}: {str(e)}")
                
            print(f"{len(urls)}개 데이터 수집 완료")
                
            csv_filename = f'{output_dir}/{current_time}_{category_filename}.csv'

            # save as csv file
            try:
                with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = ['category', 'title', 'date', 'content', 'media', 'url', 'thumbnail_link']
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(information)
                
                print("csv 파일로 저장 완료")
            except Exception as e:
                print(f"Error occurred while saving CSV file: {str(e)}")
            
            end_time = time.time()  # 종료 시간 기록
            elapsed_time = end_time - start_time  # 경과 시간 계산
            print(f"카테고리 '{category}' 수집에 걸린 시간: {elapsed_time:.2f} 초")
            
        
        await browser.close()

try:
    asyncio.run(main())
except Exception as e:
    print(f"An error occurred: {str(e)}")