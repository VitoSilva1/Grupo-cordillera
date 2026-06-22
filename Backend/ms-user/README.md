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
| Framework | Spring Boot 4.0.6 |
| Librerias | Spring Web, Spring Data JPA, Flyway, PostgreSQL Driver, Springdoc OpenAPI 2.8.9, JUnit, JaCoCo 0.8.13 |
| Paquete base | `com.grupocordillera.userservice` |
| Patrones | Layered Architecture, Repository, DTO, Global Exception Handler |
| Base de datos | PostgreSQL `user_db` |
| Swagger | `http://localhost:9082/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9082/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9082/api/users/health` | No expuesto por BFF/Gateway en el escenario actual |
| Swagger | `http://localhost:9082/swagger-ui/index.html` | No aplica |
| Crear usuario | `http://localhost:9082/api/users` | `http://localhost:8000/api/users` |
| Listar/buscar/autenticar | `http://localhost:9082/api/users...` | No expuesto por BFF/Gateway en el escenario actual |

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

### Pruebas en Swagger

| Endpoint | Metodo | Como probar | Resultado esperado |
|---|---|---|---|
| `/api/users/health` | `GET` | Click en `Try it out` y `Execute` | `{"status":"UP","service":"user-service"}` |
| `/api/users` | `POST` | Body con `username`, `email`, `password`, `firstName`, `lastName`, `role` | Usuario creado con status `201` |
| `/api/users` | `GET` | Ejecutar sin body | Lista de usuarios persistidos |
| `/api/users/authenticate` | `POST` | Body: `{"login":"vendedor","password":"1234"}` | Usuario autenticado o `401` si falla |
| `/api/users/{username}` | `GET` | Parametro `username`, por ejemplo `vendedor` | Usuario encontrado o `404` |

En el escenario actual del frontend, solo `POST /api/users` se expone por KrakenD. `GET /api/users`, `/authenticate` y `/{username}` quedan como endpoints directos/internos del microservicio.

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
