import csv
import os
import time
from datetime import datetime

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

SCRAPED_URLS_FILE = "scraped_urls.txt"
CSV_FILE = "scraped_news.csv"


# 기사 더보기 끝까지 클릭
def load_all_articles(driver, url):
    try:
        while True:
            wait = WebDriverWait(driver, 10)
            more_button = wait.until(
                EC.element_to_be_clickable((By.CLASS_NAME, "section_more"))
            )
            ActionChains(driver).move_to_element(more_button).perform()
            more_button.click()
            time.sleep(2)
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
        title = driver.find_element(By.ID, "title_area").text
    except:
        title = driver.find_element(
            By.CLASS_NAME, "NewsEndMain_article_title__kqEzS"
        ).text

    try:
        media = driver.find_element(
            By.CLASS_NAME, "media_end_categorize_item"
        ).get_attribute("alt")
    except:
        media = (
            driver.find_element(
                By.CLASS_NAME, "NewsEndMain_article_head_press_logo__BrqAh"
            )
            .find_element(By.TAG_NAME, "img")
            .get_attribute("alt")
        )
    try:
        time = (
            driver.find_element(By.CLASS_NAME, "media_end_head_info_datestamp_bunch")
            .find_element(By.TAG_NAME, "span")
            .text
        )
    except:
        time = driver.find_element(By.CLASS_NAME, "date").text

    try:
        # BeautifulSoup을 사용해서 뉴스 요약이랑 사진 설명 제거
        soup = BeautifulSoup(driver.page_source, "html.parser")
        dic_area_soup = soup.find(id="dic_area")

        for tag in dic_area_soup.find_all(class_="media_end_summary"):
            tag.decompose()  # 특정 클래스를 가진 하위 요소 제거
        for tag in dic_area_soup.find_all(class_="end_photo_org"):
            tag.decompose()  # 특정 클래스를 가진 하위 요소 제거

        content = dic_area_soup.get_text(strip=True)
    except:
        soup = BeautifulSoup(driver.page_source, "html.parser")
        dic_area_soup = soup.find(id="comp_news_article")

        for tag in dic_area_soup.find_all(class_="img_desc"):
            tag.decompose()  # 특정 클래스를 가진 하위 요소 제거
        content = dic_area_soup.get_text(strip=True)

    try:
        image = driver.find_element(By.ID, "img1").get_attribute("src")
    except:
        try:
            image = driver.find_element(
                By.CLASS_NAME, "_VOD_PLAYER_WRAP"
            ).get_attribute("data-cover-image-url")
        except:
            image = ""
    category = category
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
def append_to_csv(data):
    file_exists = os.path.isfile(CSV_FILE)
    with open(CSV_FILE, "a", newline="", encoding="utf-8") as csvfile:
        fieldnames = ["url", "title", "media", "time", "content", "image", "category"]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()
        writer.writerow(data)


def scraping(section_url, browser):
    scraped_urls = read_scraped_urls()
    article_links = load_category_page(browser, section_url)
    for link in article_links:
        articles = get_article(browser, link)
        category = browser.find_element(By.CLASS_NAME, "section_title_h").text
        for article in articles:
            if article not in scraped_urls:
                article_info = get_information(browser, article, category)
                append_to_csv(article_info)
                write_scraped_url(article)


def main():
    print(ChromeDriverManager(driver_version="120").install())
    browser = webdriver.Chrome()
    scraping("https://news.naver.com/section/101", browser)
    scraping("https://news.naver.com/section/103", browser)

    browser.quit()


if __name__ == "__main__":
    main()
