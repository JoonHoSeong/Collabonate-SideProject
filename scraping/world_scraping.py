import asyncio
from playwright.async_api import async_playwright
from datetime import datetime
import csv

# daily
today = datetime.now().strftime('%Y%m%d')

# created dictionary which is named "categories" for each categories of world news
category_ids = {
    "aisa_and_austrailia": 231,
    'usa_and_sa': 232,
    "europe": 233,
    "africa": 234,
    "worldwide": 322
}

#soft-code for each categories daily
categories = {key: f'https://news.naver.com/breakingnews/section/104/{value}?date={today}' for key, value in category_ids.items()}

information = []

async def main():
    async with async_playwright() as playwright:

        # launch a browser with headless to see what's going on with 500 slow_mode
        browser = await playwright.chromium.launch(headless=True, slow_mo=500)

        # create new blank page
        page = await browser.new_page()

        # for loop for each category
        for each_category in categories.values():
            await page.goto(each_category)

            urls = await page.eval_on_selector_all('a.sa_text_title', 'elements => elements.map(element => element.href)')

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
                        'title': title,
                        'date': date,
                        'content': content,
                        'media': media,
                        'url': url,
                        'thumbnail_link': thumbnail_link
                    })

                    print(information[-1])

                except Exception:
                    pass

        await browser.close()

    #save as csv file
    with open('world_news.csv', 'w', newline='', encoding='utf-8') as csvfile:
        fieldnames = ['title', 'date', 'content', 'media', 'url', 'thumbnail_link']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(information)

asyncio.run(main())