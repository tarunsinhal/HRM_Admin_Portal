FROM python:3.8

WORKDIR /code

COPY  requirements.txt .

RUN pip install -r requirements.txt

COPY . /code/

COPY ./entrypoint.sh /code/entrypoint.sh

ENTRYPOINT [ "sh", "/code/entrypoint.sh" ]