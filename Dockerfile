# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY Frontend/package*.json ./
RUN npm install

# Copy source files and build project
COPY Frontend/ ./
RUN npm run build

# Production stage using Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
