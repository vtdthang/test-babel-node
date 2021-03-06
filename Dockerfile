# Use the official image as a parent image.
FROM node:10.22.1-alpine

# Set the working directory.
WORKDIR /usr/src/app

# Copy the file from your host to your current location.
COPY package.json .

# Run the command inside your image filesystem.
RUN npm install

# Add metadata to the image to describe which port the container is listening on at runtime.
EXPOSE 3033

# Run the specified command within the container.
CMD [ "npm", "run", "dev" ]

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .