# Docker Setup Guide

This guide explains how to set up and run the SatoshiFund backend API and related services using Docker and Docker Compose. It includes image naming conventions, environment variables, seeding the database, and testing.

---

## Table of Contents

- [Prerequisites](#prerequisites)  
- [Docker Images and Tags](#docker-images-and-tags)  
- [Environment Variables](#environment-variables)  
- [Running the Containers](#running-the-containers)  
- [Database Seeding](#database-seeding)  
- [Running Tests](#running-tests)
- [Cleaning Up](#cleaning-up)  
- [Notes on Ports and Configuration](#notes-on-ports-and-configuration)  

---

## Prerequisites

- Install [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Ensure Docker daemon is running
- Familiarity with `.env` files to configure environment variables

>  This guide assumes Docker Compose v2 syntax (e.g., `docker compose` without a dash).


---

## Docker Images and Tags

This project uses multi-stage Dockerfiles to build separate images for development, production, seeding, and testing. Images are tagged following this convention:

| Image Name                          | Purpose           | Dockerfile Target |
|-----------------------------------|-------------------|-------------------|
| `btclendingbackend/api:1.0.0-dev` | Development API   | `development`     |
| `btclendingbackend/api:1.0.0-prod`| Production API    | `production`      |
| `btclendingbackend/seed:1.0.0-dev`| Seed database     | (default)         |
| `btclendingbackend/test:1.0.0-dev`| Run tests         | `development`     |

Images are built via Docker Compose using `build` with the appropriate target.

---

## Environment Variables

Configuration is managed via environment variables. The following variables are important:

| Variable      | Purpose                                                      | Example                             |
|---------------|--------------------------------------------------------------|-----------------------------------|
| `DATABASE_URL`| MongoDB connection string                                    | `mongodb://localhost:27017/btc-lending` |
| `PORT`        | Application listening port                                   | `3000`                            |
| `NODE_ENV`    | Environment mode (`development`, `production`, `test`)      | `development`                    |
| `JWT_SECRET`  | Secret key used for signing JWT tokens                       | `somesecretkey`                   |
| `DEV_PORT`    | Port used by development server                              | `3000`                           |
| `PROD_PORT`   | Port used by production server                               | `3001`                           |

The `DEV_PORT` and `PROD_PORT` variables are used to expose different ports for development and production environments respectively. These are defined in `.env` and referenced using `${DEV_PORT:-3000}` in `docker-compose.yml`.

---

### Setting up your `.env` file

To configure your environment variables, copy the example file `.env.example` and update the values as needed:

```bash
cp .env.example .env
```

---

## Running the Containers

Start all services, including MongoDB, API (dev or prod), seeding, and testing with

```bash
docker compose up --build
```

> If viewing the code on VSCode, it is highly recommended to install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in the Extension Tab of VSCode. If installed, you can right click on the `docker-compose.yml` file and click `Compose Up`. This will build and run all images/containers.

To run only the development API:

```bash
docker compose up --build api-dev
```

To run only the production API:

```bash
docker compose up --build api-prod
```

---

## Database Seeding

To seed the database with initial data, run the seed service:

```bash
docker compose run seed
```

This executes the seed script inside a container, populating test users, cryptocurrencies, interest terms, and loan requests

---

## Running Tests

Tests are run inside a container using the test image and test data that get's populated and then deleted as the tests run.


```bash
docker compose run test
```

> If everything is working and setup correctly, there should be 49 passed tests.

---

## Cleaning Up

To stop all containers and remove them (along with associated volumes):

```bash
docker compose down -v
```

---

## Notes on Ports and Configuration

* By default, the development API maps to port 3000 on your host machine
* The production API is mapped to port 3001 to avoid conflicts
* Ports can be customsed via environment variables in .env or your shell
* MongoDB listens on port 27017

Example ports configuration in docker-compose.yml:

```yaml
ports:
    - "${DEV_PORT:-3000}:3000"
```

---

If you have any questions or run into issues, please check the project's README or reach out on the project repository.
