# Front-Web2 - Frontend Grupo Cordillera

## 1. Nombre y Descripción del Microservicio

**Front-Web2** es la aplicación frontend responsable de proporcionar la interfaz de usuario moderna y responsiva para la plataforma Grupo Cordillera. Desarrollada con React 19 y TypeScript, ofrece una experiencia de usuario intuitiva para gestionar autenticación, visualizar KPIs, alertas y reportes de negocio.

## 2. Objetivo del Servicio

Proporcionar una interfaz web profesional que permita a los usuarios finales (gerentes, supervisores, vendedores) interactuar de forma segura con el sistema de información de Grupo Cordillera. El frontend implementa flujos de autenticación, visualización de dashboards, análisis de KPIs y alertas en tiempo real.

## 3. Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| React | 19.2.5 | Librería de UI con hooks modernos |
| TypeScript | 6.0.2 | Tipado estático para JavaScript |
| Vite | 8.0.10 | Build tool y dev server |
| Tailwind CSS | 4.2.4 | Framework de CSS utility-first |
| Lucide React | 1.11.0 | Librería de iconos |
| Recharts | 3.8.1 | Librería para gráficos/charts |
| Wouter | 3.9.0 | Router ligero para SPA |
| Node.js | 22 (Alpine) | Runtime en Docker |
| Nginx | 1.27 (Alpine) | Servidor web para producción |
| Docker | Latest | Containerización |
| ESLint | 10.2.1 | Linting de código |

## 4. Arquitectura y Estructura de Carpetas

```
front-web2/
├── src/
│   ├── main.tsx                          # Punto de entrada React
│   ├── App.tsx                           # Componente raíz de la aplicación
│   ├── App.css                           # Estilos globales
│   ├── index.css                         # Estilos base
│   ├── components/
│   │   ├── Header.tsx                    # Encabezado con usuario y logout
│   │   ├── Sidebar.tsx                   # Navegación lateral
│   │   ├── Login.tsx                     # Formulario de autenticación
│   │   └── KpiCard.tsx                   # Componente para visualizar KPI
│   ├── views/
│   │   ├── Dashboard.tsx                 # Vista principal con datos agregados
│   │   ├── KpisView.tsx                  # Vista detallada de KPIs
│   │   └── AlertsView.tsx                # Vista de alertas del sistema
│   ├── services/
│   │   ├── authService.ts                # API calls para autenticación
│   │   ├── userService.ts                # API calls para usuarios
│   │   └── mockApi.ts                    # Mock data para desarrollo
│   ├── types/
│   │   └── user.ts                       # Tipos TypeScript compartidos
│   └── assets/                           # Recursos estáticos (imágenes, etc)
├── public/
│   └── avatars/                          # Imágenes de avatares de usuarios
├── dist/                                 # Build output (generado)
├── index.html                            # HTML principal
├── vite.config.ts                        # Configuración de Vite
├── tsconfig.json                         # Configuración TypeScript
├── tsconfig.app.json                     # Configuración TypeScript app
├── tsconfig.node.json                    # Configuración TypeScript build
├── eslint.config.js                      # Configuración ESLint
├── tailwind.config.js                    # Configuración Tailwind CSS
├── nginx.conf                            # Configuración Nginx para producción
├── Dockerfile                            # Configuración Docker multi-stage
├── package.json                          # Dependencias y scripts
└── package-lock.json                     # Lock de dependencias
```

### Patrón Arquitectónico

El frontend implementa la arquitectura **Component-Based with Service Layer**:

```
┌─────────────────────────────────┐
│         App Component           │
│  (Router y estado de sesión)    │
└──────────────┬──────────────────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼───┐     ┌───▼────┐
    │ Login │     │Layout   │
    └───┬───┘     └───┬─────┘
        │             │
        │      ┌──────┼──────┐
        │      │      │      │
      ┌─▼──┐ ┌─▼──┐ ┌─▼──┐ ┌─▼────┐
      │Auth│ │KPIs│ │Dash│ │Alerts│
      └─┬──┘ └─┬──┘ └─┬──┘ └──┬───┘
        │      │      │       │
        └──────┴──────┴───┬───┘
                         │
                    ┌────▼────┐
                    │ Services│
                    │  (API)  │
                    └────┬────┘
                         │
                    ┌────▼──────┐
                    │  BFF API  │
                    └───────────┘
```

## 5. Requisitos Previos

### Para desarrollo local:
- Node.js 20+ instalado (recomendado: 22)
- npm 10+ o yarn
- IDE: VS Code con extensiones React/TypeScript
- Git para control de versiones

