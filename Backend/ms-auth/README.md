# ms-auth - Grupo Cordillera

Microservicio de autenticacion. Recibe login y registro desde el BFF, delega la gestion de usuarios a `ms-user` y emite tokens JWT firmados con RS256.

## Como funciona

```text
Frontend
  -> BFF /api/auth/*
    -> ms-auth
      -> ms-user
```

`ms-auth` es responsable de autenticar y emitir token. La persistencia de usuarios vive en `ms-user`, por lo que `ms-auth` consume ese servicio por HTTP interno.

## Tabla tecnica

| Item | Detalle |
|---|---|
| Lenguaje | Java 25 |
| Framework | Spring Boot 4 |
| Librerias | Spring Web, Nimbus JOSE JWT, Springdoc OpenAPI, JUnit, JaCoCo |
| Paquete base | `com.grupocordillera.authservice` |
| Patrones | Layered Architecture, REST Controller, Service, HTTP Client Adapter, Global Exception Handler |
| Base de datos | No tiene base propia; delega usuarios a `ms-user` |
| Swagger | `http://localhost:9080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9080/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9080/api/auth/health` | `http://localhost:8000/api/auth/health` |
| Swagger | `http://localhost:9080/swagger-ui/index.html` | No aplica |
| Login | `http://localhost:9080/api/auth/login` | `http://localhost:8000/api/auth/login` |
| Register | `http://localhost:9080/api/auth/register` | `http://localhost:8000/api/auth/register` |

## Variables de entorno

| Variable | Valor por defecto |
|---|---|
| `USER_SERVICE_URL` | `http://localhost:8082/api/users` |

## Como ejecutar

Desde la raiz:

```bash
docker compose up --build auth-service
```

Local directo:

```bash
cd backend/ms-auth
mvn spring-boot:run
```

## Swagger

Abrir:

```text
http://localhost:9080/swagger-ui/index.html
```

Desde Swagger se pueden probar `health`, `login`, `register`, `users/me`, `users` y `public-key`.

## Endpoints y ejemplos

### Health check

```bash
curl http://localhost:9080/api/auth/health
```

Respuesta esperada:

```json
{
  "status": "UP",
  "service": "auth-service"
}
```

### Registrar usuario

```bash
curl -X POST http://localhost:9080/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo.auth@cordillera.cl\",\"username\":\"demoauth\",\"password\":\"1234\",\"firstName\":\"Demo\",\"lastName\":\"Auth\",\"role\":\"Vendedor\"}"
```

Respuesta esperada:

```json
{
  "message": "Usuario registrado correctamente",
  "email": "demo.auth@cordillera.cl",
  "username": "demoauth",
  "role": "Vendedor"
}
```

### Login

```bash
curl -X POST http://localhost:9080/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demoauth\",\"password\":\"1234\"}"
```

Respuesta esperada:

```json
{
  "message": "Autenticacion exitosa",
  "username": "demoauth",
  "email": "demo.auth@cordillera.cl",
  "role": "Vendedor",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "accessToken": "..."
}
```

### Obtener llave publica JWT

```bash
curl http://localhost:9080/api/auth/public-key
```

### Listar usuarios

```bash
curl http://localhost:9080/api/auth/users
```

## Tests y cobertura

```bash
cd backend/ms-auth
mvn verify
```

JaCoCo valida minimo 60% de cobertura de lineas.
