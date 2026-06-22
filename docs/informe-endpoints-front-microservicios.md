# Informe tecnico de endpoints y arquitectura - Grupo Cordillera

## 1. Objetivo del documento

Este documento explica como funcionan los endpoints conectados al frontend del proyecto Grupo Cordillera, como viajan las solicitudes desde la interfaz hasta cada microservicio, como participan el API Gateway y el BFF, y como termina el flujo en la capa de persistencia de datos.

Tambien identifica los patrones de arquitectura y patrones de diseno presentes en el codigo: microservicios, API Gateway, Backend for Frontend, arquitectura por capas, Repository, DTO, Strategy, Factory, Dependency Injection, cliente HTTP, proxy/fachada y manejo centralizado de errores.

## 2. Vista general de arquitectura

El sistema esta organizado en una arquitectura de frontend + gateway + BFF + microservicios:

```text
Usuario en navegador
  -> Frontend React/TypeScript
  -> Nginx del frontend, si se ejecuta en Docker
  -> API Gateway KrakenD
  -> BFF NestJS
  -> Microservicios Spring Boot
  -> PostgreSQL por dominio
```

Componentes principales:

| Componente | Ruta | Tecnologia | Responsabilidad |
|---|---|---|---|
| Frontend | `frontend/` | React, TypeScript, Vite, Wouter, Recharts | Pantallas de login, creacion de usuarios, dashboard, KPIs y alertas. |
| Nginx frontend | `frontend/nginx.conf` | Nginx | Sirve la aplicacion React compilada y reenvia `/api/` al API Gateway. |
| API Gateway | `Backend/api-gateway/` | KrakenD | Punto de entrada HTTP para llamadas `/api/*`; reenvia al BFF. |
| BFF | `Backend/bff/` | NestJS, Express, TypeScript | Fachada especifica para el frontend; proxy hacia microservicios y agregacion de datos. |
| Auth Service | `Backend/ms-auth/` | Spring Boot, JWT RS256 | Login, registro delegado, perfil actual, llave publica y emision de JWT. |
| User Service | `Backend/ms-user/` | Spring Boot, JPA, Flyway, PostgreSQL | Gestion y persistencia de usuarios. |
| KPIs Service | `Backend/ms-kpis/` | Spring Boot, JdbcTemplate, Flyway, PostgreSQL | Lectura de indicadores, graficos y alertas. |
| Report Service | `Backend/ms-report/` | Spring Boot, JPA, Flyway, PostgreSQL | Creacion y consulta de reportes. |

## 3. Flujo HTTP general

### 3.1 Flujo en Docker Compose

Cuando la aplicacion se ejecuta con `docker compose up --build`, el frontend se publica en `http://localhost:5173`. El contenedor `front-web2` sirve React con Nginx. Si el navegador pide una ruta `/api/...`, el Nginx del frontend la envia al API Gateway:

```text
Browser
  -> http://localhost:5173/api/kpis/summary
  -> frontend/nginx.conf: proxy_pass http://api-gateway:8088
  -> Backend/api-gateway/krakend.json: backend http://bff-service:8000
  -> BFF NestJS
  -> microservicio interno correspondiente
```

En `docker-compose.yml`, las variables del build del frontend apuntan a rutas relativas:

```text
VITE_USERS_API_URL=/api/auth
VITE_USER_API_URL=/api/users
VITE_KPIS_API_URL=/api/kpis
```

Esto evita exponer directamente los microservicios al navegador. El navegador ve solo `/api/*`; la red interna de Docker resuelve nombres como `bff-service`, `auth-service`, `user-service`, `kpis-service` y `report-service`.

### 3.2 Flujo en Kubernetes

En Kubernetes, `k8s/ingress.yaml` define el host `grupo-cordillera.local`:

| Path | Destino |
|---|---|
| `/api` | Servicio `api-gateway`, puerto `8088`. |
| `/` | Servicio `front-web2`, puerto `80`. |

Por lo tanto, en Kubernetes el flujo es:

```text
Browser
  -> Ingress Nginx
  -> /api al api-gateway
  -> BFF
  -> microservicios
  -> bases PostgreSQL
```

## 4. API Gateway

El API Gateway esta implementado con KrakenD en `Backend/api-gateway/krakend.json`.

Responsabilidades:

- Escuchar en el puerto `8088`.
- Exponer `GET /health`.
- Configurar CORS para llamadas desde el frontend.
- Propagar headers necesarios como `Content-Type` y `Authorization`.
- Propagar query strings.
- Declarar rutas publicas para auth, usuarios, KPIs, reportes y dashboard.
- Reenviar los endpoints declarados al backend `bff-service:8000`.

Ejemplo de declaracion:

```text
endpoint: /api/kpis/summary
backend: http://bff-service:8000/api/kpis/summary
```

Importante: el API Gateway no decide a que microservicio final va cada endpoint. Esa decision esta en el BFF. El gateway funciona como punto unico de entrada y como contrato explicito de rutas publicas.

## 5. BFF - Backend for Frontend

El BFF esta implementado con NestJS en `Backend/bff/`. Su responsabilidad es adaptar la arquitectura interna al consumo del frontend.

### 5.1 Configuracion de servicios internos

El archivo `Backend/bff/src/config/services.config.ts` define las URLs internas:

| Variable | Valor por defecto | En Docker Compose |
|---|---|---|
| `AUTH_API_URL` | `http://localhost:8080/api/auth` | `http://auth-service:8080/api/auth` |
| `KPIS_API_URL` | `http://localhost:8081/api/kpis` | `http://kpis-service:8081/api/kpis` |
| `USER_API_URL` | `http://localhost:8082/api/users` | `http://user-service:8082/api/users` |
| `REPORT_API_URL` | `http://localhost:8082/api/reports` | `http://report-service:8082/api/reports` |

### 5.2 Seguridad en el BFF

Los controladores principales usan `JwtGuard`:

```text
Backend/bff/src/common/guards/jwt.guard.ts
```

Este guard valida una regla basica:

- Si no viene cabecera `Authorization`, deja pasar.
- Si viene cabecera `Authorization`, debe comenzar con `Bearer `.

Esto significa que el BFF valida el formato, pero no verifica criptograficamente el JWT. La emision del token la hace `ms-auth`; una validacion completa podria usar la llave publica expuesta por `GET /api/auth/public-key`.

### 5.3 Proxy comun

El archivo `Backend/bff/src/common/utils/http-client.ts` contiene la funcion `proxyRequest`. Esta funcion:

1. Recibe la solicitud del frontend.
2. Quita el prefijo publico, por ejemplo `/api/kpis`.
3. Construye la URL final con la base interna del microservicio.
4. Copia cabeceras relevantes como `Content-Type` y `Authorization`.
5. Reenvia el metodo HTTP original.
6. Para metodos distintos a `GET` y `HEAD`, envia el body como JSON.
7. Devuelve al frontend el status y payload recibidos desde el microservicio.

Ejemplo:

```text
Solicitud publica:
GET /api/kpis/summary

BFF:
baseUrl = http://kpis-service:8081/api/kpis
publicPrefix = /api/kpis
targetPath = /summary
targetUrl = http://kpis-service:8081/api/kpis/summary
```

### 5.4 Endpoint agregado del BFF

El BFF tambien expone:

```text
GET /api/dashboard
```

Ese endpoint esta en `Backend/bff/src/modules/kpis/kpis.controller.ts` y llama a `KpisService.getDashboard()`. Actualmente agrega en paralelo:

- `auth-service`: usuario actual por `GET /api/auth/users/me`.
- `kpis-service`: resumen, ventas mensuales, sucursales, canales y alertas.
- `report-service`: reportes disponibles por `GET /api/reports`.

El frontend actual no consume este endpoint agregado; el dashboard de React llama directamente a varios endpoints `/api/kpis/*`. Aun asi, el BFF ya tiene la capacidad de entregar una respuesta consolidada.

## 6. Endpoints conectados al frontend

### 6.1 Login

Pantalla/componente:

- `frontend/src/components/Login.tsx`
- Servicio frontend: `frontend/src/services/authService.ts`

Endpoint publico consumido por el frontend:

```text
POST /api/auth/login
```

Body enviado:

```json
{
  "username": "gerente",
  "password": "1234"
}
```

Flujo completo:

```text
Login.tsx
  -> authService.login()
  -> POST /api/auth/login
  -> API Gateway
  -> BFF AuthController
  -> AuthClient.proxy()
  -> ms-auth POST /api/auth/login
  -> UserService.authenticateAndGetUser()
  -> HttpUserClient POST user-service /api/users/authenticate
  -> UserManagementService.authenticate()
  -> UserRepository busca por username o email
  -> PostgreSQL user_db.users
  -> ms-auth genera JWT RS256
  -> frontend guarda usuario en sessionStorage
```

