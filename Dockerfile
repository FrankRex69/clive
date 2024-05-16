
# ------------------------------------------------------------------
# ------------------------------------------------------------------
# ------------------------------------------------------------------
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
RUN npm install -g ionic

# Install ffmpeg
RUN apt update
RUN apt install ffmpeg -y

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./frontend/package.json /app/frontend/package.json
RUN npm install --legacy-peer-deps

# Copy all files from current folder
# inside our image in the folder `/app`
COPY . /app

# ENTRYPOINT FrontEnd with ionic serve
ENTRYPOINT pm2 start nms/app.js && pm2 start build/server.js


FROM node:20 AS production

# Set the working directory. If it doesn't exists, it'll be created
WORKDIR /app

# Install pm2 globally
RUN npm install pm2 -g

# Copy the file `package.json` from current folder
# inside our image in the folder `/app`
COPY ./package.json /app/package.json

# Install the dependencies
RUN npm install

# Install ffmpeg
RUN apt update
RUN apt install ffmpeg -y

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
ENTRYPOINT pm2 start nms/app.js && node build/server.js