import asyncio
from playwright.async_api import async_playwright
from datetime import datetime
import csv
import json


#daily
today = datetime.now().strftime('%Y%m%d')

#created dictionary which is named "categories" for each categories of world news
categories = {
    "aisa_and_austrailia" : f'https://news.naver.com/breakingnews/section/104/231?date={today}',
    'usa_and_sa' : f'https://news.naver.com/breakingnews/section/104/232?date={today}',
    "europe" : f'https://news.naver.com/breakingnews/section/104/233?date={today}',
    "africa" : f'https://news.naver.com/breakingnews/section/104/234?date={today}',
    "worldwide" : f'https://news.naver.com/breakingnews/section/104/322?date={today}'
}

information = []

async def main():
    async with async_playwright() as playwright:

  
        #launch a browser with headless to see what's going on with 500 slow_mode
        browser = await playwright.chromium.launch(headless=True, slow_mo=500)

        #create new blank page
        page = await browser.new_page()


        # for loop for each categories
        for each_category in categories.values():
            await page.goto(each_category)

            urls = await page.eval_on_selector_all('a.sa_text_title', 'elements =>elements.map(element=>element.href)')

            
            for url in urls:
                await page.goto(url)

                try:
                
                    # wait for the 'article' tag to be loaded
                    await page.wait_for_selector('article')
                # extract content from the 'article' tag
                    content = await page.text_content('article')
                    date = await page.locator('span._ARTICLE_DATE_TIME').all_inner_texts()
                    journalist = await page.locator('em.media_end_head_journalist_name').all_inner_texts()
                    title = await page.locator('h2.media_end_head_headline').all_inner_texts()
                    media = await page.locator('em.media_end_linked_more_point').all_inner_texts()
                    thumbnail_link = await page.get_attribute('img._LAZY_LOADING', 'src')
                    
                    information.append({
                        'title': title,
                        'date': date,
                        'content': content,
                        'journalist': journalist,
                        'media': media,
                        'url': url,
                        'thumbnail_link': thumbnail_link
                    })

                    print('BEGIN CONTENT>>>')
                    print(information[-1])
                    print('END CONTENT<<<')

                except Exception:
                    pass
            
        await browser.close()
    with open('news_information.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title','date','content','journalist','media','url','thumbnail_link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(information)

    # Save to TXT file
    with open('news_information.txt', 'w', encoding='utf-8') as txtfile:
        for item in information:
            txtfile.write(json.dumps(item, ensure_ascii=False) + '\n')

asyncio.run(main())
