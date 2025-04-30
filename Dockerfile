FROM node:23-alpine AS build
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# RUN corepack enable
WORKDIR /app

COPY ./package.json .
RUN --mount=type=cache,target=/root/.npm npm install

# Copy the application code and shared types
COPY . .

# Build
RUN npm run build

# Prod server
FROM node:23-alpine AS prod
WORKDIR /app
COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY --from=build /app/server server/
COPY ./package.json .
EXPOSE ${PORT}
CMD [ "node", "server/index.js" ]
