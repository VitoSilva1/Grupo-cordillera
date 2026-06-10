# Kubernetes local con Docker Desktop

Estos manifiestos levantan el stack completo en el namespace `grupo-cordillera`.
Los recursos compartidos quedan en `k8s/`, y cada microservicio Java mantiene sus propios manifiestos dentro de su carpeta para simular repositorios separados.

- `front-web2`
- `api-gateway`
- `bff-service`
- `auth-service`
- `user-service`
- `kpis-service`
- `auth-db`
- `user-db`
- `kpis-db`

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

| Servicio       | Build context                 | Imagen usada por Kubernetes                     |
|----------------|-------------------------------|-------------------------------------------------|
| auth-service   | `./Backend/ms-auth`           | `grupo-cordillera-auth-service:latest`          |
| kpis-service   | `./Backend/ms-kpis`           | `grupo-cordillera-kpis-service:latest`          |
| user-service   | `./Backend/ms-user`           | `grupo-cordillera-user-service:latest`          |
| bff-service    | `./Backend/bff-service`       | `grupo-cordillera-bff-service:latest`           |
| api-gateway    | `./Backend/api-gateway`       | `grupo-cordillera-api-gateway:latest`           |
| front-web2     | `./frontend`                  | `grupo-cordillera-front-web2:latest`            |

Los manifiestos de `k8s/` no necesitan rutas a carpetas de codigo porque despliegan imagenes ya construidas. Docker Desktop Kubernetes puede usar esas imagenes locales porque quedan en el mismo Docker Engine.

## 4. Aplicar manifiestos

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/databases.yaml
kubectl apply -f Backend/ms-auth/k8s/
kubectl apply -f Backend/ms-kpis/k8s/
kubectl apply -f Backend/ms-user/k8s/
kubectl apply -f k8s/apps.yaml
kubectl apply -f k8s/ingress.yaml
```

Verifica estado:

```powershell
kubectl get pods -n grupo-cordillera
kubectl get ingress -n grupo-cordillera
```

## 5. Abrir la aplicacion

```text
http://grupo-cordillera.local
```

El flujo queda:

```text
Browser
  -> Ingress Controller
    -> front-web2
    -> api-gateway (/api/**)
      -> bff-service
        -> auth-service / user-service / kpis-service
```

## Comandos utiles

Logs:

```powershell
kubectl logs -n grupo-cordillera deployment/api-gateway
kubectl logs -n grupo-cordillera deployment/bff-service
kubectl logs -n grupo-cordillera deployment/auth-service
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
kubectl rollout restart deployment/bff-service -n grupo-cordillera
kubectl rollout restart deployment/api-gateway -n grupo-cordillera
kubectl rollout restart deployment/front-web2 -n grupo-cordillera
```

Eliminar el stack:

```powershell
kubectl delete namespace grupo-cordillera
```
