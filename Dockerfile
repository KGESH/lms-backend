FROM node:20.3.1-alpine AS base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnmcache,target=/var/pnpm/store \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    pnpm config set store-dir /var/pnpm/store && \
    pnpm config set package-import-method copy && \
    pnpm install --prefer-offline --ignore-scripts --frozen-lockfile

############################################################
############################################################

FROM base AS builder

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

RUN pnpm build

############################################################
############################################################

FROM base AS runner

COPY --from=builder --chown=node:node /app/dist ./dist

RUN pnpm install --prod --frozen-lockfile --ignore-scripts

ENV NODE_ENV production

USER node

CMD ["node", "dist/src/main"]
