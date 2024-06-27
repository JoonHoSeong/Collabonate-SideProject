import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from datetime import datetime
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException, TimeoutException, ElementNotInteractableException, WebDriverException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import csv
import logging

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
    )

def setup_webdriver():
    user = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    options = Options()
    options.add_argument(f"User-Agent={user}")
    options.add_argument("--headless")  # 이 줄을 주석 처리하거나 제거
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def get_today_date_and_weekday():
    now = datetime.now()
    today_date = now.strftime('%Y-%m-%d')
    weekday = (now.weekday() + 1) % 7  # 일요일:0 ~ 토요일:6
    return today_date, weekday

def select_category(driver, index):
    url = "https://news.naver.com/section/100"
    driver.get(url)
    
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".ct_snb_nav_item_link"))
    )

    category_main = driver.find_element(By.CSS_SELECTOR, ".ct_snb_h2_a")
    category_detail = driver.find_elements(By.CSS_SELECTOR, ".ct_snb_nav_item_link")
    category_detail_list = [element.text for element in category_detail]
    category_cleaned = [cat.replace('/', ' ') for cat in category_detail_list]

    category = f"{category_main.text.strip()}_{category_detail[index].text.strip()}"
    category_filename = f"{category_main.text.strip()}_{category_cleaned[index].strip()}"

    logging.info(f"카테고리: {category}")
    
    category_detail[index].click()
    WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, ".section_title_btn.is_closed._CALENDAR_LAYER_TOGGLE"))
    ).click()
    
    today_date, weekday = get_today_date_and_weekday()
    css_selector = f".day.is_today.is_selected.calendar-day-{today_date}.calendar-dow-{weekday}"
    WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, css_selector))
    ).click()
    
    return category, category_filename

def load_all_articles(driver):
    while True:
        try:
            load_more_button = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".section_more_inner._CONTENT_LIST_LOAD_MORE_BUTTON"))
            )
            load_more_button.click()
        except (NoSuchElementException, TimeoutException, ElementNotInteractableException):
            logging.info("더 이상 기사가 없습니다")
            break
        except ElementClickInterceptedException:
            WebDriverWait(driver, 2).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, ".section_more_inner._CONTENT_LIST_LOAD_MORE_BUTTON"))
            ).click()

def collect_and_save_news_data(driver, category, csv_filename):
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    results = soup.select(".sa_item_flex")

    data = []
    for article in results:
        try:
            url = article.select_one(".sa_text_title")['href']
            title = article.select_one(".sa_text_strong").text
            media = article.select_one(".sa_text_press").text
            thumbnail = article.select_one("._LAZY_LOADING._LAZY_LOADING_INIT_HIDE")['src'] if article.select_one("._LAZY_LOADING._LAZY_LOADING_INIT_HIDE") else None

            driver.get(url)
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "media_end_head_info_datestamp_time"))
            )
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "go_trans._article_content"))
            )
            
            article_html = driver.page_source
            article_soup = BeautifulSoup(article_html, "html.parser")
            
            date_element = article_soup.select_one(".media_end_head_info_datestamp_time._ARTICLE_DATE_TIME")
            date = date_element['data-date-time']
            
            article_content = article_soup.select_one(".go_trans._article_content")
            content = article_content.text.strip()

            data.append([category, url, title, media, thumbnail, date, content])

        except Exception as e:
            logging.error(f"Error fetching data for {url}: {e}")
            driver.save_screenshot('error_screenshot.png')  # 오류가 발생했을 때 스크린샷 찍기
            break  # 중간에 오류가 발생하면 데이터를 저장하고 중단

    # 데이터를 CSV 파일에 저장
    if data:
        save_to_csv(data, csv_filename)

def save_to_csv(data, csv_filename):
    # CSV 파일의 헤더 작성
    file_exists = os.path.isfile(csv_filename)
    with open(csv_filename, 'a', encoding='utf-8-sig', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['category', 'url', 'title', 'media', 'thumbnail', 'date', 'content'])
        writer.writerows(data)
        logging.info(f"데이터 저장 완료: {csv_filename}")

def main():
    setup_logging()
    current_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    driver = setup_webdriver()
    output_dir = './output'
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(6):
        logging.info("-------------------------------------------------------")
        logging.info(f"{current_time} : 정치 뉴스 데이터 수집 시작")
        try:
            category, category_filename = select_category(driver, i)
            load_all_articles(driver)
            csv_filename = f'{output_dir}/{current_time}_{category_filename}.csv'
            collect_and_save_news_data(driver, category, csv_filename)
        except WebDriverException as e:
            logging.error(f"Selenium WebDriver error in main loop for category {i}: {e}")
            driver.save_screenshot(f'error_category_{i}.png')  # 오류 발생 시 스크린샷 저장
        except Exception as e:
            logging.error(f"Error in main loop for category {i}: {e}")
    
    driver.quit()

if __name__ == "__main__":
    main()
