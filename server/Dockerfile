# ---------- Build Stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# ---------- Run Stage ----------
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from build
COPY --from=build /app /app

ENV NODE_ENV=production

ENV FRONTEND_URL=http://localhost:5173

ENV MONGODB_URI=mongodb://root:root@green-mongo-container:27017/greencart?authSource=admin

ENV JWT_SECRET=Gx9R4mP7QvA2ZsK8WJcE5L0N6FHyT3uB

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]