Respuesta exitosa:

```json
{
  "message": "Autenticacion exitosa",
  "username": "gerente",
  "email": "gerente@cordillera.cl",
  "role": "Gerente",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "accessToken": "..."
}
```

Reglas relevantes:

- El frontend transforma la respuesta a `UserProfile`.
- `ms-auth` valida que vengan `username` y `password`.
- `ms-user` permite autenticar por username o email.
- Las passwords estan almacenadas en texto plano en los seeds actuales; para produccion se deberia usar hashing como BCrypt.

### 6.2 Crear usuario

Pantalla:

- `frontend/src/views/CreateUser.tsx`
- Servicio frontend: `frontend/src/services/userService.ts`

Endpoint publico:

```text
POST /api/users
```

Body enviado:

```json
{
  "username": "nuevo.usuario",
  "email": "nuevo@cordillera.cl",
  "password": "1234",
  "firstName": "Nuevo",
  "lastName": "Usuario",
  "role": "Vendedor"
}
```

Flujo:

```text
CreateUser.tsx
  -> userService.createUser()
  -> POST /api/users
  -> API Gateway
  -> BFF UsersController
  -> UserClient.proxy()
  -> ms-user POST /api/users
  -> UserManagementService.create()
  -> UserRepository.existsByUsername()
  -> UserRepository.existsByEmailIgnoreCase()
  -> UserRepository.save()
  -> PostgreSQL user_db.users
```

Validaciones en frontend:

- Nombre obligatorio.
- Apellido obligatorio.
- Usuario obligatorio.
- Email obligatorio y debe contener `@`.
- Password obligatoria.
- Rol obligatorio.

Validaciones en backend:

- Body obligatorio.
- `username`, `email`, `password`, `firstName`, `lastName` y `role` obligatorios.
- Email debe contener `@`.
- Rol permitido: `Gerente`, `Supervisor` o `Vendedor`.
- Username unico.
- Email unico, ignorando mayusculas/minusculas.

Persistencia:

- Tabla: `users`.
- Migracion: `Backend/ms-user/src/main/resources/db/migration/V1__create_users_table.sql`.
- Seed inicial: `V2__seed_default_users.sql`.

### 6.3 Obtener usuario actual

Servicio frontend:

- `frontend/src/services/userService.ts`

Endpoint publico:

```text
GET /api/auth/users/me
```

Flujo:

```text
userService.getCurrentUser()
  -> GET /api/auth/users/me
  -> API Gateway
  -> BFF AuthController
  -> ms-auth GET /api/auth/users/me
  -> UserService.getCurrentUserProfile()
  -> HttpUserClient.findAll()
  -> ms-user GET /api/users
  -> user_db.users
```

Comportamiento:

- `ms-auth` consulta todos los usuarios en `ms-user`.
- Toma el primer usuario encontrado.
- Lo transforma a `UserProfileDto`.
- Si no existen usuarios, responde un perfil invitado.

Observacion tecnica: el endpoint se llama "usuario actual", pero no usa el JWT para identificar el subject. En esta implementacion devuelve el primer usuario disponible, no necesariamente el usuario autenticado.

### 6.4 Dashboard de KPIs

Pantalla:

- `frontend/src/views/Dashboard.tsx`
- Servicio frontend: `frontend/src/services/kpiService.ts`

El dashboard llama cinco endpoints en paralelo con `Promise.all`:

| Funcion frontend | Endpoint publico | Microservicio final |
|---|---|---|
| `getSummary()` | `GET /api/kpis/summary` | `ms-kpis` |
| `getSales()` | `GET /api/kpis/sales/monthly` | `ms-kpis` |
| `getBranchesPerformance()` | `GET /api/kpis/branches/performance` | `ms-kpis` |
| `getSalesByChannel()` | `GET /api/kpis/channels` | `ms-kpis` |
| `getAlerts()` | `GET /api/kpis/alerts` | `ms-kpis` |

Flujo comun:

```text
Dashboard.tsx
  -> kpiService.*
  -> /api/kpis/...
  -> API Gateway
  -> BFF KpisController
  -> KpisClient.proxy()
  -> ms-kpis /api/kpis/...
  -> KpiController
  -> KpiQueryService
  -> KpiStrategyFactory
  -> estrategia concreta
  -> InMemoryKpiRepository con JdbcTemplate
  -> PostgreSQL kpis_db
```

### 6.5 Vista de KPIs

Pantalla:

- `frontend/src/views/KpisView.tsx`

Endpoint consumido:

```text
GET /api/kpis/summary
```

Esta pantalla muestra solo las tarjetas de resumen. Usa `kpiCardStrategies` en el frontend para decidir titulo, icono, formato de valor y tendencia visual de cada tarjeta.

### 6.6 Vista de alertas

Pantalla:

- `frontend/src/views/AlertsView.tsx`

Endpoint consumido:

```text
GET /api/kpis/alerts
```

La respuesta se renderiza en tabla. El frontend usa `alertStatusStrategies` para asociar cada estado a estilo e icono.

Estados esperados por el frontend:

```text
Critico
Advertencia
Informativo
```

En el backend los estados se modelan como enum `AlertStatus` y se leen desde la tabla `alerts`.

## 7. Endpoints expuestos por microservicio

### 7.1 Auth Service

Base interna:

```text
http://auth-service:8080/api/auth
```

Controlador:

```text
Backend/ms-auth/src/main/java/com/grupocordillera/authservice/controller/UserController.java
```

| Metodo | Ruta | Uso desde frontend | Descripcion |
|---|---|---|---|
| `GET` | `/api/auth/health` | No directo | Health check. |
| `POST` | `/api/auth/login` | Si | Autentica credenciales delegando a `ms-user` y genera JWT. |
| `POST` | `/api/auth/register` | No directo en frontend actual | Valida datos y crea usuario delegando a `ms-user`. |
| `GET` | `/api/auth/users/me` | Si, via `userService.getCurrentUser()` | Devuelve perfil actual simulado desde el primer usuario de `ms-user`. |
| `GET` | `/api/auth/public-key` | No directo | Expone llave publica RSA para validar JWT RS256. |
| `GET` | `/api/auth/users` | No directo | Lista usuarios delegando a `ms-user`. |

`ms-auth` no persiste datos propios. Su estado criptografico viene de:

```text
Backend/ms-auth/src/main/resources/keys/private.pem
Backend/ms-auth/src/main/resources/keys/public.pem
```

### 7.2 User Service

Base interna:

```text
http://user-service:8082/api/users
```

Controlador:

```text
Backend/ms-user/src/main/java/com/grupocordillera/userservice/controller/UserController.java
```

| Metodo | Ruta | Uso desde frontend | Descripcion |
|---|---|---|---|
| `GET` | `/api/users/health` | No directo | Health check. |
| `POST` | `/api/users` | Si | Crea usuario en PostgreSQL. |
| `GET` | `/api/users` | Indirecto por `ms-auth` y BFF dashboard | Lista usuarios. |
| `POST` | `/api/users/authenticate` | Indirecto por `ms-auth` | Autentica por username/email y password. |
| `GET` | `/api/users/{username}` | No directo | Busca usuario por username. |

Persistencia:

| Elemento | Detalle |
|---|---|
| Base | `user_db` |
| Tabla | `users` |
| ORM | Spring Data JPA |
| Repositorio | `UserRepository extends JpaRepository<User, Long>` |
| Migraciones | `V1__create_users_table.sql`, `V2__seed_default_users.sql` |

Columnas principales:

```text
id, username, email, password, first_name, last_name, role, created_at
```

Usuarios seed:

```text
gerente / 1234
supervisor / 1234
vendedor / 1234
```

### 7.3 KPIs Service

Base interna:

```text
http://kpis-service:8081/api/kpis
```

Controlador:

```text
Backend/ms-kpis/src/main/java/com/grupocordillera/kpis/controller/KpiController.java
```

| Metodo | Ruta | Uso desde frontend | Descripcion |
|---|---|---|---|
| `GET` | `/api/kpis/health` | No directo | Health check. |
| `GET` | `/api/kpis/summary` | Si | Resumen: ventas, margen, stock critico, reclamos, ticket promedio y satisfaccion. |
| `GET` | `/api/kpis/sales/monthly` | Si | Serie mensual para grafico de linea. |
| `GET` | `/api/kpis/branches/performance` | Si | Desempeno por sucursal para grafico de barras. |
| `GET` | `/api/kpis/channels` | Si | Distribucion de ventas por canal para grafico circular. |
| `GET` | `/api/kpis/alerts` | Si | Lista de alertas recientes. |
| `GET` | `/api/kpis/{type}` | No directo | Endpoint generico por tipo `KpiType`. |

