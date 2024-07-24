# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Serve the React app using a simple static file server
RUN npm install -g serve

# Define the command to run the app
CMD ["serve", "-s", "build"]

# Expose the port the app runs on
EXPOSE 5000