### Verificar instalación:
```bash
node --version
npm --version
```

### Para Docker:
- Docker Desktop instalado
- Acceso a Docker registry

## 6. Instalación

### Opción A: Desarrollo Local

1. **Navegar al directorio del servicio:**
```bash
cd front-web2
```

2. **Instalar dependencias:**
```bash
npm install
# o
npm ci  # instalación reproducible
```

3. **Configurar variables de entorno (si es necesario):**
```bash
# Las variables se pueden configurar en vite.config.ts
# VITE_USERS_API_URL se pasa en build time
```

### Opción B: Con Docker

```bash
docker build \
  --build-arg VITE_USERS_API_URL=http://localhost:8000/api \
  -t grupo-cordillera/front-web2:latest .
```

## 7. Variables de Entorno

### En Vite (variables prefijadas con VITE_):

| Variable | Valor por Defecto | Descripción |
|----------|------------------|-------------|
| `VITE_USERS_API_URL` | `http://localhost:8000/api` | URL base del BFF para API calls |

### Configuración en build:

```bash
# En desarrollo
VITE_USERS_API_URL=http://localhost:8000/api npm run dev

# En Docker (arg)
docker build --build-arg VITE_USERS_API_URL=http://bff:8000/api .
```

### En docker-compose.yml:

```yaml
build:
  context: ./front-web2
  args:
    VITE_USERS_API_URL: http://localhost:8000/api
```

## 8. Cómo Ejecutar Localmente

### Modo Desarrollo (Vite):

```bash
npm run dev
```

Salida esperada:
```
  VITE v8.0.10  ready in 345 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

El frontend estará disponible en: `http://localhost:5173`

### Verificar conexión con BFF:

1. Asegúrate que el BFF corre en `http://localhost:8000`
2. En el login, intenta con `usuario: vendedor` y `contraseña: 1234`

## 9. Cómo Ejecutar con Docker

### Construcción:
```bash
docker build \
  --build-arg VITE_USERS_API_URL=http://localhost:8000/api \
  -t front-web2:latest .
```

### Ejecución:
```bash
docker run -d \
  --name front-web2 \
  -p 5173:80 \
  front-web2:latest
```

### Con docker-compose:
```bash
# Desde la raíz del proyecto
docker-compose up -d front-web2
```

El frontend estará disponible en: `http://localhost:5173`

### Notas sobre Docker:
- El Dockerfile usa multi-stage build (Node para build, Nginx para servir)
- Nginx está configurado para SPA routing
- La imagen final es muy pequeña (~10MB)

## 10. Componentes y Funcionalidades Principales

### Componentes Core

| Componente | Propósito | Props |
|-----------|----------|-------|
| `<Login />` | Formulario de autenticación | `onLogin: (user) => void` |
| `<Header />` | Encabezado con info de usuario | `user: UserProfile`, `onLogout: () => void` |
| `<Sidebar />` | Navegación entre vistas | - |
| `<KpiCard />` | Visualiza un KPI individual | `label, value, unit, trend` |

### Vistas Principales

| Vista | Ruta | Descripción |
|------|------|-------------|
| Login | `/` (no autenticado) | Pantalla de inicio de sesión |
| Dashboard | `/` | Dashboard principal con resumen |
| KPIs | `/kpis` | Vista detallada de indicadores |
| Alertas | `/alertas` | Gestión de alertas del sistema |
| Reportes | `/reportes` | Módulo en construcción |

### Flujo de Autenticación

1. **Login:** Usuario ingresa credenciales
2. **Validación:** Se envía a `POST /api/auth/login` (vía BFF)
3. **Sesión:** Se almacena usuario en `sessionStorage`
4. **Acceso:** App renderiza layout y vistas protegidas
5. **Logout:** Se limpia sesión y vuelve a login

## 11. Flujo de Comunicación con Otros Microservicios

```
Browser (Front-Web2)
        ↓
   fetch/axios
        ↓
   BFF Service (CORS)
   /            \
  ↓              ↓
Auth Service   KPIs Service
  ↓              ↓
  \            /
   ▼ ▼ ▼ ▼ ▼ ▼
Response JSON
        ↓
React State
        ↓
DOM Render
```

### Endpoints Consumidos

**Vía BFF en `http://localhost:8000`:**

