# ms-auth - Grupo Cordillera

Microservicio de autenticacion. Recibe login desde el BFF, conserva registro directo para pruebas/integracion, delega la gestion de usuarios a `ms-user` y emite tokens JWT firmados con RS256.

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
| Framework | Spring Boot 4.0.6 |
| Librerias | Spring Web, Nimbus JOSE JWT 10.5, Springdoc OpenAPI 2.8.9, JUnit, JaCoCo 0.8.13 |
| Paquete base | `com.grupocordillera.authservice` |
| Patrones | Layered Architecture, REST Controller, Service, HTTP Client Adapter, Global Exception Handler |
| Base de datos | No tiene base propia; delega usuarios a `ms-user` |
| Swagger | `http://localhost:9080/swagger-ui/index.html` |
| OpenAPI JSON | `http://localhost:9080/v3/api-docs` |

## URLs importantes

| Recurso | URL directa | URL via BFF |
|---|---|---|
| Health | `http://localhost:9080/api/auth/health` | No expuesto por BFF/Gateway en el escenario actual |
| Swagger | `http://localhost:9080/swagger-ui/index.html` | No aplica |
| Login | `http://localhost:9080/api/auth/login` | `http://localhost:8000/api/auth/login` |
| Register | `http://localhost:9080/api/auth/register` | No expuesto por BFF/Gateway en el escenario actual |

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

### Pruebas en Swagger

En Swagger UI se puede probar cada endpoint directo del microservicio:

| Endpoint | Metodo | Como probar | Resultado esperado |
|---|---|---|---|
| `/api/auth/health` | `GET` | Click en `Try it out` y `Execute` | `{"status":"UP","service":"auth-service"}` |
| `/api/auth/login` | `POST` | Body: `{"username":"vendedor","password":"1234"}` | Token JWT con `tokenType`, `expiresIn` y `accessToken` |
| `/api/auth/register` | `POST` | Body con `email`, `username`, `password`, `firstName`, `lastName`, `role` | Usuario creado delegando a `ms-user` |
| `/api/auth/users/me` | `GET` | Ejecutar sin body | Perfil de usuario actual simulado |
| `/api/auth/public-key` | `GET` | Ejecutar sin body | Llave publica RS256 |
| `/api/auth/users` | `GET` | Ejecutar sin body | Lista de usuarios desde `ms-user` |

En el escenario actual del frontend, solo `POST /api/auth/login` se expone por KrakenD. Los demas endpoints quedan disponibles para pruebas directas del microservicio o integracion interna, pero no como contrato publico del frontend.

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
