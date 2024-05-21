# # Use the Node.js image for the local
# FROM node:16.16.0 AS local

# # Set the working directory. If it doesn't exists, it'll be created
# WORKDIR /app

# # Copy the file `package.json` from current folder
# # inside our image in the folder `/app`
# COPY ./package.json /app/package.json

# # Install pm2 globally
# RUN npm install pm2 -g

# # Install the dependencies
# RUN npm install

# #######################################################

# # Install ionic as a global dependency
# RUN npm install -g ionic

# # Copy the file `frontend/package.json` from current folder
# # inside our image in the folder `/app/frontend`
# COPY ./frontend/package.json /app/frontend/package.json

# # Install the dependencies
# RUN cd frontend && npm install --legacy-peer-deps

# #######################################################

# # Copy all files from current folder
# # inside our image in the folder `/app`
# COPY . /app

# # Command
# ENTRYPOINT ionic build && pm2 start nms/app.js && npm run watch


# ------------------------------------------------------------------
# ------------------------------------------------------------------
# ------------------------------------------------------------------
# Use ffmpeg
# FROM jrottenberg/ffmpeg:3.3-alpine
# Use the Node.js image for the local
FROM node:16.13.0 AS local

# Set the working directory. If it doesn't exists, it'll be created
WORKDIR /app



# Install ffmpeg
# RUN apt update
# RUN apt install ffmpeg -y


# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./package.json /app/package.json

# Install the dependencies
RUN npm install

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./frontend/package.json /app/frontend/package.json

# Install the dependencies
RUN npm install --legacy-peer-deps

# Ionic compile
# CMD cd frontend && ionic build
# Install ionic as a global dependency
 # RUN npm install -g ionic

# Install pm2 globally
# RUN npm install pm2 -g
 

# Copy all files from current folder
# inside our image in the folder `/app`
COPY . /app

# Command
ENTRYPOINT pm2 start nms/app.js && npm run dback
# ENTRYPOINT pm2 start nms/app.js && pm2 start npm --name 'backend:watch' -- run 'watch'