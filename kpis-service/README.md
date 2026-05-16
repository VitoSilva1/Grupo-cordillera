# KPIs Service

## 1. Nombre y Descripción del Microservicio

**KPIs Service** es un microservicio especializado en la gestión y cálculo de indicadores clave de rendimiento (Key Performance Indicators) para Grupo Cordillera. Proporciona información estratégica sobre ventas, desempeño de sucursales, canales de distribución y alertas de negocio mediante una API REST.

## 2. Objetivo del Servicio

Centralizar la lógica de cálculo y consulta de indicadores de negocio, permitiendo que la aplicación frontend visualice métricas estratégicas en tiempo real. El servicio actúa como fuente de verdad para datos de rendimiento y proporciona diferentes vistas según el tipo de KPI consultado.

## 3. Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Java | 17 LTS | Lenguaje de programación |
| Spring Boot | 3.3.5 | Framework web y aplicaciones backend |
| Maven | 3.9.9 | Gestor de dependencias y construcción |
| JUnit 5 | (Spring Boot starter) | Testing y pruebas unitarias |
| Docker | Latest | Containerización de la aplicación |
| Eclipse Temurin | 17 JRE | Entorno de ejecución Java |

## 4. Arquitectura y Estructura de Carpetas

```
kpis-service/
├── src/
│   ├── main/
│   │   ├── java/com/grupocordillera/kpis/
│   │   │   ├── KpisServiceApplication.java       # Punto de entrada de Spring Boot
│   │   │   ├── config/                           # Configuración de beans y componentes
│   │   │   ├── controller/
│   │   │   │   ├── KpiController.java            # REST endpoints
│   │   │   │   └── RestExceptionHandler.java     # Manejo centralizado de errores
│   │   │   ├── dto/                              # Data Transfer Objects
│   │   │   │   ├── KpiSummaryResponse.java       # DTO para resumen de KPIs
│   │   │   │   ├── MonthlySalesResponse.java     # DTO para ventas mensuales
│   │   │   │   ├── BranchPerformanceResponse.java # DTO para desempeño de sucursales
│   │   │   │   ├── SalesChannelResponse.java     # DTO para canales de venta
│   │   │   │   └── AlertResponse.java            # DTO para alertas
│   │   │   ├── model/
│   │   │   │   ├── KpiType.java                  # Enum de tipos de KPI
│   │   │   │   └── (Modelos de dominio)          # Entidades del negocio
│   │   │   ├── repository/
│   │   │   │   └── InMemoryKpiRepository.java    # Persistencia en memoria
│   │   │   ├── service/
│   │   │   │   └── KpiQueryService.java          # Lógica de negocio y cálculos
│   │   │   └── service/factory/
│   │   │       └── KpiStrategyFactory.java       # Factory pattern para tipos de KPI
│   │   └── resources/
│   │       └── application.properties            # Configuración de aplicación
│   └── test/
│       └── java/com/grupocordillera/kpis/        # Pruebas unitarias e integración
├── target/                                       # Artefactos compilados
├── Dockerfile                                    # Configuración de containerización
└── pom.xml                                       # Configuración de Maven
```

### Patrón Arquitectónico

El servicio implementa el patrón **Layered Architecture with Query Service Pattern**:

- **Presentation Layer**: `KpiController` - Gestiona solicitudes HTTP y enrutamiento
- **Exception Handling**: `RestExceptionHandler` - Manejo centralizado de errores
- **Business Logic Layer**: `KpiQueryService` - Contiene reglas y cálculos de negocio
- **Strategy Pattern**: `KpiStrategyFactory` - Diferentes estrategias por tipo de KPI
- **Persistence Layer**: `InMemoryKpiRepository` - Acceso a datos
- **Domain Layer**: `KpiType`, Response DTOs - Modelos de negocio

## 5. Requisitos Previos

### Para desarrollo local:
- Java 21 LTS o superior instalado
- Maven 3.6+ instalado
- IDE recomendada: IntelliJ IDEA o VS Code con extensiones Java

### Verificar instalación:
```bash
java -version
mvn -version
```

### Para Docker:
- Docker Desktop instalado
- Acceso a Docker Hub

## 6. Instalación

### Opción A: Desarrollo Local

1. **Clonar/navegar al repositorio:**
```bash
cd kpis-service
```

