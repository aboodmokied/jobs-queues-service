FROM node:23.11.0

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# RUN tsc
CMD ["node","dist/index.js"]






# ARG NODE_ENV=production  
# ENV NODE_ENV=${NODE_ENV}

