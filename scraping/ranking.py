import os
import logging
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import pandas as pd
from datetime import datetime
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
import csv

# 로그 설정
logging.basicConfig(
    level=logging.INFO,  # 로그 레벨 설정
    format='%(asctime)s - %(levelname)s - %(message)s',  # 로그 포맷 설정
    handlers=[
        logging.StreamHandler()  # 콘솔 출력 핸들러 설정
    ]
)

def configure_driver(url):
    # 사용자 에이전트 설정
    user_agent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

    # Chrome 옵션 설정 (Headless 모드)
    options = Options()
    options.add_argument(f"user-agent={user_agent}")
    options.add_argument("--headless")  # Headless 모드 설정
    options.add_argument("--disable-gpu")  # GPU 사용 안함
    options.add_argument("--disable-dev-shm-usage")  # /dev/shm 사용 안함
    options.add_argument("--no-sandbox")  # Sandbox 모드 사용 안함
    options.add_experimental_option("detach", True)
    options.add_experimental_option("excludeSwitches", ["enable-automation"])

    # Chrome 드라이버 설정
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    # URL 접속
    driver.get(url)

    # 페이지가 로드될 때까지 대기
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".rankingnews_box")))

    logging.info("페이지가 성공적으로 로드되었습니다.")

    return driver

def extract_news_rankings(driver, csv_filename):
    # WebDriverWait를 사용하여 페이지가 로드될 때까지 대기
    wait = WebDriverWait(driver, 10)
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".rankingnews_box")))

    # BeautifulSoup으로 페이지 파싱
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    # 랭킹 정보 추출
    results = soup.select(".rankingnews_box")

    data = []
    for ranking_box in results:
        try:
            # 언론사 이름 추출
            media_name = ranking_box.select_one(".rankingnews_name").text

            # 기사 랭킹 추출
            rankings = ranking_box.select(".list_content a.list_title")
            article_titles = [ranking.text for ranking in rankings]

            # 기사 랭킹을 각 리스트에 추가 (최대 5개)
            ranking_1 = (article_titles[0] if len(article_titles) >= 1 else None)
            ranking_2 = (article_titles[1] if len(article_titles) >= 2 else None)
            ranking_3 = (article_titles[2] if len(article_titles) >= 3 else None)
            ranking_4 = (article_titles[3] if len(article_titles) >= 4 else None)
            ranking_5 = (article_titles[4] if len(article_titles) >= 5 else None)

            data.append([media_name, ranking_1, ranking_2, ranking_3, ranking_4, ranking_5])

        except Exception as e:
            logging.error(f"Error fetching data for {ranking_box}: {e}")
            break  # 중간에 오류가 발생하면 데이터를 저장하고 중단

    # 데이터를 CSV 파일에 저장
    if data:
        save_to_csv(data, csv_filename)
    return data

def save_to_csv(data, csv_filename):
    # CSV 파일의 헤더 작성
    file_exists = os.path.isfile(csv_filename)
    with open(csv_filename, 'a', encoding='utf-8-sig', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['media_name', 'ranking_1', 'ranking_2', 'ranking_3', 'ranking_4', 'ranking_5'])
        writer.writerows(data)
        logging.info(f"데이터 저장 완료: {csv_filename}")


def main():
    # 크롤링할 URL
    url = "https://news.naver.com/main/ranking/popularDay.naver"

    # 드라이버 설정 및 URL 접속
    driver = configure_driver(url)
    
    current_time = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    output_dir = './output'
    os.makedirs(output_dir, exist_ok=True)
    
    logging.info(f"{current_time} : 랭킹 뉴스 데이터 수집 시작")

    try:
        csv_filename = f'{output_dir}/{current_time}_랭킹.csv'
        collected_data = extract_news_rankings(driver, csv_filename)
        if not collected_data:
            logging.warning(f"No data collected, skipping to next media.")
            
    except Exception as e:
        logging.error(f"크롤링 중 오류 발생: {e}")

    finally:
        # 드라이버 종료
        driver.quit()
        

if __name__ == "__main__":
    main()
