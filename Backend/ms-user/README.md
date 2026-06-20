# ms-user

Microservice responsible for user management. It owns `user_db` and exposes creation, lookup, listing, and authentication endpoints.

## Run Locally

```powershell
docker compose up --build user-db user-service
```

## Technical Table

| Item | Value |
|---|---|
| Language | Java 25 |
| Framework | Spring Boot 4 |
| Libraries | Spring Web MVC, Spring Data JPA, Flyway, PostgreSQL JDBC, Springdoc OpenAPI, JaCoCo |
| Database pattern | Database per Service |
| Database | PostgreSQL `user_db` |
| Design patterns | Layered architecture, Repository, DTO |

## Swagger and OpenAPI

With Docker Compose running, Swagger UI is available at:

```text
http://localhost:9082/swagger-ui/index.html
```

The OpenAPI JSON specification can be validated with:

```powershell
Invoke-WebRequest http://localhost:9082/v3/api-docs -UseBasicParsing
```

Quick endpoint checks:

```powershell
Invoke-RestMethod http://localhost:9082/api/users
```

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:9082/api/users/authenticate" `
  -ContentType "application/json" `
  -Body '{"login":"gerente","password":"1234"}'
```

## Swagger Test Examples

Open `http://localhost:9082/swagger-ui/index.html`, press **Try it out**, fill the required values, and press **Execute**.

| Method | Endpoint | How to test |
|---|---|---|
| GET | `/api/users/health` | Execute without parameters. Expected response: `200 OK`. |
| GET | `/api/users` | Execute without parameters to list users. |
| GET | `/api/users/{username}` | Use `gerente` or a username created with `POST /api/users`. |
| POST | `/api/users` | Use the create-user JSON below. Expected response: `201 Created`. |
| POST | `/api/users/authenticate` | Use the authentication JSON below. Expected response: `200 OK`. |

Body for `POST /api/users`:

```json
{
  "username": "swaggeruser",
  "email": "swagger.user@cordillera.cl",
  "password": "1234",
  "firstName": "Swagger",
  "lastName": "User",
  "role": "Vendedor"
}
```

Body for `POST /api/users/authenticate`:

```json
{
  "login": "gerente",
  "password": "1234"
}
```

`ms-user` does not currently expose `PUT` endpoints. User updates would require implementing an update endpoint first.
