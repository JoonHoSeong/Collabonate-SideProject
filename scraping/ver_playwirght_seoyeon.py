from playwright.async_api import async_playwright
from playwright.async_api import Error
import asyncio
import csv
import os
from datetime import datetime
import logging

# Logger configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SCRAPED_URLS_FILE = os.path.abspath("scraping/scraped_urls.txt")


# 기사 더보기 끝까지 클릭
async def load_all_articles(page):
    try:
        while True:
            more_button = await page.wait_for_selector(".section_more", timeout=1000)
            await more_button.hover()
            await more_button.click(timeout=1000)
            await page.wait_for_load_state("networkidle", timeout=1000)
    except Exception as e:
        pass


# 세부 카테고리 링크 return
async def load_category_page(page, section_url):
    await page.goto(section_url)
    link_elements = await page.query_selector_all('.ct_snb_nav_item_link')
    links = [await element.get_attribute('href') for element in link_elements]
     # 각 링크 앞에 "https://"를 붙임
    links_with_https = [f"https://news.naver.com{link}" for link in links]
    
    return links_with_https


# 오늘 날짜 가져오기
def get_today_date():
    today = datetime.now()
    return today.strftime("%Y%m%d")


# 세부카테고리 기사목록 가져오기
async def get_article_links(page, article_url):
    await page.goto(f"{article_url}?date={get_today_date()}")
    await load_all_articles(page)
    articles = await page.query_selector_all(".sa_text_title")
    links = []
    for article in articles:
        href = await article.get_attribute("href")
        if href:
            links.append(href)
    return links


# 정보빼오기
async def get_information(page, article_url, category):
    await page.goto(article_url)
    url = article_url

    try:

        await page.wait_for_selector("article")
                    # extract content from the 'article' tag
        content = await page.text_content("article")
        time = await page.locator("span._ARTICLE_DATE_TIME").all_inner_texts()
        time_text=time[0]
        journalist = await page.locator("em.media_end_head_journalist_name").all_inner_texts()
        try: 
            title = await page.locator("h2.media_end_head_headline").all_inner_texts()
        except:
            title = await page.locator("h2.NewsEndMain_article_title__kqEzS").all_inner_texts()
        media = await page.locator("em.media_end_linked_more_point").all_inner_texts()
        media_text=media[0]
        image_src = await page.get_attribute("img._LAZY_LOADING", "src")
        return {
        "url": url,
        "title": title,
        "media": media_text,
        "time": time_text,
        "content": content,
        "image": image_src,
        "category": category,
    }

                    
    except Exception:
        return {
        "url": " ",
        "title": " ",
        "media": " ",
        "time": " ",
        "content": " ",
        "image":" ",
        "category": " ",
    }


# 스크랩했던 기사 링크 읽어오기
def read_scraped_urls():
    if not os.path.exists(SCRAPED_URLS_FILE):
        return set()
    with open(SCRAPED_URLS_FILE, "r") as file:
        return set(line.strip() for line in file)


# 스크랩한 기사 목록 쓰기
def write_scraped_url(url):
    with open(SCRAPED_URLS_FILE, "a") as file:
        file.write(f"{url}\n")


# csv파일에 스크래핑한 정보 저장
def save_to_csv(scraped_data, csv_file_path):
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


# 스크래핑 함수
async def scraping(section_url):
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=False)
        page = await browser.new_page()

        try:
            scraped_urls = read_scraped_urls()
            article_links = await load_category_page(page, section_url)
            scraped_data = []
            for link in article_links:
                start_time = datetime.now()
                articles = await get_article_links(page, link)
                category =await page.locator("a.ct_snb_h2_a").all_inner_texts()
                category_text=category[0].replace('/', '+')
                semi_category =await page.locator("h3.section_title_h").all_inner_texts()
                semi_category_text=semi_category[0].replace('/', '+')
                for article in articles:
                    if article not in scraped_urls:
                        article_info = await get_information(page, article, category_text)
                        scraped_data.append(article_info)
                        write_scraped_url(article)
                csv_file_path = os.path.abspath(f"/Users/mac/KeywordRankingNews_KRN/scraping/output/{category_text}_{semi_category_text}_{datetime.now()}.csv")
                save_to_csv(scraped_data, csv_file_path)
                end_time = datetime.now()
                execution_time = (end_time - start_time).total_seconds()
                logger.info(f"Execution time: {execution_time} seconds")
        finally:
            await browser.close()


def main():
    section_url = "https://news.naver.com/section/103"
    asyncio.run(scraping(section_url))



if __name__ == "__main__":
    main()
