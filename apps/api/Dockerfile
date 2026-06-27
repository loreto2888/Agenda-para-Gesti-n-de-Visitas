FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm install --workspace apps/api --include-workspace-root
COPY apps/api apps/api
RUN npm run build --workspace apps/api

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
RUN npm install --workspace apps/api --include-workspace-root --omit=dev
COPY --from=build /app/apps/api/dist apps/api/dist
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]