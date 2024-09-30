#!/bin/sh

# inject the NODE_ENV from package.json
source .env.$NODE_ENV

echo "Start capturing snapshot for NODE_ENV [$NODE_ENV]"

# capture the snapshot
SNAPLET_SOURCE_DATABASE_URL=$DATABASE_URL pnpm dlx @snaplet/snapshot snapshot capture

echo "Done capturing snapshot for NODE_ENV [$NODE_ENV]"
