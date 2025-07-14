# syntax=docker/dockerfile:1.5

# Multi-stage build for React/Vite microadventures frontend
FROM node:20 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies with cache mount for better performance
RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci

# Copy source code
COPY . .

# Build the React/Vite application
RUN npm run build

# Production stage with nginx
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Copy nginx configuration for microadventures
COPY --link nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --link --from=build /usr/src/app/dist/ /usr/share/nginx/html/

# Expose port 8080 (nginx unprivileged default)
EXPOSE 8080

# Health check for the application
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ping || exit 1