Persistencia:

| Elemento | Detalle |
|---|---|
| Base | `kpis_db` |
| Acceso | `JdbcTemplate` |
| Repositorio | `InMemoryKpiRepository`, aunque consulta PostgreSQL |
| Migraciones | `V1__create_kpis_schema.sql`, `V2__seed_kpis_data.sql`, `V3__upsert_kpis_seed_data.sql` |

Tablas:

| Tabla | Proposito |
|---|---|
| `kpi_summary` | Valores consolidados de tarjetas KPI. |
| `monthly_sales` | Ventas por mes. |
| `branch_performance` | Puntuacion por sucursal. |
| `sales_channels` | Porcentaje por canal de venta. |
| `alerts` | Alertas y estados asociados. |

### 7.4 Report Service

Base interna:

```text
http://report-service:8082/api/reports
```

Controlador:

```text
Backend/ms-report/src/main/java/com/grupocordillera/report/controller/ReportController.java
```

| Metodo | Ruta | Uso desde frontend | Descripcion |
|---|---|---|---|
| `GET` | `/api/reports/health` | No directo | Health check. |
| `POST` | `/api/reports` | No directo en UI actual | Crea reporte. |
| `GET` | `/api/reports` | Indirecto por `GET /api/dashboard` del BFF | Lista reportes. |
| `GET` | `/api/reports/{id}` | No directo | Busca reporte por id. |

Persistencia:

| Elemento | Detalle |
|---|---|
| Base | `report_db` |
| Tabla | `reports` |
| ORM | Spring Data JPA |
| Repositorio | `ReportRepository extends JpaRepository<Report, Long>` |
| Migracion | `V1__create_reports_table.sql` |

Columnas:

```text
id, title, description, report_type, status, generated_at
```

Estados permitidos:

```text
PENDING, GENERATED, FAILED
```

## 8. Transformacion de datos entre capas

### 8.1 Transformacion en el frontend

El servicio `frontend/src/services/kpiService.ts` adapta nombres del backend a nombres usados por React.

Ejemplo de resumen:

| Backend | Frontend |
|---|---|
| `ventasTotales` | `totalSales` |
| `margenUtilidad` | `profitMargin` |
| `stockCritico` | `criticalStock` |
| `reclamosActivos` | `activeClaims` |
| `ticketPromedio` | `averageTicket` |
| `satisfaccionCliente` | `customerSatisfaction` |

En ventas mensuales:

| Backend | Frontend |
|---|---|
| `month` | `month` |
| `ventas` | `sales` |

En sucursales:

| Backend | Frontend |
|---|---|
| `branch` | `branch` |
| `desempeno` | `performance` |

### 8.2 DTOs en microservicios

Los microservicios Java usan DTOs para separar el contrato HTTP de la entidad persistida:

- `UserDto`, `UserProfileDto` en `ms-auth`.
- `CreateUserRequest`, `AuthenticateUserRequest`, `UserResponse`, `AuthenticatedUserResponse` en `ms-user`.
- `KpiSummaryResponse`, `MonthlySalesResponse`, `BranchPerformanceResponse`, `SalesChannelResponse`, `AlertResponse` en `ms-kpis`.
- `ReportRequest`, `ReportResponse` en `ms-report`.

Esta separacion evita exponer directamente todos los campos internos de las entidades y permite moldear respuestas especificas para cada caso de uso.

## 9. Persistencia de datos

### 9.1 Bases por microservicio

El proyecto sigue el principio de base de datos por servicio:

| Servicio | Base | Puerto host en Docker | Usuario |
|---|---|---|---|
| `ms-user` | `user_db` | `5435` | `user_user` |
| `ms-kpis` | `kpis_db` | `5434` | `kpis_user` |
| `ms-report` | `report_db` | `5436` | `report_user` |
| `ms-auth` | No aplica | No aplica | No aplica |

Cada microservicio que persiste datos ejecuta sus propias migraciones Flyway al iniciar.

### 9.2 Flyway

Flyway esta habilitado en:

- `Backend/ms-user/src/main/resources/application.properties`
- `Backend/ms-kpis/src/main/resources/application.properties`
- `Backend/ms-report/src/main/resources/application.properties`

Configuracion comun:

```text
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration
```

