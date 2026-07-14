# Kubernetes local con Docker Desktop

Estos manifiestos levantan el stack completo en el namespace `grupo-cordillera`.
Los recursos compartidos quedan en `k8s/`, y cada microservicio Java mantiene sus propios manifiestos dentro de su carpeta para simular repositorios separados.

Recursos principales:

- `front-web2`
- `api-gateway`
- `bff-service`
- `auth-service`
- `user-service`
- `kpis-service`
- `report-service`
- `user-db`
- `kpis-db`
- `report-db`

## 1. Habilitar Kubernetes e Ingress Controller

En Docker Desktop:

1. Settings
2. Kubernetes
3. Enable Kubernetes
4. Apply & Restart

Instala `ingress-nginx`:

```powershell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.12.1/deploy/static/provider/cloud/deploy.yaml
```

Espera a que el controller este listo:

```powershell
kubectl wait --namespace ingress-nginx `
  --for=condition=ready pod `
  --selector=app.kubernetes.io/component=controller `
  --timeout=120s
```

## 2. Agregar host local

Edita `C:\Windows\System32\drivers\etc\hosts` como administrador y agrega:

```text
127.0.0.1 grupo-cordillera.local
```

## 3. Construir imagenes locales

Desde la raiz del proyecto:

```powershell
docker compose build
```

El `docker-compose.yml` construye las imagenes desde la estructura actual del monorepo:

| Servicio | Build context | Imagen usada por Kubernetes |
|---|---|---|
| auth-service | `./backend/ms-auth` | `grupo-cordillera-auth-service:latest` |
| kpis-service | `./backend/ms-kpis` | `grupo-cordillera-kpis-service:latest` |
| user-service | `./backend/ms-user` | `grupo-cordillera-user-service:latest` |
| report-service | `./backend/ms-report` | `grupo-cordillera-report-service:latest` |
| bff-service | `./backend/bff` | `grupo-cordillera-bff-service:latest` |
| api-gateway | `./backend/api-gateway` | `grupo-cordillera-api-gateway:latest` |
| front-web2 | `./frontend` | `grupo-cordillera-front-web2:latest` |

Los manifiestos de `k8s/` no necesitan rutas a carpetas de codigo porque despliegan imagenes ya construidas. Docker Desktop Kubernetes puede usar esas imagenes locales porque quedan en el mismo Docker Engine.

## 4. Aplicar manifiestos

La forma recomendada es usar Kustomize desde la raiz:

```powershell
kubectl apply -k .
```

Si prefieres hacerlo por etapas:

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/databases.yaml
kubectl apply -f backend/ms-auth/k8s/
kubectl apply -f backend/ms-kpis/k8s/
kubectl apply -f backend/ms-user/k8s/
kubectl apply -f backend/ms-report/k8s/
kubectl apply -f k8s/apps.yaml
kubectl apply -f k8s/ingress.yaml
```

Verifica estado:

```powershell
kubectl get pods -n grupo-cordillera
kubectl get svc -n grupo-cordillera
kubectl get ingress -n grupo-cordillera
```

## 5. Abrir la aplicacion

```text
http://grupo-cordillera.local
```

El flujo queda:

```text
Browser
  -> Ingress nginx
    -> front-web2 para /
    -> api-gateway para /api
      -> bff-service
        -> auth-service
        -> user-service
        -> kpis-service
        -> report-service
```

Bases de datos internas:

```text
user-service -> user-db:5432
kpis-service -> kpis-db:5432
report-service -> report-db:5432
```

## Observabilidad

GlitchTip no se levanta dentro de Kubernetes. Se levanta aparte con Docker Compose:

```powershell
docker compose -f docker-compose-glitchtip.yml up -d
```

GlitchTip publica `localhost:8000`. Ese puerto tambien lo usa el BFF si levantas el proyecto completo con `docker compose up`, por lo que la combinacion recomendada para la demo es GlitchTip en Docker Compose y la aplicacion en Kubernetes.

El frontend usa un DSN compilado con `localhost:8000` porque corre en el navegador. El BFF usa `GLITCHTIP_DSN` desde `k8s/config.yaml` con `host.docker.internal:8000` para llegar al GlitchTip local desde el pod.

Los microservicios Java no tienen SDK Sentry activo en el `pom.xml`; sus logs se revisan con `kubectl logs`.

## Comandos utiles

Logs:

```powershell
kubectl logs -n grupo-cordillera deployment/front-web2 -f
kubectl logs -n grupo-cordillera deployment/api-gateway -f
kubectl logs -n grupo-cordillera deployment/bff-service -f
kubectl logs -n grupo-cordillera deployment/auth-service -f
kubectl logs -n grupo-cordillera deployment/user-service -f
kubectl logs -n grupo-cordillera deployment/kpis-service -f
kubectl logs -n grupo-cordillera deployment/report-service -f
```

Metricas de negocio que emite el BFF:

```text
business_metric=login_success
business_metric=report_created
```

Eventos del namespace:

```powershell
kubectl get events -n grupo-cordillera --sort-by=.lastTimestamp
```

Describir un pod con problemas:

```powershell
kubectl describe pod -n grupo-cordillera <nombre-del-pod>
```

Reiniciar un deployment:

```powershell
kubectl rollout restart deployment/api-gateway -n grupo-cordillera
```

Si reconstruyes imagenes con `docker compose build` usando el mismo tag `:latest`, reinicia los deployments para que Kubernetes vuelva a crear los pods:

```powershell
kubectl rollout restart deployment/auth-service -n grupo-cordillera
kubectl rollout restart deployment/kpis-service -n grupo-cordillera
kubectl rollout restart deployment/user-service -n grupo-cordillera
kubectl rollout restart deployment/report-service -n grupo-cordillera
kubectl rollout restart deployment/bff-service -n grupo-cordillera
kubectl rollout restart deployment/api-gateway -n grupo-cordillera
kubectl rollout restart deployment/front-web2 -n grupo-cordillera
```

Eliminar el stack:

```powershell
kubectl delete namespace grupo-cordillera
```