2. **Instalar dependencias y compilar:**
```bash
mvn clean install
```

3. **Compilar únicamente (sin tests):**
```bash
mvn clean compile
```

### Opción B: Con Docker

```bash
docker build -t grupo-cordillera/kpis-service:latest .
```

## 7. Variables de Entorno

| Variable | Valor por Defecto | Descripción |
|----------|------------------|-------------|
| `spring.application.name` | `kpis-service` | Nombre de la aplicación |
| `server.port` | `8081` | Puerto en el que escucha el servicio |

**Archivo de configuración:** `src/main/resources/application.properties`

Para ambiente de producción, crear `application-prod.properties`:
```properties
spring.application.name=kpis-service
server.port=8081
```

## 8. Cómo Ejecutar Localmente

### Iniciar el servicio en modo desarrollo:

```bash
mvn spring-boot:run
```

El servicio estará disponible en: `http://localhost:8081`

### Verificar que el servicio está activo:

```bash
curl http://localhost:8081/api/kpis/health
```

**Respuesta esperada:**
```json
{
  "status": "UP",
  "service": "kpis-service"
}
```

## 9. Cómo Ejecutar con Docker

### Construcción:
```bash
docker build -t kpis-service:latest .
```

### Ejecución:
```bash
docker run -d \
  --name kpis-service \
  -p 9081:8081 \
  kpis-service:latest
```

### Con docker-compose (desde raíz del proyecto):
```bash
docker-compose up -d kpis-service
```

El servicio estará disponible en: `http://localhost:9081`

## 10. Endpoints y Funcionalidades Principales

### Endpoints de KPIs

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/kpis/health` | Health check del servicio |
| `GET` | `/api/kpis/summary` | Resumen agregado de KPIs principales |
| `GET` | `/api/kpis/sales/monthly` | Ventas mensuales histórico |
| `GET` | `/api/kpis/branches/performance` | Desempeño de cada sucursal |
| `GET` | `/api/kpis/channels` | Ingresos por canal de venta |
| `GET` | `/api/kpis/alerts` | Alertas y condiciones especiales |
| `GET` | `/api/kpis/{type}` | Obtener KPI por tipo específico |

### Detalle de Endpoints

#### 1. **GET /api/kpis/health**

Health check del servicio.

**Response (200 OK):**
```json
{
  "status": "UP",
  "service": "kpis-service"
}
```

#### 2. **GET /api/kpis/summary**

Obtiene un resumen agregado de los KPIs principales del negocio.

**Response (200 OK):**
```json
{
  "totalSales": 1250000,
  "activeUsers": 45,
  "conversionRate": 0.85,
  "averageTicket": 28000,
  "pendingOrders": 12
}
```

**Descripción de campos:**
- `totalSales`: Ventas totales acumuladas en pesos
- `activeUsers`: Usuarios activos en el sistema
- `conversionRate`: Tasa de conversión (0.0 - 1.0)
- `averageTicket`: Promedio de venta por transacción
- `pendingOrders`: Órdenes pendientes de procesamiento

#### 3. **GET /api/kpis/sales/monthly**

Obtiene el historial de ventas mensuales.

**Response (200 OK):**
```json
[
  {
    "month": "Enero",
    "amount": 100000
  },
  {
    "month": "Febrero",
    "amount": 125000
  },
  {
    "month": "Marzo",
    "amount": 150000
  }
]
```

**Uso:** Visualizar tendencias de ventas en gráficos línea o barra

#### 4. **GET /api/kpis/branches/performance**

Desempeño de ventas por sucursal/sede.

**Response (200 OK):**
```json
[
  {
    "name": "Sucursal Centro",
    "sales": 500000,
    "growth": 0.12,
    "target": 450000
  },
  {
    "name": "Sucursal Sur",
    "sales": 400000,
    "growth": 0.08,
    "target": 400000
  },
  {
    "name": "Sucursal Oriente",
    "sales": 350000,
    "growth": -0.05,
    "target": 380000
  }
]
```

**Descripción de campos:**
- `name`: Nombre de la sucursal
- `sales`: Ventas actuales en pesos
- `growth`: Crecimiento respecto periodo anterior (0.0 - 1.0)
- `target`: Meta de ventas para el periodo

#### 5. **GET /api/kpis/channels**

Ingresos desglosados por canal de venta.

**Response (200 OK):**
```json
[
  {
    "name": "Online",
    "revenue": 600000,
    "percentage": 0.48,
    "trend": "up"
  },
  {
    "name": "Tienda Física",
    "revenue": 450000,
    "percentage": 0.36,
    "trend": "stable"
  },
  {
    "name": "Call Center",
    "revenue": 200000,
    "percentage": 0.16,
    "trend": "down"
  }
]
```

**Descripción de campos:**
- `name`: Nombre del canal
- `revenue`: Ingresos del canal en pesos
- `percentage`: Porcentaje del total (0.0 - 1.0)
- `trend`: Tendencia (up, down, stable)

#### 6. **GET /api/kpis/alerts**

Alertas y condiciones especiales que requieren atención.

**Response (200 OK):**
```json
[
  {
    "severity": "high",
    "message": "Ventas por debajo de meta en Sucursal Sur",
    "timestamp": "2026-05-12T10:30:00Z"
  },
  {
    "severity": "medium",
    "message": "Inventario bajo en 5 productos",
    "timestamp": "2026-05-12T09:15:00Z"
  },
  {
    "severity": "low",
    "message": "Mantenimiento programado en sistema",
    "timestamp": "2026-05-12T08:00:00Z"
  }
]
```

**Niveles de severidad:**
- `high` - Crítico, requiere acción inmediata
- `medium` - Importante, recomendado atender pronto
- `low` - Informativo

#### 7. **GET /api/kpis/{type}**

Obtener KPI específico por tipo.

**Tipos disponibles:** (según enum `KpiType`)
- `SUMMARY`
- `MONTHLY_SALES`
- `BRANCH_PERFORMANCE`
- `SALES_CHANNELS`
- `ALERTS`

**Ejemplo:**
```bash
curl http://localhost:8081/api/kpis/SUMMARY
```

## 11. Flujo de Comunicación con Otros Microservicios

```
Frontend (front-web2)
        ↓
   BFF Service
        ↓
