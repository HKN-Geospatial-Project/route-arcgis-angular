FROM node:24-bookworm

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@21.1.5

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the default Angular port
EXPOSE 4200

# Start the Angular server, binding to 0.0.0.0 to allow external access
# --poll 2000 is used to ensure hot-reloading works properly inside Docker volumes
CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "2000"]