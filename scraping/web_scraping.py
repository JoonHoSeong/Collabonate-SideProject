from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.action_chains import ActionChains
from bs4 import BeautifulSoup
import csv
import os
from datetime import datetime
from selenium.common.exceptions import NoSuchElementException
import logging
# 로거 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
SCRAPED_URLS_FILE = os.path.abspath("scraping/scraped_urls.txt")


# 기사 더보기 끝까지 클릭
def load_all_articles(driver, url):
    try:
        while True:
            wait = WebDriverWait(driver, 3)
            more_button = wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "section_more")))
            ActionChains(driver).move_to_element(more_button).perform()
            more_button.click()
            time.sleep(1)
    except Exception as e:
        pass


# 세부 카테고리 링크 return
def load_category_page(driver, section_url):
    driver.get(section_url)
    link_elements = driver.find_elements(By.CLASS_NAME, "ct_snb_nav_item_link")
    return [element.get_attribute("href") for element in link_elements]


# 오늘 날짜 가져오기
def get_today_date():
    today = datetime.now()
    return today.strftime("%Y%m%d")


# 기사 링크 리스트 return
def get_article(driver, article_url):
    driver.get(article_url + "?date=" + get_today_date())
    load_all_articles(driver, article_url)
    articles = driver.find_elements(By.CLASS_NAME, "sa_text_title")
    return [element.get_attribute("href") for element in articles]


# 기사에서 정보 뽑아오기
def get_information(driver, article_url, category):
    driver.get(article_url)
    url = article_url

    try:
        title_element = (
            driver.find_element(By.ID, "title_area")
            or driver.find_element(By.CLASS_NAME, "NewsEndMain_article_title__kqEzS")
            or driver.find_element(By.ID, "content").media_element.find_element(By.TAG_NAME, "h2")
        )
        title = title_element.text
    except NoSuchElementException:
        title = " "
        logger.error(f"error : title, url={url}")

    try:
        media_element = driver.find_element(By.ID, "ct_wrap") or driver.find_element(By.ID, "content")
        media = media_element.find_element(By.TAG_NAME, "img").get_attribute("alt")
    except NoSuchElementException:
        media = " "
        logger.error(f"error : media, url={url}")

    try:
        time_element = (
            driver.find_element(By.CLASS_NAME, "media_end_head_info_datestamp_bunch").find_element(By.TAG_NAME, "span")
            or driver.find_element(By.CLASS_NAME, "date")
            or driver.find_element(By.CLASS_NAME, "NewsEndMain_article_title__kqEzS")
            or driver.find_element(By.ID, "content").media_element.find_element(By.TAG_NAME, "em")
        )
        time = time_element.text
    except NoSuchElementException:
        time = " "
        logger.error(f"error : time, url={url}")

    try:
        dic_area_soup = BeautifulSoup(driver.page_source, "html.parser").find(id="dic_area") or BeautifulSoup(
            driver.page_source, "html.parser"
        ).find(id="comp_news_article")

        for tag in dic_area_soup.find_all(class_="media_end_summary"):
            tag.decompose()

        for tag in dic_area_soup.find_all(class_="end_photo_org"):
            tag.decompose()

        content = dic_area_soup.get_text(strip=True)
    except AttributeError:
        content = " "

    try:
        image = driver.find_element(By.ID, "img1").get_attribute("src") or driver.find_element(
            By.CLASS_NAME, "_VOD_PLAYER_WRAP"
        ).get_attribute("data-cover-image-url")
    except NoSuchElementException:
        image = " "

    return {
        "url": url,
        "title": title,
        "media": media,
        "time": time,
        "content": content,
        "image": image,
        "category": category,
    }


def read_scraped_urls():
    if not os.path.exists(SCRAPED_URLS_FILE):
        return set()
    with open(SCRAPED_URLS_FILE, "r") as file:
        return set(line.strip() for line in file)


def write_scraped_url(url):
    with open(SCRAPED_URLS_FILE, "a") as file:
        file.write(f"{url}\n")


# csv파일에 저장


def save_to_csv(scraped_data, csv_file_path):
    with open(csv_file_path, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["URL", "Title", "Media", "Time", "Content", "Image", "Category"])  # CSV 헤더
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


def scraping(section_url, browser):
    scraped_urls = read_scraped_urls()
    article_links = load_category_page(browser, section_url)
    scraped_data = []
    for link in article_links:
        articles = get_article(browser, link)
        category = browser.find_element(By.CLASS_NAME, "section_title_h").text
        for article in articles:
            if article not in scraped_urls:
                article_info = get_information(browser, article, category)
                scraped_data.append(article_info)
                write_scraped_url(article)
    return scraped_data


def main():

    options = Options()

    print(ChromeDriverManager(driver_version="120").install())
    browser = webdriver.Chrome(options=options)

    start_time = time.time()
    scraped_data = scraping("https://news.naver.com/section/101", browser)
    # CSV 파일 절대경로로 저장
    csv_file_path = os.path.abspath("scraping/scraped_data.csv")
    save_to_csv(scraped_data, csv_file_path)
    end_time = time.time()
    execution_time = end_time - start_time

    logger.info(f"함수 실행 시간: {execution_time} 초")
    # scraping("https://news.naver.com/section/103", browser)

    browser.quit()


if __name__ == "__main__":

    main()

 