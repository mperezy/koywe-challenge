# koywe-challenge

## Getting started with DB (PostgreSQL)

- The DB will be running in a Docker container.

### Running DB

- The DB container is configured using Docker Compose, so to start it just run:

```shell
$ docker-compose up # Docker compose V1
$ docker compose up # Docker compose V2
```

### Creating DB schema and required tables

- The SQL script for create the DB schema and the tables is defined in the file [db/scripts/quotes-db.sql](../db/scripts/quotes-db.sql).
- By using a shell script just run the next and the database will be initialized:

```shell
./init-db.sh
Docker is not running # In case the Docker's daemon is not running
The container "koywe-challenge-psql" not exists # In case the db container is not created yet
The container "koywe-challenge-psql" is not running # In case the db container exists but it is not running

```

### To visually see the tables data

- I use Jetbrains DataGrip IDE to connect to the Postgres container and see the data on the DB `quotes-db`.

## Prisma ORM

- To make DB operations such as list, update, create or delete Prisma ORM has been configured and connected
to db container.

### Connect Prisma ORM to DB

- In the dotenv file, you I need to set the next:

```dotenv
DB_URL="postgresql://admin:admin1234@localhost:5432/quotes_db?schema=quotes_db"
```

- To get DB definition into Prisma schema, just need to run:

```shell
$ yarn prisma:db:pull
```

- Then, types from Prisma to use our DB I need to generate the files by running:

```shell
$ yarn prisma:db:generate
```

- The generate files and types can be found at [src/prisma-orm/generated](src/prisma-orm/generated).
