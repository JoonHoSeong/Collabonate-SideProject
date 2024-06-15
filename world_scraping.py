from playwright.sync_api import sync_playwright
from datetime import datetime

with sync_playwright() as playwright:
        
        #launch a browser with headless to see what's going on with 500 slow_mode
        browser = playwright.chromium.launch(headless=False, slow_mo=500)
        
        #create a new page
        page = browser.new_page()

        #daily
        today = datetime.now().strftime('%Y%m%d')
    
        #created dictionary which is named "categories" for each categories of world news
        categories = {
            "aisa_and_austrailia" : page.goto(f'https://news.naver.com/breakingnews/section/104/231?date={today}'),
            'usa_and_sa' : page.goto(f'https://news.naver.com/breakingnews/section/104/232?date={today}'),
            "europe" : page.goto(f'https://news.naver.com/breakingnews/section/104/233?date={today}'),
            "africa" : page.goto(f'https://news.naver.com/breakingnews/section/104/234?date={today}'),
            "worldwide" : page.goto(f'https://news.naver.com/breakingnews/section/104/322?date={today}')}

        
        #get all the titles for today's news with using for loop
        for title in categories.values():
            findout = page.locator("a.sa_text_title").all_inner_texts()
            print(findout)
            
            # for _ in each_category:
            #     await page.locator("a.sa_text_title")
                # for _ in test:
                #     title = page.locator("h2.title_area").all_inner_texts()
    
        # print(title)

        # print("LINK:",page.url)


        # print("LINK:",page.url)


        


        #locate a link element with " "text
        



