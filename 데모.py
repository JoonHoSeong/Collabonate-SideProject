from playwright.sync_api import sync_playwright
from datetime import datetime
import csv

def save_to_txt(filename, data):
    with open(filename, 'w', encoding='utf-8') as file:
        for item in data:
            file.write(f"Title: {item['title']}\n")
            file.write(f"URL: {item['url']}\n")
            file.write(f"Press: {item['press']}\n")
            file.write(f"Date: {item['date']}\n")
            file.write(f"Category: {item['category']}\n")
            file.write(f"Thumbnail: {item.get('thumbnail', 'N/A')}\n")
            file.write("\n")

def save_to_csv(filename, data):
    with open(filename, 'w', newline='', encoding='utf-8') as file:
        writer = csv.DictWriter(file, fieldnames=["title", "url", "press", "date", "category", "thumbnail"])
        writer.writeheader()
        for item in data:
            writer.writerow(item)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=False, slow_mo=500)
    page = browser.new_page()

    today = datetime.now().strftime('%Y%m%d')
    print("Today's date:", today)

    categories = {
        "aisa_and_austrailia" : f'https://news.naver.com/breakingnews/section/104/231?date={today}',
        'usa_and_sa' : f'https://news.naver.com/breakingnews/section/104/232?date={today}',
        "europe" : f'https://news.naver.com/breakingnews/section/104/233?date={today}',
        "africa" : f'https://news.naver.com/breakingnews/section/104/234?date={today}',
        "worldwide" : f'https://news.naver.com/breakingnews/section/104/322?date={today}'
    }

    all_articles = []

    for category, url in categories.items():
        print(f"Visiting news page: {url}")
        page.goto(url)
        
        titles = page.locator("a.sa_text_title").all_inner_texts()
        for i, title in enumerate(titles):
            article_url = page.locator("a.sa_text_title").nth(i).get_attribute('href')

            # Open each article link to extract more information
            page.goto(article_url)

            press_element = page.locator('.press_logo img')
            press = press_element.get_attribute('alt') if press_element else 'N/A'

            date_element = page.locator('.article_date')
            article_date = date_element.text_content().strip() if date_element else today

            thumbnail_element = page.locator('.article_photo img')
            thumbnail = thumbnail_element.get_attribute('src') if thumbnail_element else 'N/A'

            all_articles.append({
                "title": title,
                "url": article_url,
                "press": press,
                "date": article_date,
                "category": category,
                "thumbnail": thumbnail
            })

    # Save articles to txt and csv files
    save_to_txt("articles.txt", all_articles)
    save_to_csv("articles.csv", all_articles)

    browser.close()
