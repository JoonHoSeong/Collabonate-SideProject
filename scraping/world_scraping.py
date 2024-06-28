import asyncio
import csv
import os
from datetime import datetime

from playwright.async_api import async_playwright

# daily
today = datetime.now().strftime("%Y%m%d")

# created dictionary which is named "categories" for each categories of world news
categories = {
    "aisa_and_austrailia": f"https://news.naver.com/breakingnews/section/104/231?date={today}",
    "usa_and_sa": f"https://news.naver.com/breakingnews/section/104/232?date={today}",
    "europe": f"https://news.naver.com/breakingnews/section/104/233?date={today}",
    "africa": f"https://news.naver.com/breakingnews/section/104/234?date={today}",
    "worldwide": f"https://news.naver.com/breakingnews/section/104/322?date={today}",
}

information = []

# 세부 카테고리 링크 return
async def load_category_page(page, section_url):
    await page.goto(section_url)
    link_elements = await page.query_selector_all('.ct_snb_nav_item_link')
    links = [await element.get_attribute('href') for element in link_elements]
     # 각 링크 앞에 "https://"를 붙임
    links_with_https = [f"https://news.naver.com{link}" for link in links]
    
    return links_with_https

#기사 끝까지 스크롤링
async def load_all_articles(page):
    try:
        while True:
            more_button = await page.wait_for_selector(".section_more")
            await more_button.hover()
            await more_button.click()
            await page.wait_for_load_state("networkidle")
    except Exception as e:
        pass

#csv파일에 저장
async def save_to_csv(scraped_data, csv_file_path):
    with open(csv_file_path, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["URL", "Title", "Media", "Time", "Content", "Image", "Category"])  # CSV header
        for data in scraped_data:
            writer.writerow(
                [
                    data["url"],
                    data["title"],
                    data["media"],
                    data["time"],
                    data["content"],
                    data["image"],
                    data["category"],
                ]
            )


async def main():
    async with async_playwright() as playwright:

        # launch a browser with headless to see what's going on with 500 slow_mode
        browser = await playwright.chromium.launch(headless=False, slow_mo=500)

        # create new blank page
        page = await browser.new_page()

        section_url="https://news.naver.com/section/101"
        article_links = await load_category_page(page, section_url)
        print(article_links)
        

    # for loop for each categories
        for each_category in article_links:
            await page.goto(f"{each_category}?date={today}")
            await load_all_articles(page)
            urls = await page.eval_on_selector_all("a.sa_text_title", "elements =>elements.map(element=>element.href)")

            for url in urls:
                await page.goto(url)

                try:

                    # wait for the 'article' tag to be loaded
                    await page.wait_for_selector("article")
                    # extract content from the 'article' tag
                    content = await page.text_content("article")
                    date = await page.locator("span._ARTICLE_DATE_TIME").all_inner_texts()
                    journalist = await page.locator("em.media_end_head_journalist_name").all_inner_texts()
                    title = await page.locator("h2.media_end_head_headline").all_inner_texts()
                    media = await page.locator("em.media_end_linked_more_point").all_inner_texts()
                    thumbnail_link = await page.get_attribute("img._LAZY_LOADING", "src")

                    information.append(
                        {
                            "title": title,
                            "date": date,
                            "content": content,
                            "journalist": journalist,
                            "media": media,
                            "url": url,
                            "thumbnail_link": thumbnail_link,
                        }
                    )

                    print(information[-1])

                except Exception:
                    pass
            csv_file_path = os.path.abspath(f"scraping/scraped_data.csv")
            save_to_csv(information, csv_file_path)

        await browser.close()

asyncio.run(main())
