# Pull from official node 10 image
FROM node:10

# Create a directory where app will be placed
RUN mkdir -p /usr/src/app

# Change working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json /usr/src/app/

# Install dependencies
RUN npm install

# Copy all files to working directory
COPY . /usr/src/app/

# Expose port
EXPOSE 3000

# Serve app
CMD ["npm", "run", "start:dev"]
