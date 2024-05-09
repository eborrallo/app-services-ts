# Services in typescript

<p align="center">
<img src="https://www.g-talent.net/cdn/shop/articles/que-es-typescript-1658755532025_47a3ff42-50f3-4968-a9ed-6cca8e24185a.jpg?v=1675279891" align="center"
alt="typescript-logo"></p>

> ⚠️ IMPORTANT NOTE:
>The main goal of this project is how to implement differents services in typescript in a single repo (Monolit)
but with a clear structure and a good practices to split it in microservices if was necessary . Some of the services are not allready finallized, because in a real project the implementation part
will change to much and the idea is to do anlly the common part here but the main idea is to show how to implement it.

The alrchitecture choosed and implemented here was DDD  (Domain Driven Design) with a CQRS pattern (Command Query Responsibility Segregation) and Event Sourcing.
If you know DDD the schafolding of the project will be very familiar to you. If not i will recommend you to read about it
before to continue with this project.

Quick list of the stack used in this project:

Typescript, NodeJs, Express, RabbitMq, MongoDB, TypeOrm, Grpc, Docker, Jest,Ethers, Web3, Alchemy, Firebase, AWS S3, Axios, ElasticSearch, Puppeteer, Kibana.
***

## What services we have here?

- **Auth Service**: This service is responsible to manage the users and the authentication process it can manage FIREBASE auth and also Web3 signature auth
- **Notifier Service**: This service is responsible to manage the notifications to the users or other service that want to notifiy something, it can send emails, sms, push notifications, etc. It is listening with a rabbitMq queue
- **Printer Service**: This service is responsible to print documents on PDF , editing the template you can print what ever you want . It is listening with a rabbitMq queue and also has one endpoint to test it.
- **Storage Service**: This service is responsible to store files in a cloud storage, it can store files in all the providers compatible with S3. It is listening with a rabbitMq queue and also has one endpoint to test it.
***
## Auth Service
This main porpouse of this service is had all the users and the authentication process it can manage FIREBASE auth and also Web3 signature auth it has integrated with
the API of ALCHEMY and FIREBASE , also has a DomainEvent to notify the other services when a user is created.All the persistence is done with a MongoDB(NoSql) and TypeOrm(SQL)  database.
We have the following endpoints using REST API:
- [GET] /auth/:address/message : This endpoint is to sign a message with the user address and return a token to use in the other endpoints
- [POST] /auth/:address/validate : This endpoint is to validate the token generated in the previous endpoint
- [POST] /oauth/validate : This endpoint is to validate the token generated in the previous endpoint FIREBASE

Run:
```typescript
npm run start:auth:api
```
Grpc services:
 TODO
***
## Notifier Service
The main porpouse of this service is to notify the users or other services when something happens, it can send emails, sms, push notifications, etc. It is listening with a rabbitMq queue and also has one endpoint to test it.
We have not endpoints for this , instead we have some worker process to listen the queue and send the notifications.:

Run:
```typescript
npm run start:notifier:monitor
```

***
## Printer Service
The main porpouse of this service is to print documents on PDF , editing the template you can print what ever you want .
It is listening with a rabbitMq queue and also has one endpoint to test it.

We have the following endpoints using REST API:
- [POST] /doc/create : This endpoint is to create a document with a template and some data
Run:
```typescript
npm run start:printer:api
```
***
## Storage Service
The main porpouse of this service is to store files in a cloud storage, it can store files in all the providers compatible with S3.
It is listening with a rabbitMq queue and also has one endpoint using REST API:
- [POST] /storage/upload : This endpoint is to upload a file to the cloud storage
- [GET] /storage/retrieve/:id : This endpoint is to download a file from the cloud storage

Run:
```typescript
npm run start:storage:api
```
***

## Todo

- [x] Auth Service
  - [x] Alchemy web3 signature
  - [x] Firebase auth
  - [x] Firebase middleware
  - [x] RabbitMq domain event on user created
  - [x] TypeOrm integration
  - [x] MongoDB integration
  - [ ] Grpc API
  - [x] REST API
  - [x] Tests
- [ ] Notifier Service
  - [x] RabbitMq worker
  - [x] REST API
  - [x] Tests
  - [ ] Email notification
  - [ ] Slack notification
- [x] Printer Service
  - [x] RabbitMq worker
  - [x] Integrated with puppeteer
  - [x] REST API
  - [x] Tests
  - [x] Template engine
- [x] Storage Service
  - [x] RabbitMq worker
  - [x] AWS S3 integration
  - [x] REST API
  - [x] Tests
***

## Docker
All the project is dockerized , in the Dockerfile you can see the configuration of each service and also in the docker-compose.yml file

you can run the following command to start all the services:
```typescript
docker-compose up
```

## Tests
All the services have tests implemented with Jest and dockerTest, you can run the following command to run the tests:
```typescript
npm run test
```
