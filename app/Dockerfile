FROM python:3.8.0-alpine

WORKDIR /src/app

RUN mkdir /src/app/assets

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev linux-headers

COPY ./requirements.txt /src/app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY ./entrypoint.sh /src/app/entrypoint.sh
COPY . /src/app

ENTRYPOINT ["/src/app/entrypoint.sh"]