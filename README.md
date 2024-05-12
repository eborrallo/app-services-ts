# TypeScript Services Implementation

<p align="center">
    <img src="https://www.g-talent.net/cdn/shop/articles/que-es-typescript-1658755532025_47a3ff42-50f3-4968-a9ed-6cca8e24185a.jpg?v=1675279891" align="center" alt="typescript-logo">
</p>

> ⚠️ **IMPORTANT NOTE:**
> The main goal of this project is to demonstrate the implementation of different services in TypeScript within a single repository (Monolith), focusing on clear structure and good practices to facilitate potential splitting into Microservices. Some services may not be finalized as real-world implementations may vary significantly. However, the primary aim is to showcase implementation approaches.

The architecture chosen and implemented here follows Domain Driven Design (DDD) with a CQRS pattern (Command Query Responsibility Segregation) and Event Sourcing. Familiarity with DDD is beneficial for understanding the project structure. If unfamiliar, it's recommended to explore DDD before proceeding.

Quick overview of the technology stack used:

- TypeScript
- Node.js
- Express
- RabbitMQ
- MongoDB
- TypeORM
- gRPC
- Docker
- Jest
- Ethers
- Web3
- Alchemy
- Firebase
- AWS S3
- Axios
- ElasticSearch
- Puppeteer
- Kibana

***

## Services Overview

- **Auth Service**: Manages user authentication, supporting FIREBASE and Web3 signature authentication.
- **Notifier Service**: Handles notifications to users or other services via various channels like email, SMS, and push notifications.
- **Printer Service**: Prints documents in PDF format based on provided templates.
- **Storage Service**: Stores files in a cloud storage, compatible with S3 providers.

***

## Auth Service

The Auth Service's primary purpose is user management and authentication, supporting FIREBASE and Web3 signature authentication. It integrates with ALCHEMY and FIREBASE APIs and emits Domain Events for user creation. Persistence is managed using MongoDB (NoSQL) and TypeORM (SQL) databases. REST API endpoints include:

- [GET] `/auth/:address/message`: Signs a message with the user address and returns a token for subsequent endpoints.
- [POST] `/auth/:address/validate`: Validates the token generated in the previous endpoint.
- [POST] `/oauth/validate`: Validates the token generated in the previous endpoint using FIREBASE.

Run:
```bash
npm run start:auth:api
```
Grpc services:
 TODO
***
## Notifier Service
The Notifier Service notifies users or other services of relevant events through various channels. It listens to a RabbitMQ queue and includes worker processes for sending notifications.

No direct REST API endpoints are available. Instead, worker processes listen to the queue for sending notifications.

Run:
```bash
npm run start:notifier:monitor
```

***
## Printer Service
The Printer Service generates PDF documents based on provided templates. It listens to a RabbitMQ queue and includes a REST API endpoint for testing.

We have the following endpoints using REST API:
- [POST] /doc/create : This endpoint is to create a document with a template and some data
Run:
```bash
npm run start:printer:api
```
***
## Storage Service
The Storage Service stores files in a cloud storage, compatible with S3 providers. It listens to a RabbitMQ queue and includes REST API endpoints for file management.

REST API endpoints:

- [POST] /storage/upload : This endpoint is to upload a file to the cloud storage
- [GET] /storage/retrieve/:id : This endpoint is to download a file from the cloud storage

Run:
```bash
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
```bash
docker-compose up
```

## Tests
All the services have tests implemented with Jest and dockerTest, you can run the following command to run the tests:
```bash
npm run test
```
