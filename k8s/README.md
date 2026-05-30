# Kubernetes local con Docker Desktop

Estos manifiestos levantan el stack completo en el namespace `grupo-cordillera`:

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

Docker Desktop Kubernetes puede usar esas imagenes locales porque quedan en el mismo Docker Engine.

## 4. Aplicar manifiestos

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/config.yaml
kubectl apply -f k8s/databases.yaml
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

Eliminar el stack:

```powershell
kubectl delete namespace grupo-cordillera
```
