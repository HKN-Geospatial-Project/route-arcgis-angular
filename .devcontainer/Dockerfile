# Use the Microsoft maintained Node.js image (includes non-root user 'node')
FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

# Install the Angular CLI globally
# This allows you to use 'ng' commands immediately inside the container
RUN npm install -g @angular/cli@21.2.3

# Optional: Install git if you need specific version control features inside
# (The base image usually includes git, but this ensures updates)
RUN apt-get update && apt-get install -y git
