### Boilerplate ###
FROM node:latest
ENV PORT 80

### STAGE 1: Dependencies
COPY ./clo-angular/package.json ./

# Install node_modules for frontend
RUN npm i -dd && mkdir /clo-angular && cp -R ./node_modules /clo-angular
RUN rm /package.json

# Install node_modules for API
WORKDIR /
COPY ./clo-api/package.json ./clo-api/package-lock.json ./
RUN npm i -dd && mkdir /clo-api && cp -R ./node_modules /clo-api && cp package.json /clo-api

### STAGE 2: Build ###
WORKDIR /clo-angular

# Bring in the source code
COPY ./clo-angular .
RUN $(npm bin)/ng --version && $(npm bin)/ng build --prod
RUN ln --symbolic /clo-angular/dist/clo/* /clo-angular/dist/
RUN ls -l --all --human-readable

### STAGE 3: Server ###
WORKDIR /clo-api

# Server source code
COPY ./clo-api .
RUN echo "$DB_HOST" > /clo-api/.env

CMD ["npm","start"]
