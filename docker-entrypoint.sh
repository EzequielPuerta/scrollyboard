#!/bin/sh
set -e

# node_modules is a volume that may be empty, and the bind-mounted package.json
# can drift from the image, so make sure dependencies are present first.
pnpm install --no-frozen-lockfile

if [ "$NODE_ENV" = "development" ]; then
	echo "› NODE_ENV=development — starting Vite dev server (hot reload)"
	exec pnpm dev --host "${HOST:-0.0.0.0}" --port "${PORT:-5173}"
fi

echo "› NODE_ENV=${NODE_ENV:-production} — building and starting production server"
pnpm build
exec node build
