###################################################################################################################
### STAGE 0: Install Dependencies ###
FROM node:20.9.0-bullseye@sha256:33e271b0c446d289f329aedafc7f57c41b3be1429956a7d1e174cfce10993eda AS dependencies
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Clean install node dependencies defined in package-lock.json excluding dev dependencies
RUN npm ci --legacy-peer-deps

###################################################################################################################

### STAGE 1: Build ###
FROM node:20.9.0-bullseye@sha256:33e271b0c446d289f329aedafc7f57c41b3be1429956a7d1e174cfce10993eda AS build

WORKDIR /app

# Copy the generated dependenices
COPY --from=dependencies /app /app

# Copy source code
COPY . .

# Build the application
RUN ["npm", "run", "build"]

###################################################################################################################

### STAGE 2: Deploy ###
FROM nginx:1.24.0-alpine@sha256:62cabd934cbeae6195e986831e4f745ee1646c1738dbd609b1368d38c10c5519 as deploy

# Project Metadata
LABEL maintainer="Amnish Singh Arora <amnishsingh04@gmail.com>"\
	  description="Dine-A-Night restaurant table reservation web application."

# COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist/dine-a-night-ui /usr/share/nginx/html

# Nginx uses the port 80
EXPOSE 80

# Add a healthcheck layer
HEALTHCHECK --interval=10s --timeout=10s --start-period=10s --retries=3 \
    CMD curl --fail localhost:80 || exit 1

###################################################################################################################
