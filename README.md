# scrollyboard

Editor visual de scrollytelling. PoC que integra dos paquetes propios — [`@fundar/data-scrolly-telling`](https://www.npmjs.com/package/@fundar/data-scrolly-telling) y [`@fundar/data-chart-telling`](https://www.npmjs.com/package/@fundar/data-chart-telling) — en una interfaz web para construir y previsualizar historias de datos con MongoDB como backend.

## Configuración del entorno

Copiá el archivo de ejemplo y ajustá los valores según el entorno:

```sh
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `NODE_ENV` | `development` para dev, `production` para producción |
| `MONGODB_URI` | URI de conexión a MongoDB |
| `PORT` | Puerto en el que corre la app (default `5173`) |
| `HOST` | Host de escucha (usar `0.0.0.0` en Docker) |
| `PROTOCOL_HEADER` | Header para detectar el protocolo real (útil con ngrok/proxy) |
| `HOST_HEADER` | Header para detectar el host real |

## Levantar con Docker

```sh
# Desarrollo (hot reload)
NODE_ENV=development docker compose up

# Producción (build + servidor node)
NODE_ENV=production docker compose up
```

El modo de arranque lo decide el Dockerfile según `NODE_ENV`: en desarrollo corre el servidor de Vite con hot reload; en producción hace el build y sirve con el adapter-node.
