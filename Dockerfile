### STAGE 1: Build ###
# Label this stage as 'builder'
FROM node:latest
ENV a /clo-angular
ENV e /clo-api
ENV PORT 80

COPY .${a}/package.json ./

# Install node_modules
RUN npm i -dd && mkdir ${a} && cp -R ./node_modules ${a}
RUN npm install -g nodemon

RUN rm /package.json

WORKDIR ${a}

# Bring in the source code
COPY .${a} .
RUN $(npm bin)/ng --version
RUN $(npm bin)/ng build --prod
RUN mv ${a}/dist/clo/* ${a}/dist/
RUN ls -lah

WORKDIR /
### STAGE 2: Server ###

COPY .${e}/package.json .${e}/package-lock.json ./

# Install node_modules
RUN npm i -dd && mkdir ${e} && cp -R ./node_modules ${e} && cp package.json ${e}

WORKDIR ${e}

# Server source code
COPY .${e} .

CMD ["npm","start"]