KPIs Service (este servicio)
        ↓
Repository (InMemoryKpiRepository)
        ↓
Mock Data / Cálculos
```

### Secuencia de Consulta de Dashboard:

1. **Frontend** realiza `GET /api/dashboard` al **BFF**
2. **BFF** ejecuta `Promise.all()` con 5 endpoints a **KPIs Service**:
   - `GET /api/kpis/summary`
   - `GET /api/kpis/sales/monthly`
   - `GET /api/kpis/branches/performance`
   - `GET /api/kpis/channels`
   - `GET /api/kpis/alerts`
3. **KPIs Service** procesa cada solicitud en paralelo
4. **KPIs Service** retorna respuestas en formato JSON
5. **BFF** agrega las respuestas en un objeto único
6. **Frontend** recibe datos completos y renderiza dashboard

### Independencia de otros servicios:

- KPIs Service **NO depende** de Auth Service directamente
- KPIs Service actúa como **fuente de datos autónoma**
- Las autorizaciones se manejan a nivel de **BFF o Frontend**

## 12. Ejemplos de Uso

### Ejemplo 1: Health Check

```bash
curl http://localhost:8081/api/kpis/health
```

### Ejemplo 2: Obtener resumen de KPIs

```bash
curl http://localhost:8081/api/kpis/summary
```

### Ejemplo 3: Obtener ventas mensuales

```bash
curl http://localhost:8081/api/kpis/sales/monthly | jq
```

### Ejemplo 4: Desempeño de sucursales

```bash
curl http://localhost:8081/api/kpis/branches/performance | jq
```

### Ejemplo 5: Canales de venta

```bash
curl http://localhost:8081/api/kpis/channels | jq
```

### Ejemplo 6: Alertas del sistema

```bash
curl http://localhost:8081/api/kpis/alerts | jq
```

### Ejemplo 7: KPI por tipo específico

```bash
curl http://localhost:8081/api/kpis/MONTHLY_SALES
```

### Ejemplo 8: Con Docker

```bash
# Construir
docker build -t kpis-service:latest .

# Ejecutar
docker run -d -p 8081:8081 kpis-service:latest

