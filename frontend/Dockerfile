FROM node:lts-alpine3.20 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app
# Must install with package.json for faster caching here else rspack does not work
COPY package.json .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i
# RUN pnpm add -D @tanstack/router-plugin @tanstack/router-devtools
COPY . .
CMD [ "pnpm","dev" ]




######################
#                  NEW






# FROM node:20-slim AS base
# FROM node:lts-alpine3.20 AS base
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
# COPY . /app
# WORKDIR /app

# FROM base AS prod
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --no-frozen-lockfile
# RUN pnpm add @tanstack/react-router
# RUN pnpm add -D @tanstack/router-plugin @tanstack/router-devtools

# FROM base AS build
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
# RUN pnpm add @tanstack/react-router
# RUN pnpm add -D @tanstack/router-plugin @tanstack/router-devtools
# RUN pnpm run build

# FROM base
# COPY --from=prod /app/node_modules /app/node_modules
# COPY --from=build /app/dist /app/dist
# EXPOSE 3000
# CMD [ "pnpm", "dev" ]