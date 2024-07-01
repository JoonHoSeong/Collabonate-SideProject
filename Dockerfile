#  Python 3.11이 설치된 Alpine Linux 3.19
# Alpine Linux는 경량화된 리눅스 배포판으로, 컨테이너 환경에 적합
FROM python:3.11

# LABEL 명령어는 이미지에 메타데이터를 추가합니다. 여기서는 이미지의 유지 관리자를 "joonhoseong"로 지정하고 있습니다.
LABEL maintainer="joonhoseong"

# 환경 변수 PYTHONUNBUFFERED를 1로 설정합니다. 
# 이는 Python이 표준 입출력 버퍼링을 비활성화하게 하여, 로그가 즉시 콘솔에 출력되게 합니다. 
# 이는 Docker 컨테이너에서 로그를 더 쉽게 볼 수 있게 합니다.
ENV PYTHONUNBUFFERED 1

# 로컬 파일 시스템의 requirements.txt 파일을 컨테이너의 /tmp/requirements.txt로 복사합니다. 
# 이 파일은 필요한 Python 패키지들을 명시합니다.
COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./keywordnews /app

WORKDIR /app
EXPOSE 8000

ARG DEV=false

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    # apk add --update --no-cache postgresql-client jpeg-dev && \
    # apk add --update --no-cache --virtual .tmp-build-deps \
    #     build-base postgresql-dev musl-dev zlib zlib-dev linux-headers && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
        then /py/bin/pip install -r /tmp/requirements.dev.txt ; \
    fi && \
    rm -rf /tmp && \ 
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

# Playwright 설치
RUN /py/bin/python -m pip install playwright

# /tmp 디렉토리 생성 및 권한 설정
RUN mkdir -p /tmp && chmod 1777 /tmp

# Playwright 브라우저 다운로드
RUN mkdir -p /home/django-user/.cache/ms-playwright && \
    PLAYWRIGHT_BROWSERS_PATH=/home/django-user/.cache/ms-playwright /py/bin/python -m playwright install

# 환경 변수 설정
ENV PATH="/py/bin:$PATH"

# /var/tmp 디렉토리 생성 및 권한 설정
RUN mkdir -p /var/tmp && chmod 1777 /var/tmp

# 필요한 추가 패키지 설치
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libgbm1 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libasound2 \
    libxrandr2 \
    libgtk-3-0 \
    libxshmfence1


CMD ["python","/app/scrapping_code.py"]

USER django-user