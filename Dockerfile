# Stage 1: Build Stage
# This stage installs all dependencies, including devDependencies, to build the app.
FROM node:24.7.0-alpine AS build

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.15.0

# Copy root dependency definition files
COPY pnpm-lock.yaml ./
COPY package.json ./

# Copy the source code for the entire monorepo
COPY . .

# Install all dependencies for the entire monorepo
RUN pnpm install --frozen-lockfile

# Build the specific NestJS application (warehouse-server)
RUN pnpm --filter warehouse-server build

# Prune devDependencies to keep only production modules
RUN pnpm --filter warehouse-server deploy --legacy production

# ---

# Stage 2: Production Stage
# This stage creates a lean image with only the built app and production dependencies.
FROM node:24.7.0-alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the 'build' stage
COPY --from=build /app/production/dist ./dist

# Copy production node_modules from the 'build' stage
COPY --from=build /app/production/node_modules ./node_modules

# Copy the specific package.json for the app
COPY --from=build /app/production/package.json ./package.json

# Expose the port the app will run on. App Engine automatically routes traffic to 8080.
EXPOSE 8080

# The command to start the application.
# It uses 'node' directly, which is more efficient than using pnpm in the final image.
CMD [ "node", "dist/main.js" ]