# Pet2Home - C22-PS110 (Cloud Computing) Capstone Project Bangkit 2022

## Capstone Project Team
- Adam Aristama (M2211F1958) 
- Devany Putri Mirasati (M7211F1957) 
- Dinda Fathihah Sari (C7211F1960) 
- Dimas Bayu Anjasmara (C7266F2290)
- Ferdian Arjutama Narwan (A2183G1774) 
- Indra Purnomo Aji (A7299F2590) 

## General Information

Pet2Home is an application intended to raise awareness of abandoned animals, especially cats and dogs, and also to help potential adopters to find their pets. Aside from adopting animals, users also can use a Pet2Lens feature that can make it easier to find out the breeds of dogs or cats they found. This project expects to help improve the welfare of abandoned animals and reduce the level of animal violence to illegal trade in animals, especially dogs and cats.


This app is able to identify 5 breed of dog and 5 breed of cat and determine its quality with a Machine Learning model. And then it will insert the data into a database, which will save all the breed info which is saved into it. Currently the classifications are limited to:

## Tech used ##
Project is created with:
* Node version: v12.22.9
* NPM version: V8.5.1
* Google Cloud SQL: MySQL 8.0

# Cloud Computing Architecture for this app
![Backend Arch drawio](https://user-images.githubusercontent.com/22671679/173237870-d6c0778d-9820-4d5d-b003-e6da30d714c7.png)


## Steps Deploy To GCP 
> Create Google Cloud SQL (MySQL)
  1. Create and Setup your Cloud Sql Instance
  2. Choose MySQL as your Database Engine
  3. Choose MySQL version 8.0 
  4. Import pet2home.sql to Cloud Sql

# Deploy to Google Compute Engine
1. Create Compute Engine instance and connect to instances via ssh
2. Clone this repo ```git clone https://github.com/dindafathihah/cc-pet2home.git```
3. Configure Database
- Rename .env.example to .env
- Adjust configuration with your database config "our apps is using MySQL" : 

```DB_HOST=<CONFIG_DB_LOCALHOST>
DB_USER=<CONFIG_DB_USER>
DB_PASS=<CONFIG_DB_PASSWORD>
DB_NAME=<CONFIG_DB_NAME>
PORT=<CONFIG_PORT>
TOKEN_KEY=<CONFIG_TOKEN_KEY>```


> 4. Configure Node_Modules
install the dependencies in node_modules folder

```npm install```
> 5. Run Node Server 
```npm run start```


