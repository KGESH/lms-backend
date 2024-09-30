#!/bin/sh

# inject the NODE_ENV from package.json
source .env.$NODE_ENV

echo "Start restore snapshot for NODE_ENV [$NODE_ENV]"

# restore the snapshot
SNAPLET_TARGET_DATABASE_URL=$DATABASE_URL pnpm dlx @snaplet/snapshot snapshot restore

echo "Done restore snapshot for NODE_ENV [$NODE_ENV]"
