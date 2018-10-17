# Carlyle Letters Online (CLO)
Live Version: Under Construction
### Getting Started
---
#### Prerequisites
* [Node](https://nodejs.org/en/) version 8.5.0 or higher
* [NPM](https://www.npmjs.com/) version 5.3.0 or higher
    * [Download Node and NPM](https://nodejs.org/en/)
* [Angular CLI](https://cli.angular.io/) version 1.4.4 or higher (*should be saved in devDependencies*)
    * ```npm install -g @angular/cli@latest```
* [MongoDB](https://docs.mongodb.com/manual/administration/install-community/)
* [Nodemon](https://nodemon.io/)
    * ```npm install -g nodemon```

#### Installing
* Clone this repo
    * ```git clone <awaiting URL>```
* Install Prerequisites (Check the section above)
* ```cd <path>/clo```
    * ```cd clo-api/```
        * ```npm install```
    * ```cd clo-angular/```
        * ```npm install```
* Note: If the npm install throws an error:
    * If it says a module is not installed, run ```npm install --save <module name>```
    * If it says that an invalid character was read at the end of the line, delete the node_module folder and the package-lock.json file and try the ```npm install``` command again
    * If it's a npm permission error, see [here](https://docs.npmjs.com/getting-started/fixing-npm-permissions)


* Create a local database

* Create the environment variable
    * ```cd clo-api/```
        * ```echo "DB_HOST=mongodb://127.0.0.1:27017/clo" >> .env```

#### Git LFS

### Deployment

### Creating Documentation

### Unit Tests

### Built With

### Contributing

### Extended Contributing

### Versioning

### Contributors

### License

### Acknowledgments
