# README #

This README would normally document whatever steps are necessary to get your application up and running.

### Conda Environment Setup

```
conda env create --file environment.yml -n aai-backend
```

### start database postgresql

There is a docker compose file and readme in the authenticateai repository under the postgresqql folder

```
git clone authenticateai
cd authenticateai
cd postgresql
mkdir data
docker volume create pga4volume
docker-compose -f docker-compose.yml up -d
```

### Access Admin Browser

http://localhost:8888/

Login with admin@postgresql.com with a password of secret

add server pgsql-server with credentials admin/secret

![pgadmin4](images/pgadmin.png)

### Create database 

create user with the following

    'NAME': 'aai-demo',
    'USER': 'demo',
    'PASSWORD': 'demo',

create database with the below name and make db owner demo
    aai-backend

### Setup new database and create default schema

python manage.py makemigrations
python manage.py migrate


### After creating the default schema, create the default superuser:

this can be any username password this is your super user to the database.

```
python manage.py createsuperuser
```

### Run server

python manage.py runserver 0.0.0.0:5100

## Navigate browser to
http://localhost:5000/
http://localhost:5000/admin

## Adding an application or changes to models

python manage.py makemigrations 
python manage.py migrate

## Update environment
conda deactivate
conda env remove --name aai-backend
conda env create --file environment.yml -n aai-backend
python manage.py migrate
