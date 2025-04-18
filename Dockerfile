FROM node:23.11.0 as production

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g rimraf
COPY . .


# for development
# CMD ["npm","run","dev"]

# for production
ARG NODE_ENV=production  
ENV NODE_ENV=${NODE_ENV}
# Clean old build and compile
RUN npm run build
CMD ["node","dist/index.js"]



FROM node:23.11.0 as dev

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .


# for development
CMD ["npm","run","dev"]