En `ms-user` y `ms-report` se usa ademas:

```text
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.open-in-view=false
```

Esto significa que Hibernate valida que las entidades coincidan con las tablas creadas por Flyway, pero no crea ni modifica el esquema automaticamente.

## 10. Patrones de arquitectura

### 10.1 Microservicios

El backend se divide por dominios:

- Autenticacion: `ms-auth`.
- Usuarios: `ms-user`.
- Indicadores: `ms-kpis`.
- Reportes: `ms-report`.

Cada microservicio tiene responsabilidad clara y se despliega como contenedor independiente.

### 10.2 API Gateway

El gateway KrakenD centraliza la entrada a `/api/*`. Esto permite:

- Exponer un unico punto HTTP al exterior.
- Ocultar direcciones internas de BFF y microservicios.
- Manejar CORS y preflight `OPTIONS`.
- Preparar el proyecto para balanceo, TLS o politicas transversales.

### 10.3 Backend for Frontend

El BFF adapta los servicios internos al frontend. Sus funciones principales son:

- Mantener rutas publicas simples: `/api/auth`, `/api/users`, `/api/kpis`, `/api/reports`.
- Hacer proxy hacia microservicios.
- Agregar datos en `GET /api/dashboard`.
- Evitar que React conozca la topologia interna de microservicios.

### 10.4 Arquitectura por capas

Los microservicios Java siguen una separacion clasica:

```text
Controller -> Service -> Repository -> Database
```

Ejemplo en `ms-user`:

```text
UserController
  -> UserManagementService
  -> UserRepository
  -> users table
```

Ejemplo en `ms-report`:

```text
ReportController
  -> ReportService
  -> ReportRepository
  -> reports table
```

Ejemplo en `ms-kpis`:

```text
KpiController
  -> KpiQueryService
  -> KpiStrategyFactory
  -> KpiStrategy concreta
  -> InMemoryKpiRepository
  -> tablas kpis
```

## 11. Patrones de diseno

### 11.1 Repository

Ubicacion:

- `Backend/ms-user/src/main/java/.../repository/UserRepository.java`
- `Backend/ms-report/src/main/java/.../repository/ReportRepository.java`
- `Backend/ms-kpis/src/main/java/.../repository/InMemoryKpiRepository.java`

Proposito:

- Encapsular acceso a datos.
- Evitar que controladores y servicios conozcan SQL o detalles de persistencia.
- En JPA, heredar operaciones comunes desde `JpaRepository`.

### 11.2 DTO - Data Transfer Object

Ubicacion:

- Paquetes `dto` de cada microservicio.
- Interfaces TypeScript en `Backend/bff/src/interfaces`.
- Tipos del frontend en `frontend/src/types` y `frontend/src/services`.

Proposito:

- Definir contratos de entrada y salida.
- Separar entidades persistidas del formato HTTP.
- Evitar acoplamiento directo entre base de datos y API publica.

### 11.3 Strategy

Ubicacion backend:

```text
Backend/ms-kpis/src/main/java/com/grupocordillera/kpis/service/strategy/
```

Clases:

- `KpiStrategy`
- `SummaryKpiStrategy`
- `MonthlySalesStrategy`
- `BranchPerformanceStrategy`
- `SalesChannelStrategy`
- `AlertsStrategy`

Proposito:

- Cada tipo de KPI tiene su propia forma de obtener y devolver datos.
- `KpiQueryService` no necesita saber los detalles de cada consulta.
- Agregar un nuevo KPI implica crear una nueva estrategia y asociarla a un nuevo `KpiType`.

Ubicacion frontend:

- `frontend/src/strategies/kpiCardStrategies.tsx`
- `frontend/src/strategies/alertStatusStrategy.tsx`

En el frontend el patron se usa para decidir presentacion visual: titulo, icono, formato de valor, tendencia y estilo de alertas.

### 11.4 Factory

Ubicacion:

```text
Backend/ms-kpis/src/main/java/com/grupocordillera/kpis/service/factory/KpiStrategyFactory.java
```

Proposito:

- Recibe todas las implementaciones `KpiStrategy` por inyeccion de dependencias.
- Las guarda en un `EnumMap<KpiType, KpiStrategy<?>>`.
- Devuelve la estrategia correcta segun el `KpiType`.

### 11.5 Dependency Injection

Presente en Spring Boot y NestJS.

Ejemplos:

