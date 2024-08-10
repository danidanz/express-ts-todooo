# Step 1: Build the app
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm exec tsc

# Step 2: Run the app
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY package.json pnpm-lock.yaml ./
COPY .env ./

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 8000

ENV NODE_ENV=production
ENV PORT=8000

CMD ["node", "dist/index.js"]
