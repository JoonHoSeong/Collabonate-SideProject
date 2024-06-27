import pandas as pd
import glob
from konlpy.tag import Okt
from collections import Counter
import string

# 데이터 로드
files = glob.glob('Data/*.csv')  # 뉴스 데이터 파일 경로
news_data = pd.DataFrame()

# 모든 파일을 하나의 DataFrame으로 병합
for file in files:
    news_data = pd.concat([news_data, pd.read_csv(file)], axis=0)

# 뉴스 기사가 저장된 열 이름이 'content'라고 가정
try:
    news_texts = news_data['content']
except KeyError:
    print("Error: 'content' 열을 찾을 수 없습니다. 올바른 열 이름을 확인하세요.")
    exit()

# 형태소 분석기 초기화
okt = Okt()

# 불용어 목록 정의 (한국어)
stop_words = set(['있다', '하다', '되다', '것', '수', '등', '들', '그', 
                  '이', '저', '에서', '와', '과', '를', '으로', '하다', '에서',
                  '대통령','한국', '미국', '중국', '일본', '독일', '프랑스', '영국', '러시아', '캐나다', '호주'
                  ,'기자','뉴스','국가','정부','윤','방문','연합뉴스','아시아','회','중앙','서울'
                  ,'뉴시스','날','말','우리'])

# 전처리 함수 정의N
def preprocess_text(text):
    # 소문자 변환
    text = text.lower()
    # 구두점 제거 (따옴표 포함)
    text = text.translate(str.maketrans('', '', string.punctuation + "“”‘’\"'"))
    # 형태소 분석 및 명사 추출
    tokens = okt.nouns(text)
    # 불용어 제거
    tokens = [word for word in tokens if word not in stop_words]
    return tokens

# 모든 뉴스 기사 텍스트 전처리
all_tokens = []
for text in news_texts:
    tokens = preprocess_text(text)
    all_tokens.extend(tokens)

# 키워드 빈도 계산
counter = Counter(all_tokens)
common_keywords = counter.most_common(20)  # 상위 20개 키워드 추출

# 결과 출력
print("상위 20개 키워드:")
for keyword, freq in common_keywords:
    print(f"{keyword}: {freq}")

# 결과를 데이터프레임으로 저장 (선택 사항)
keywords_df = pd.DataFrame(common_keywords, columns=['keyword', 'frequency'])
keywords_df.to_csv('common_keywords.csv', index=False)

print("키워드 분석이 완료되었습니다.")
