# Pull from official node 10 image
FROM node:10

# Create a directory where app will be placed
RUN mkdir -p /app

# Change working directory
WORKDIR /app

# Copy dependency definitions
COPY package*.json /app/

# Install dependencies
RUN npm install

# Copy all files to working directory
COPY . /app/

# Expose port
EXPOSE 4200

# Serve app
CMD ["npm", "run", "start:dev"]