- `UserController` recibe `UserManagementService` por constructor.
- `ReportService` recibe `ReportRepository` por constructor.
- `KpiQueryService` recibe `KpiStrategyFactory` por constructor.
- `AuthService` del BFF recibe `AuthClient` por constructor.
- `KpisService` del BFF recibe `KpisClient`, `UserClient` y `ReportClient`.

Beneficios:

- Bajo acoplamiento.
- Facilita pruebas unitarias.
- Permite reemplazar implementaciones.

### 11.6 Facade / Proxy

El BFF funciona como fachada hacia el frontend y como proxy hacia microservicios.

Ubicaciones:

- `Backend/bff/src/modules/*/*.controller.ts`
- `Backend/bff/src/clients/*.client.ts`
- `Backend/bff/src/common/utils/http-client.ts`

Ejemplo:

```text
Frontend llama /api/kpis/summary
BFF recibe /api/kpis/summary
BFF reenvia a http://kpis-service:8081/api/kpis/summary
```

### 11.7 Client Adapter

`ms-auth` no accede directamente a la base de usuarios. Usa una interfaz:

```text
Backend/ms-auth/src/main/java/.../client/UserClient.java
```

Y una implementacion HTTP:

```text
Backend/ms-auth/src/main/java/.../client/HttpUserClient.java
```

Este diseno desacopla `ms-auth` del mecanismo concreto usado para consultar usuarios. Hoy es HTTP con `RestClient`; en el futuro podria ser otro cliente o un mock de pruebas.

### 11.8 Manejo centralizado de errores

Los microservicios tienen `RestExceptionHandler`:

- `ms-auth/controller/RestExceptionHandler.java`
- `ms-user/controller/RestExceptionHandler.java`
- `ms-kpis/controller/RestExceptionHandler.java`
- `ms-report/controller/RestExceptionHandler.java`

Proposito:

- Convertir excepciones en respuestas HTTP consistentes.
- Evitar que stack traces internos lleguen al cliente.
- Mantener un contrato de error uniforme.

## 12. Recorridos extremo a extremo

### 12.1 Login con JWT

```text
1. Usuario ingresa credenciales en Login.
2. React ejecuta authService.login(login, password).
3. Se envia POST /api/auth/login.
4. Nginx frontend envia /api al API Gateway.
5. API Gateway envia /api/auth/login al BFF.
6. BFF AuthController usa AuthClient.proxy().
7. AuthClient arma URL interna de ms-auth.
8. ms-auth valida estructura del request.
9. ms-auth llama a ms-user /api/users/authenticate.
10. ms-user consulta user_db.users por username o email.
11. Si coincide password, devuelve usuario autenticado.
12. ms-auth genera JWT RS256 con username, email y role.
13. BFF devuelve la respuesta al frontend.
14. React guarda el perfil de usuario en sessionStorage.
```

### 12.2 Creacion de usuario

```text
1. Usuario abre /crear-usuario.
2. React valida campos obligatorios.
3. React envia POST /api/users.
4. Gateway reenvia al BFF.
5. BFF UsersController usa UserClient.proxy().
6. UserClient envia POST a ms-user /api/users.
7. UserManagementService valida reglas de negocio.
8. UserRepository verifica duplicados.
9. UserRepository.save() inserta en users.
10. PostgreSQL confirma persistencia.
11. ms-user responde 201 Created.
12. Frontend muestra mensaje de exito.
```

### 12.3 Carga del dashboard

```text
1. Usuario autenticado entra a /.
2. Dashboard.tsx ejecuta Promise.all con cinco llamadas KPI.
3. Cada llamada va a /api/kpis/*
4. Gateway envia al BFF.
5. BFF KpisController reenvia a ms-kpis.
6. KpiController llama a KpiQueryService.
7. KpiQueryService obtiene estrategia desde KpiStrategyFactory.
8. La estrategia consulta InMemoryKpiRepository.
9. El repositorio ejecuta SQL con JdbcTemplate.
10. PostgreSQL kpis_db devuelve filas.
11. ms-kpis transforma a DTOs.
12. Frontend adapta nombres y renderiza tarjetas/graficos/tablas.
```

### 12.4 Listado de alertas

