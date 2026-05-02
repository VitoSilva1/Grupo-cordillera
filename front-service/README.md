# Grupo Cordillera

## Descripción general

`Grupo Cordillera` es un monorepo de arquitectura de microservicios diseñado para soportar una aplicación corporativa con frontend, autenticación, BFF y servicio de KPIs. Cada servicio se implementa de forma independiente dentro del mismo repositorio, lo que facilita el desarrollo paralelo, las pruebas aisladas y el despliegue modular.

Este proyecto está orientado a una solución enterprise ligera donde el frontend consume APIs a través de un backend for frontend (BFF) y la autenticación es gestionada por un servicio especializado.

## Arquitectura del sistema

La arquitectura consta de cuatro servicios principales:

- `front-service`: Aplicación React que provee la interfaz de usuario.
- `bff-service`: Backend For Frontend que actúa como intermediario entre el frontend y los servicios backend.
- `auth-service`: Servicio de autenticación y gestión de usuarios.
- `kpis-service`: Servicio de métricas y KPIs para la información de negocio.

El flujo de comunicación general es:

1. El usuario interactúa con `front-service`.
2. El frontend realiza solicitudes al `bff-service`.
3. El `bff-service` reenvía las peticiones a `auth-service` o `kpis-service` según corresponda.
4. Los datos se envían de vuelta al frontend a través del BFF.

## Estructura del repositorio

```text
Grupo-cordillera/
├── auth-service/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/java/com/grupocordillera/authService/
│   │   │   ├── AuthServiceApplication.java
│   │   │   ├── controller/
│   │   │   ├── dto/
│   │   │   ├── model/
│   │   │   ├── repository/
│   │   │   └── service/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── bff-service/
│   ├── package.json
│   ├── src/
│   │   └── index.js
│   └── .env
├── front-service/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.js
│       ├── Login.jsx
│       └── ...
├── kpis-service/
│   ├── pom.xml
│   ├── src/
│   │   ├── main/java/com/grupocordillera/kpis/
│   │   └── resources/
│   └── test/
└── README.md
```

![Diagrama del sistema](front-service/assets/Blank diagram - Page 1.png)


## Tecnologías utilizadas

- **Frontend**: React, Create React App
- **Backend BFF**: Node.js, Express, CORS
- **Autenticación**: Spring Boot, Java 17
- **KPIs**: Spring Boot, Java 17
- **Construcción**: Maven para servicios Java
- **Gestión de dependencias**: npm para frontend y BFF
- **Comunicación**: APIs REST JSON

## Instalación paso a paso

1. Clonar el repositorio:

```bash
git clone https://tu-repositorio/Grupo-cordillera.git
cd Grupo-cordillera
```

2. Instalar dependencias del frontend:

```bash
cd front-service
npm install
```

3. Instalar dependencias del BFF:

```bash
cd ../bff-service
npm install
```

4. Instalar dependencias de los servicios Java:

```bash
cd ../auth-service
mvn clean install

cd ../kpis-service
mvn clean install
```

## Cómo ejecutar el frontend

Desde la carpeta `front-service`:

```bash
cd front-service
npm start
```

Luego abrir en el navegador:

```text
http://localhost:3000
```

## Cómo se comunican los servicios

El `front-service` no llama directamente a los servicios backend. En su lugar, usa el `bff-service` como intermediario:

- `front-service` → `bff-service` (`http://localhost:8000`)
- `bff-service` → `auth-service` / `kpis-service`

Esto permite centralizar rutas, políticas de CORS, agregación de respuestas y seguridad en un solo punto.

## Autenticación

El `auth-service` gestiona el login y el registro de usuarios. En este proyecto, se utiliza un repositorio en memoria para datos mock, ya que no existe una base de datos real implementada.

Rutas principales del `auth-service`:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/health`
- `GET /api/auth/users/me`

El componente `Login.jsx` del frontend envía las credenciales al BFF y éste las reenvía al `auth-service`.

## KPIs

El `kpis-service` está diseñado para exponer métricas y datos de negocio a través de APIs REST. Este servicio puede entregar información agregada como ventas, rendimiento de sucursales, indicadores de canales y alertas.

Rutas típicas:

- `GET /api/kpis/summary`
- `GET /api/kpis/sales/monthly`
- `GET /api/kpis/branches/performance`
- `GET /api/kpis/channels`
- `GET /api/kpis/alerts`

## Buenas prácticas del proyecto

- Utilizar flujo de Git basado en ramas: `main`, `develop`, `feature/*`
- Ejemplo de rama: `feature/login`
- Realizar commits claros y atómicos
- Mantener la lógica de cada servicio aislada
- Documentar cambios relevantes en el README y en los commits

## Variables de entorno

Ejemplo de `.env` para `bff-service`:

```env
PORT=8000
AUTH_API_URL=http://localhost:8080/api/auth
KPIS_API_URL=http://localhost:8081/api/kpis
ALLOWED_ORIGINS=http://localhost:3000
```

Ejemplo de `.env` para `front-service` (opcional si se añaden variables):

```env
REACT_APP_API_BASE_URL=http://localhost:8000/api
```

## Equipo / Autor

- Nombre: Solange Argomedo - Jose Astorga - Victor Silva


## Notas finales y consideraciones

- Este repositorio está construido como un monorepo de servicios independientes para facilitar pruebas y despliegues paralelos.
- En un entorno productivo, se recomienda agregar una base de datos persistente, manejo de tokens JWT, seguridad de CORS y validaciones adicionales.
- Si se requiere, se puede extender el BFF para proveer caches, autenticación centralizada y versionado de API.
- Mantener documentadas las dependencias y versiones en cada servicio garantiza mayor robustez.

---

`Grupo Cordillera` es una base sólida para continuar la evolución hacia una plataforma empresarial completa con frontend web, BFF, autenticación y métricas centralizadas.
