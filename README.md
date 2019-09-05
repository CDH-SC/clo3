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
    * ```git clone https://github.com/CDH-SC/clo-v3.git```
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
    * A binary BSON dump of the database can be found here: clo/clo-database/dump
    * Ensure Mongo has been started on your local machine:
        * Linux:
            * ```$ sudo service mongod start```
        or
            * ```$ sudo service mongod restart```
        * Mac (if MongoDB was installed via homebrew):
            * ```brew services start mongodb```
            * to restart:
                * ```brew services stop mongodb```
                * ```brew services start mongodb```
    * Use mongorestore to restore the dump file to your local machine
    * MongoDB default port number: 27017
        * ```$ mongorestore <path to backup>```
    * Example:
        * ```$ mongorestore clo/clo-database/dump```
    * Troubleshooting assistance can be found [here](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/)

* Create the environment variable
    * ```cd clo-api/```
        * ```echo "DB_HOST=mongodb://127.0.0.1:27017/clo" >> .env```

### Deployment
---
* 2 Terminal Setup
* Terminal 1 : Runs the Express server
    * ```cd <path>/clo/clo-api/```
    * ```npm start```
    * If it cannot find module: ```npm install --save <module>```
* Terminal 2 : Builds the webapp for development
    * ```cd <path>/clo/clo-angular/```
    * ```ng serve```
* The Carlyle Letters Online application should now be available at http://localhost:4200/

### Creating Documentation

### Unit Tests
---
* Tests are under development

### Built With
* [Angular 2+](https://angular.io/)
* [Node.js](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)
* [Express.js](https://expressjs.com/)

### Contributing
1. **Fork** the repo
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull Request** so that we can review your changes

Note: Be sure to merge the latest from "upstream" before making a pull request!

### Extended Contributing
* **Component** ```ng g component my-new-component```
* **Service** ```ng g service my-new-service```
* **Module** ```ng g module my-new-module```
* **IF YOU DON'T KNOW WHERE SOMETHING GOES, ASK**

* ```npm install [packages] --save``` or ```--save-dev``` for development only

### Extended Contributing (Database Changes)
#### Useful Commands

These commands are useful for [backing up and restoring a database.](https://docs.mongodb.com/manual/tutorial/backup-and-restore-tools/)

* [mongodump](https://docs.mongodb.com/manual/reference/program/mongodump/#bin.mongodump): `sudo mongodump --db clo --out <path>/clo-database/current`
* [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/#bin.mongorestore): `sudo mongorestore <path>/clo-database/current`

#### Adding Albums

If you have received a new album metadata file, take the following steps to make changes to the albums collection:

1. **RENAME** the file so it has the following format :
    * `Volume<albumId>.xlsx` 
    * Example : `Volume2.xlsx`
2. **COPY** the file into the correct albums folder :
    * Each albums folder can be found at : `clo-angular/src/assets/albums/fullsize/`
3. **DROP** the current albums collection from the database :
    * In MongoDB Compass :
        * Click on the clo database in the sidenav
        * Next to the albums collection in the sidenav, click the trash can icon and follow prompts
    * In Mongo Shell (`mongo` or `sudo mongo`):
        * Switch to clo database : `use clo`
        * List the current collections : `show collections`
        * Drop the albums collection : `db.albums.drop()`
        * To confirm the drop : `show collections`
4. **RUN** the album_upload.py script
    * `python album_upload.py`

### Versioning

### Contributors
* **Jerrod Mathis**
* **Caleb Kitzmann**
