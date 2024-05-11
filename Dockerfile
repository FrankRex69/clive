
# ------------------------------------------------------------------
# ------------------------------------------------------------------
# ------------------------------------------------------------------
# Use ffmpeg
# FROM jrottenberg/ffmpeg:3.3-alpine
# Use the Node.js image for the local
FROM node:20 AS local

# Set the working directory. If it doesn't exists, it'll be created
WORKDIR /app

# Install pm2 globally
RUN npm install pm2 -g

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./package.json /app/package.json

# Install the dependencies
RUN npm install


# Ionic compile
# CMD cd frontend && ionic build
# Install ionic as a global dependency
#RUN npm install -g ionic



# Install ffmpeg
RUN apt update
RUN apt install ffmpeg -y

# Install the dependencies
#RUN npm install

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./frontend/package.json /app/frontend/package.json
RUN npm install --legacy-peer-deps


# Copy all files from current folder
# inside our image in the folder `/app`
COPY ./nms /app/nms
COPY ./build /app/build
COPY ./frontend/www /app/frontend/www

# Command
# ENTRYPOINT npm run watch
ENTRYPOINT pm2 start nms/app.js && node build/server.js
# ENTRYPOINT pm2 start nms/app.js && pm2 start npm --name 'backend:watch' -- run 'watch'