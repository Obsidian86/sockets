FROM node:12.19.1
WORKDIR /code
COPY package*.json ./
RUN npm install
# RUN npm install -g nodemon
# For prod
# RUN npm ci --only=production
COPY ./content ./src
CMD ["node", "src/index.js"]