# Verificar
curl http://localhost:8081/api/kpis/health
```

## 13. Scripts Disponibles

En `pom.xml` están configurados los siguientes comandos Maven:

| Comando | Descripción |
|---------|-------------|
| `mvn clean` | Limpia el directorio target |
| `mvn compile` | Compila el código fuente |
| `mvn test` | Ejecuta pruebas unitarias |
| `mvn package` | Genera JAR ejecutable |
| `mvn clean package` | Limpia y genera JAR |
| `mvn spring-boot:run` | Ejecuta la aplicación en desarrollo |
| `mvn dependency:tree` | Visualiza árbol de dependencias |
| `mvn clean install` | Limpia, compila, testea e instala |

## 14. Buenas Prácticas Implementadas

### 1. **Inyección de Dependencias**
- Uso de Spring Dependency Injection para desacoplamiento
- Constructor injection en lugar de field injection

### 2. **Patrones de Diseño**
- **Repository Pattern**: Abstracción de acceso a datos
- **Factory Pattern**: `KpiStrategyFactory` para tipos de KPI
- **Layered Architecture**: Separación clara de responsabilidades
- **DTO Pattern**: Transfer Objects para desacoplamiento

### 3. **Manejo de Errores**
- `RestExceptionHandler` centralizado
- Códigos HTTP apropiados (200, 400, 404, 500)
- Respuestas de error estructuradas

### 4. **Tipos de Datos**
- Enum `KpiType` para tipos de KPI validados
- DTOs específicos por endpoint
- Tipado fuerte en Java

### 5. **Testabilidad**
- Tests unitarios para capas de servicio
- Pruebas de controlador REST
- Test data fixtures

### 6. **Configuración Externalizada**
- `application.properties` para configuración
- Facilita diferentes ambientes (dev, test, prod)

### 7. **Documentación**
- Nombres descriptivos de clases y métodos
- Comentarios en lógica compleja
- DTOs documentados

### 8. **Performance**
- Cálculos en memoria para demo
- Preparado para conectar a DB futuro
- Response DTOs optimizados

### 9. **Escalabilidad**
- Factory pattern permite agregar nuevos tipos de KPI
- Arquitectura modular
- Fácil de extender

## 15. Posibles Mejoras Futuras

### Corto Plazo:
1. **Base de datos persistente**: Migrar de InMemory a PostgreSQL/MySQL
2. **Caché**: Redis para cachear KPIs de cálculo pesado
3. **Paginación**: Para endpoints con muchos registros
4. **Filtros**: Por fecha, sucursal, canal, etc.
5. **Proyecciones**: Vistas de solo lectura optimizadas

### Mediano Plazo:
6. **Actualizaciones en tiempo real**: Integración con Kafka/RabbitMQ
7. **Autorización por roles**: Spring Security con @PreAuthorize
8. **Auditoría**: Registro de quién consultó qué KPI
9. **Métricas**: Integrar Micrometer y Prometheus
10. **GraphQL**: Alternativa a REST con query optimization

### Largo Plazo:
11. **Machine Learning**: Predicción de KPIs futuros
12. **Alertas automáticas**: Integración con email/SMS
13. **Data warehouse**: Integración con BI tools
14. **Reportes PDF**: Generación automática de reportes
15. **API pública**: OAuth2 para acceso externo

## 16. Autores e Integrantes

**Proyecto**: Grupo Cordillera - Evaluación Parcial N°2  
**Asignatura**: DSY1106 - Desarrollo Fullstack III  
**Institución**: Duoc UC  
**Equipo**: [Integrantes del equipo]  
**Fecha**: Mayo 2026

## 17. Licencia

Este proyecto es parte de una evaluación académica en Duoc UC. Se permite su uso con fines educativos bajo consentimiento del equipo y la institución.

---

### Documentación Complementaria

- [Swagger/OpenAPI](./docs/swagger.yml) - Especificación OpenAPI (por implementar)
- [Guía de Desarrollo](./docs/DEVELOPMENT.md) - Guía para desarrolladores (por crear)
- [Changelog](./CHANGELOG.md) - Historial de cambios (por crear)

### Soporte y Contacto

Para reportar problemas o sugerencias, crear un issue en el repositorio del proyecto.

**Estado**: En desarrollo  
**Versión**: 0.0.1-SNAPSHOT  
**Última actualización**: Mayo 2026