```javascript
// Autenticación
POST /api/auth/login
POST /api/auth/register
GET /api/auth/users/me
GET /api/auth/users/mock?role=Vendedor

// KPIs
GET /api/dashboard
GET /api/kpis/summary
GET /api/kpis/sales/monthly
GET /api/kpis/branches/performance
GET /api/kpis/channels
GET /api/kpis/alerts
```

## 12. Ejemplos de Uso

### Ejemplo 1: Ejecutar en desarrollo

```bash
cd front-web2
npm install
npm run dev
# Acceder a http://localhost:5173
```

### Ejemplo 2: Login desde la UI

1. Abrir `http://localhost:5173`
2. Seleccionar rol: "Vendedor"
3. Ingresar usuario: `vendedor` y contraseña: `1234`
4. Click en "Ingresar"
5. Ver dashboard con KPIs

### Ejemplo 3: Llamadas a API desde la consola

```javascript
// En la consola del navegador, después de autenticado
const user = JSON.parse(sessionStorage.getItem('grupo-cordillera-user'));
console.log(user);

// Obtener dashboard
fetch('http://localhost:8000/api/dashboard')
  .then(r => r.json())
  .then(d => console.log(d));
```

### Ejemplo 4: Build para producción

```bash
npm run build
# Genera /dist con archivos optimizados
# Servir con Nginx o static server
```

### Ejemplo 5: Linting del código

```bash
npm run lint
# Verifica errores de ESLint
```

## 13. Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia dev server con HMR (hot reload) |
| `npm run build` | Crea build optimizado en /dist |
| `npm run preview` | Previsualiza build producción localmente |
| `npm run lint` | Verifica código con ESLint |
| `npm install` | Instala dependencias |
| `npm ci` | Instalación limpia reproducible |
| `npm audit` | Verifica vulnerabilidades |
| `npm outdated` | Verifica paquetes desactualizados |

## 14. Buenas Prácticas Implementadas

### 1. **TypeScript Strict**
- Tipado completo de componentes y funciones
- Tipos compartidos en `/types`
- No usar `any`

### 2. **Component Composition**
- Componentes funcionales con hooks
- Reutilización de componentes
- Props bien tipadas

### 3. **State Management**
- `useState` para estado local
- `sessionStorage` para sesión persistente
- Datos derivados computados

### 4. **Separación de Responsabilidades**
- Services en `/services` para API calls
- Types en `/types` para definiciones
- Components en `/components` para UI
- Views en `/views` para páginas

### 5. **Routing**
- Wouter para SPA routing ligero
- Rutas protegidas según autenticación
- Fallback para rutas no encontradas

### 6. **Styling**
- Tailwind CSS para utilities
- CSS Modules cuando es necesario
- Consistencia visual

### 7. **Error Handling**
- Try-catch en API calls
- Mensajes de error amigables
- Fallbacks en visualización

### 8. **Accesibilidad**
- Semántica HTML adecuada
- Labels para inputs
- ARIA donde es relevante

### 9. **Performance**
- Code splitting automático con Vite
- Optimización de imágenes
- Lazy loading de componentes

### 10. **Testing** (por implementar)
- Jest para unit tests
- React Testing Library para component tests
- E2E tests con Cypress/Playwright

## 15. Posibles Mejoras Futuras

### Corto Plazo:
1. **Tests unitarios**: Jest + React Testing Library
2. **Error boundaries**: Manejo de errores en UI
3. **Loading states**: Spinners mientras cargan datos
4. **Form validation**: Validación de inputs mejorada
5. **Dark mode**: Toggle entre temas

### Mediano Plazo:
6. **State management**: Redux/Zustand para estado global
7. **Paginación**: Implementar en listados
8. **Filtros avanzados**: Multi-select, date range, etc
9. **Exportación**: Descargar reportes PDF/Excel
10. **Internacionalización**: i18n para múltiples idiomas

### Largo Plazo:
11. **Real-time updates**: WebSocket para datos en vivo
12. **PWA**: Progressive Web App capabilities
13. **Offline mode**: Service Workers para offline
14. **Advanced charts**: Gráficos más complejos
15. **Notificaciones**: Toast/snackbar system

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

- [Guía de Componentes](./docs/COMPONENTS.md) - Catálogo de componentes
- [Guía de Desarrollo](./docs/DEVELOPMENT.md) - Guía para desarrolladores
- [Styling Guide](./docs/STYLING.md) - Guía de Tailwind CSS

### Soporte y Contacto

Para reportar problemas o sugerencias, crear un issue en el repositorio del proyecto.

**Estado**: En desarrollo  
**Versión**: 0.0.0  
**Última actualización**: Mayo 2026
