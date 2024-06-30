#  Python 3.11이 설치된 Alpine Linux 3.19
# Alpine Linux는 경량화된 리눅스 배포판으로, 컨테이너 환경에 적합
FROM python:3.11-alpine3.19

# LABEL 명령어는 이미지에 메타데이터를 추가합니다. 여기서는 이미지의 유지 관리자를 "joonhoseong"로 지정하고 있습니다.
LABEL maintainer="joonhoseong"

# 환경 변수 PYTHONUNBUFFERED를 1로 설정합니다. 
# 이는 Python이 표준 입출력 버퍼링을 비활성화하게 하여, 로그가 즉시 콘솔에 출력되게 합니다. 
# 이는 Docker 컨테이너에서 로그를 더 쉽게 볼 수 있게 합니다.
ENV PYTHONUNBUFFERED 1

# 필수 패키지 설치
RUN apk update && apk add --no-cache \
    postgresql-client \
    jpeg-dev \
    zlib-dev \
    linux-headers \
    build-base \
    postgresql-dev \
    musl-dev

# Node.js 및 npm 설치
RUN apk add --no-cache nodejs npm

# npm을 사용하여 Playwright 설치
RUN npm install -g playwright

# 로컬 파일 시스템의 requirements.txt 파일을 컨테이너의 /tmp/requirements.txt로 복사합니다. 
# 이 파일은 필요한 Python 패키지들을 명시합니다.
COPY ./requirements.txt /tmp/requirements.txt
COPY ./requirements.dev.txt /tmp/requirements.dev.txt
COPY ./keywordnews /app
COPY scrapping_code.py /app/scrapping_code.py

WORKDIR /app
EXPOSE 8000

ARG DEV=false


RUN python -m venv /py && \ 
    /py/bin/pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client jpeg-dev && \
    apk add --update --no-cache --virtual .tmp-build-deps \
        build-base postgresql-dev musl-dev zlib zlib-dev linux-headers && \
    /py/bin/pip install -r /tmp/requirements.txt && \
    if [ $DEV = "true" ]; \
        then /py/bin/pip install -r /tmp/requirements.dev.txt ; \
    fi && \
    rm -rf /tmp && \
    apk del .tmp-build-deps && \
    adduser \
        --disabled-password \
        --no-create-home \
        django-user

ENV PATH="/py/bin:$PATH"

# 애플리케이션 실행 명령어
CMD ["python", "scrapping_code.py"]

USER django-user