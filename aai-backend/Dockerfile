FROM python:3.6-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install -y git-core ffmpeg libsm6 libxext6 

RUN pip3 install django
RUN pip3 install djangorestframework
RUN pip3 install django-cors-headers
RUN pip3 install django-rest-knox
RUN pip3 install simplejson

RUN mkdir /opt/aai-backend

WORKDIR /opt/aai-backend

COPY . ./
COPY manage.py ./

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]