```text
1. Usuario abre /alertas.
2. AlertsView llama kpiService.getAlerts().
3. Se envia GET /api/kpis/alerts.
4. Gateway -> BFF -> ms-kpis.
5. ms-kpis usa AlertsStrategy.
6. AlertsStrategy llama repository.getAlerts().
7. Se consulta tabla alerts.
8. La respuesta vuelve al frontend.
9. alertStatusStrategies decide color e icono por estado.
```

### 12.5 Reportes desde BFF dashboard

Aunque el modulo `/reportes` del frontend muestra "en construccion", el BFF ya puede consultar reportes dentro de `GET /api/dashboard`.

```text
1. Cliente llama GET /api/dashboard.
2. KpisService.getDashboard() ejecuta Promise.all.
3. ReportClient.getLatestReports() llama servicesConfig.reportApiUrl.
4. ms-report GET /api/reports lista reportes.
5. ReportRepository.findAll() lee tabla reports.
6. BFF incluye reports en la respuesta agregada.
```

## 13. Observaciones tecnicas importantes

1. El BFF valida solo el formato de `Authorization: Bearer ...`, no la firma del JWT.
2. El frontend guarda el usuario en `sessionStorage`, pero no adjunta automaticamente el JWT en todas las llamadas KPI.
3. `GET /api/auth/users/me` no identifica al usuario desde el token; toma el primer usuario devuelto por `ms-user`.
4. `ms-auth` no tiene base propia, por lo que depende de `ms-user` para login, registro y listado.
5. `InMemoryKpiRepository` esta nombrado como si fuera memoria, pero realmente consulta PostgreSQL con `JdbcTemplate`.
6. El modulo visual de reportes aun no consume endpoints en React, aunque el BFF y `ms-report` ya exponen endpoints.
7. En `docker-compose.yml`, `report-service` usa puerto interno `8082`, igual que `user-service`, pero en contenedores distintos no hay conflicto. Hacia el host se publica como `9083`.

## 14. Resumen de rutas publicas principales

| Ruta publica | Consumidor actual | BFF | Microservicio final | Persistencia |
|---|---|---|---|---|
| `POST /api/auth/login` | Login | Auth module | `ms-auth` y luego `ms-user` | `user_db.users` |
| `GET /api/auth/users/me` | userService | Auth module | `ms-auth` y luego `ms-user` | `user_db.users` |
| `POST /api/users` | Crear usuario | Users module | `ms-user` | `user_db.users` |
| `GET /api/kpis/summary` | Dashboard, KPIs | KPIs module | `ms-kpis` | `kpis_db.kpi_summary` |
| `GET /api/kpis/sales/monthly` | Dashboard | KPIs module | `ms-kpis` | `kpis_db.monthly_sales` |
| `GET /api/kpis/branches/performance` | Dashboard | KPIs module | `ms-kpis` | `kpis_db.branch_performance` |
| `GET /api/kpis/channels` | Dashboard | KPIs module | `ms-kpis` | `kpis_db.sales_channels` |
| `GET /api/kpis/alerts` | Dashboard, Alertas | KPIs module | `ms-kpis` | `kpis_db.alerts` |
| `GET /api/dashboard` | No usado por React actual | KPIs module agregado | `ms-auth`, `ms-kpis`, `ms-report` | `user_db`, `kpis_db`, `report_db` |
| `GET /api/reports` | No usado directo en React actual | Reports module | `ms-report` | `report_db.reports` |
| `POST /api/reports` | No usado directo en React actual | Reports module | `ms-report` | `report_db.reports` |

## 15. Conclusiones

El proyecto Grupo Cordillera implementa una arquitectura distribuida con separacion clara entre presentacion, entrada HTTP, adaptacion para frontend, logica de negocio y persistencia. El frontend no consume microservicios directamente; todas las llamadas pasan por `/api/*`, luego por el API Gateway y despues por el BFF.

El BFF centraliza el enrutamiento interno y ofrece una base para agregacion de datos. Los microservicios Java mantienen una arquitectura por capas y separan contratos HTTP mediante DTOs. La persistencia esta aislada por dominio, usando PostgreSQL y Flyway para versionar esquemas.

Los patrones mas relevantes son:

- API Gateway para entrada unica.
- Backend for Frontend como fachada del frontend.
- Microservicios por dominio.
- Repository para acceso a datos.
- DTO para contratos.
- Strategy y Factory para KPIs.
- Dependency Injection en Spring y NestJS.
- Client Adapter en la comunicacion `ms-auth` -> `ms-user`.
- Manejo centralizado de excepciones con `RestExceptionHandler`.
