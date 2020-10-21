FROM node:13.12.0-alpine

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /src/frontend

ENV PATH /src/frontend/node_modules/.bin:$PATH

# Installing dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copying source files
COPY . .

# Running the app
CMD [ "npm", "run", "dev" ]