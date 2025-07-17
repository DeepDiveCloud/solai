FROM node:22

# Set the working directory in the container
RUN mkdir /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory

COPY package.json /app/package.json

# Install app dependencies, including Material-UI 5
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .


# Expose the port that the app will run on (adjust if needed)
EXPOSE 5000

# Define the command to start the app
CMD node server.js
