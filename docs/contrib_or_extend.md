**Note:** *These docs are clipped from the original README (now `\docs\deprecated\old-README.md`) and written by the CLO development team ~2019.*

### Contributing
1. **Fork** the repo
2. **Clone** the project to your own machine
3. **Commit** changes to your own branch
4. **Push** your work back up to your fork
5. Submit a **Pull Request** so that we can review your changes

Note: Be sure to merge the latest from "upstream" before making a pull request!

### Extended Contributing (Angular)
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

Update only one specific collection.

* [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/#cmdoption-mongorestore-collection): `sudo mongorestore --db clo --collection <collection> <path>/clo-database/current/clo/<collection>.bson --drop`

#### Updating Volumes

If there are any changes to the volume XML that need to be uploaded to the database or there are issues in the current version of the database, follow these steps:

1. **GOTO** the `clo-utils` folder and check that you have a working `python3` install:
   * `python3 --version`
2. **INSTALL** the required dependencies for the script:
   * First setup a virtual environment if you wish, documentation [here](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)
   * `pip3 install lxml bs4 pymongo`
3. **START** an instance of MongoDB if one is not already running:
   * `sudo mongod`
4. **RUN** the `volume_upload_python3.py` script:
   * `python3 volume_upload_python3.py`

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
* **Prithvi Tippabhatla**
* **Joshua Nelson**
* **Ian McDowell**
* **Tyron Schultz**
