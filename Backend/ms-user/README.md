# ms-user - Grupo Cordillera

Microservicio de usuarios. Administra la base de datos de usuarios y expone operaciones para crear, listar, buscar y autenticar credenciales.

## Como funciona

```text
BFF /api/users/*
  -> ms-user
    -> user_db PostgreSQL

ms-auth
  -> ms-user /authenticate
```

`ms-user` es el servicio propietario de los datos de usuarios. Otros servicios no acceden directamente a su base de datos.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | Java 25 |
| Framework | Spring Boot 4 |
| Librerias | Spring Web, Spring Data JPA, Flyway, PostgreSQL Driver, Springdoc OpenAPI, JUnit, JaCoCo |
| Paquete base | `com.grupocordillera.userservice` |
| Patrones | Layered Architecture, Repository, DTO, Global Exception Handler |
| Base de datos | PostgreSQL `user_db` |
| Swagger | `http://localhost:9082/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9082/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9082/api/users/health` | `http://localhost:8000/api/users/health` |
| Swagger | `http://localhost:9082/swagger-ui/index.html` | No aplica |
| Users | `http://localhost:9082/api/users` | `http://localhost:8000/api/users` |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5435/user_db` |
| `SPRING_DATASOURCE_USERNAME` | `user_user` |
| `SPRING_DATASOURCE_PASSWORD` | `user_pass` |

## Como ejecutar

Desde la raiz:

```bash
docker compose up --build user-db user-service
```

Local directo:

```bash
cd backend/ms-user
mvn spring-boot:run
```

## Swagger

Abrir:

```text
http://localhost:9082/swagger-ui/index.html
```

## Endpoints y ejemplos

### Health check

```bash
curl http://localhost:9082/api/users/health
```

### Crear usuario

```bash
curl -X POST http://localhost:9082/api/users \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demouser\",\"email\":\"demo.user@cordillera.cl\",\"password\":\"1234\",\"firstName\":\"Demo\",\"lastName\":\"User\",\"role\":\"Vendedor\"}"
```

### Listar usuarios

```bash
curl http://localhost:9082/api/users
```

### Buscar usuario por username

```bash
curl http://localhost:9082/api/users/demouser
```

### Autenticar usuario

```bash
curl -X POST http://localhost:9082/api/users/authenticate \
  -H "Content-Type: application/json" \
  -d "{\"login\":\"demouser\",\"password\":\"1234\"}"
```

Respuesta esperada:

```json
{
  "username": "demouser",
  "email": "demo.user@cordillera.cl",
  "role": "Vendedor"
}
```

## Tests y cobertura

```bash
cd backend/ms-user
mvn verify
```

JaCoCo valida minimo 60% de cobertura de lineas.
