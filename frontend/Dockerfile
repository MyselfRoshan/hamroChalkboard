FROM node:lts-alpine3.20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
# Must install with package.json for faster caching here else farm does not work
COPY package.json .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i
RUN pnpm add @rspack/plugin-react-refresh react-refresh -D
RUN pnpm add -D @tanstack/router-plugin @tanstack/router-devtools
COPY . .