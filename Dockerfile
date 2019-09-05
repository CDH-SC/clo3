### STAGE 1: Build ###
# Label this stage as 'builder'
FROM node:latest
ENV PORT 80

COPY ./clo-angular/package.json ./

# Install node_modules
RUN npm i -dd && mkdir /clo-angular && cp -R ./node_modules /clo-angular
RUN npm install -g nodemon

RUN rm /package.json

WORKDIR /clo-angular

# Bring in the source code
COPY ./clo-angular .
RUN $(npm bin)/ng --version
RUN $(npm bin)/ng build --prod
RUN mv /clo-angular/dist/clo/* /clo-angular/dist/
RUN ls -lah

WORKDIR /
### STAGE 2: Server ###

COPY ./clo-api/package.json ./clo-api/package-lock.json ./

# Install node_modules
RUN npm i -dd && mkdir /clo-api && cp -R ./node_modules /clo-api && cp package.json /clo-api

WORKDIR /clo-api

# Server source code
COPY ./clo-api .
RUN echo "$DB_HOST" > /clo-api/.env

CMD ["npm","start"]
