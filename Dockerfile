# Multi-stage build for Node.js + Vite application
# Stage 1: Build the frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the frontend (creates dist/ folder)
RUN npm run build

# Stage 2: Production runtime
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server code
COPY server ./server

# Copy mock data (required by server agents)
COPY src/data ./src/data

# Set production environment
ENV NODE_ENV=production

# Expose port 3001 (internal port for Fly.io)
EXPOSE 3001

# Start the server
CMD ["node", "server/server.js"]
