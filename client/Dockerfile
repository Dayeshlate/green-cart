# ========== Build stage ===========

FROM node:20-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ========== Run stage ============

FROM node:20-slim

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

ENV VITE_CURRENCY = '₹'

ENV VITE_BACKEND_URL="http://localhost:3000"

EXPOSE 5173

CMD ["serve","-s","dist","-l","5173"]
