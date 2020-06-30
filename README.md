*This document is an accounting of my attempt to install CLOv3 on a new machine with a brand new Linux install.*

*As such, this will enable our team to better understand the current "holes" in our documentation. I will follow the documentation exactly and record how I executed on that step in the README.*

*[**ATTENTION**] It is absolutely important at all times to understand your dependency structure. **It is important to document if a command is run with `sudo`.** It is important to understand whether Node is using a globally installed package, a package it knows to install w/ `npm install`, or if the dependency is not being tracked by node at all.* 


## Prerequisites

- **Install Git**

Install Git using your system's package manager. See [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](their installation directions). On Debian/Ubuntu based systems, te command is: 

`sudo apt-get install git-all`

- **Node, NPM install**
I downloaded Node and NPM (same package) from the official download page on their website (https://nodejs.org/en/). 

```
kennethj@kennethj-ThinkPad-T430:~$ which node
/usr/local/bin/node
kennethj@kennethj-ThinkPad-T430:~$ node --version
v12.16.3
```
```
kennethj@kennethj-ThinkPad-T430:~$ which npm
/usr/local/bin/npm
kennethj@kennethj-ThinkPad-T430:~$ npm --version
6.14.4
kennethj@kennethj-ThinkPad-T430:~$ npm config list
; cli configs
metrics-registry = "https://registry.npmjs.org/"
scope = ""
user-agent = "npm/6.14.4 node/v12.16.3 linux x64"

; node bin location = /home/kennethj/Code/node-v12.16.3-linux-x64/bin/node
; cwd = /home/kennethj
; HOME = /home/kennethj
; "npm config ls -l" to show all defaults.

```
- ** Angular CLI **

*N.b. I do not know why we specify a version number here considering Angular has released 8 major versions since then. Recommend requiring `^9.0.0` as it is the current active version and receiving LTS support.*

`npm install -g @angular/cli@latest`

```
kennethj@kennethj-ThinkPad-T430:~$ cd
kennethj@kennethj-ThinkPad-T430:~$ npm install -g @angular/cli@latest
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
/home/kennethj/Code/node-v12.16.3-linux-x64/bin/ng -> /home/kennethj/Code/node-v12.16.3-linux-x64/lib/node_modules/@angular/cli/bin/ng

> @angular/cli@9.1.4 postinstall /home/kennethj/Code/node-v12.16.3-linux-x64/lib/node_modules/@angular/cli
> node ./bin/postinstall/script.js

? Would you like to share anonymous usage data with the Angular Team at Google
 under
Google’s Privacy Policy at https://policies.google.com/privacy? For more detai
ls and
how to change this setting, see http://angular.io/analytics. No
+ @angular/cli@9.1.4
added 271 packages from 206 contributors in 20.997s
```
- **Install Mongo**

Following: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
```
kennethj@kennethj-ThinkPad-T430:~$ wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
[sudo] password for kennethj: 
OK
kennethj@kennethj-ThinkPad-T430:~$ lsb_release -dc
Description:	Ubuntu 18.04.3 LTS
Codename:	bionic
kennethj@kennethj-ThinkPad-T430:~$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse
kennethj@kennethj-ThinkPad-T430:~$ sudo apt-get update
Hit:1 http://us.archive.ubuntu.com/ubuntu bionic InRelease
Hit:2 http://security.ubuntu.com/ubuntu bionic-security InRelease            
Hit:3 http://us.archive.ubuntu.com/ubuntu bionic-updates InRelease           
Hit:4 http://us.archive.ubuntu.com/ubuntu bionic-backports InRelease         
Ign:5 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 InRelease   
Get:6 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 Release [3,951 B]
Get:7 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 Release.gpg [801 B]
Get:8 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse amd64 Packages [5,290 B]
Get:9 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse arm64 Packages [5,278 B]
Fetched 15.3 kB in 1s (13.1 kB/s)
Reading package lists... Done
kennethj@kennethj-ThinkPad-T430:~$ sudo apt-get install -y mongodb-org
Reading package lists... Done
Building dependency tree       
Reading state information... Done
The following additional packages will be installed:
  mongodb-org-mongos mongodb-org-server mongodb-org-shell mongodb-org-tools
The following NEW packages will be installed:
  mongodb-org mongodb-org-mongos mongodb-org-server mongodb-org-shell
  mongodb-org-tools
0 upgraded, 5 newly installed, 0 to remove and 297 not upgraded.
Need to get 97.7 MB of archives.
After this operation, 296 MB of additional disk space will be used.
Get:1 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse amd64 mongodb-org-shell amd64 4.2.6 [12.1 MB]
Get:2 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse amd64 mongodb-org-server amd64 4.2.6 [18.5 MB]
Get:3 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse amd64 mongodb-org-mongos amd64 4.2.6 [10.2 MB]
Get:4 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse amd64 mongodb-org-tools amd64 4.2.6 [57.0 MB]
Get:5 https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2/multiverse amd64 mongodb-org amd64 4.2.6 [3,532 B]
Fetched 97.7 MB in 22s (4,497 kB/s)                                          
Selecting previously unselected package mongodb-org-shell.
(Reading database ... 181534 files and directories currently installed.)
Preparing to unpack .../mongodb-org-shell_4.2.6_amd64.deb ...
Unpacking mongodb-org-shell (4.2.6) ...
Selecting previously unselected package mongodb-org-server.
Preparing to unpack .../mongodb-org-server_4.2.6_amd64.deb ...
Unpacking mongodb-org-server (4.2.6) ...
Selecting previously unselected package mongodb-org-mongos.
Preparing to unpack .../mongodb-org-mongos_4.2.6_amd64.deb ...
Unpacking mongodb-org-mongos (4.2.6) ...
Selecting previously unselected package mongodb-org-tools.
Preparing to unpack .../mongodb-org-tools_4.2.6_amd64.deb ...
Unpacking mongodb-org-tools (4.2.6) ...
Selecting previously unselected package mongodb-org.
Preparing to unpack .../mongodb-org_4.2.6_amd64.deb ...
Unpacking mongodb-org (4.2.6) ...
Setting up mongodb-org-shell (4.2.6) ...
Setting up mongodb-org-mongos (4.2.6) ...
Processing triggers for man-db (2.8.3-2ubuntu0.1) ...
Setting up mongodb-org-tools (4.2.6) ...
Setting up mongodb-org-server (4.2.6) ...
Adding system user `mongodb' (UID 121) ...
Adding new user `mongodb' (UID 121) with group `nogroup' ...
Not creating home directory `/home/mongodb'.
Adding group `mongodb' (GID 128) ...
Done.
Adding user `mongodb' to group `mongodb' ...
Adding user mongodb to group mongodb
Done.
Setting up mongodb-org (4.2.6) ...

kennethj@kennethj-ThinkPad-T430:~$ echo "mongodb-org hold" | sudo dpkg --set-selections
kennethj@kennethj-ThinkPad-T430:~$ echo "mongodb-org-server hold" | sudo dpkg --set-selections
kennethj@kennethj-ThinkPad-T430:~$ echo "mongodb-org-shell hold" | sudo dpkg --set-selections
kennethj@kennethj-ThinkPad-T430:~$ echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
kennethj@kennethj-ThinkPad-T430:~$ echo "mongodb-org-tools hold" | sudo dpkg --set-selections

```

- **Nodemon**
```
`npm install -g nodemon`

kennethj@kennethj-ThinkPad-T430:~$ npm install -g nodemon
/home/kennethj/Code/node-v12.16.3-linux-x64/bin/nodemon -> /home/kennethj/Code/node-v12.16.3-linux-x64/lib/node_modules/nodemon/bin/nodemon.js

> nodemon@2.0.3 postinstall /home/kennethj/Code/node-v12.16.3-linux-x64/lib/node_modules/nodemon
> node bin/postinstall || exit 0

Love nodemon? You can now support the project via the open collective:
 > https://opencollective.com/nodemon/donate

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.1.2 (node_modules/nodemon/node_modules/chokidar/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

+ nodemon@2.0.3
added 120 packages from 54 contributors in 7.124s

```
- **ElasticSearch v6.8.x**

**Please note: I have extreme reservations about our current understanding of how CLO interfaces with ElasticSearch due to it also being listed as a dependency in the `package.json` file.** 

Installing v.6.8.8 according to: https://www.elastic.co/guide/en/elasticsearch/reference/6.8/zip-targz.html

```
kennethj@kennethj-ThinkPad-T430:~$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.8.8.zip
--2020-05-03 17:25:46--  https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.8.8.zip
Resolving artifacts.elastic.co (artifacts.elastic.co)... 2a04:4e42:45::734, 199.232.34.222
Connecting to artifacts.elastic.co (artifacts.elastic.co)|2a04:4e42:45::734|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 149636528 (143M) [application/zip]
Saving to: ‘elasticsearch-6.8.8.zip’

elasticsearch-6.8.8 100%[=================>] 142.70M  2.21MB/s    in 51s     

2020-05-03 17:26:38 (2.78 MB/s) - ‘elasticsearch-6.8.8.zip’ saved [149636528/149636528]

kennethj@kennethj-ThinkPad-T430:~$ 
kennethj@kennethj-ThinkPad-T430:~$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.8.8.zip.sha512
--2020-05-03 17:26:44--  https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.8.8.zip.sha512
Resolving artifacts.elastic.co (artifacts.elastic.co)... 2a04:4e42:50::734, 199.232.34.222
Connecting to artifacts.elastic.co (artifacts.elastic.co)|2a04:4e42:50::734|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 153 [application/octet-stream]
Saving to: ‘elasticsearch-6.8.8.zip.sha512’

elasticsearch-6.8.8 100%[=================>]     153  --.-KB/s    in 0s      

2020-05-03 17:26:45 (9.72 MB/s) - ‘elasticsearch-6.8.8.zip.sha512’ saved [153/153]

kennethj@kennethj-ThinkPad-T430:~$ shasum -a 512 -c elasticsearch-6.8.8.zip.sha512 
elasticsearch-6.8.8.zip: OK
kennethj@kennethj-ThinkPad-T430:~$ unzip elasticsearch-6.8.8.zip
Archive:  elasticsearch-6.8.8.zip
   creating: elasticsearch-6.8.8/
   ...
   <more output about unzipping the directory>
   ...
   
```

## Installing
- **Clone repository from Github**

`git clone git clone https://github.com/CDH-SC/clo3`

```
kennethj@kennethj-ThinkPad-T430:~$ git clone https://github.com/CDH-SC/clo3
Cloning into 'clo3'...
Username for 'https://github.com': kennethj-usc
Password for 'https://kennethj-usc@github.com': 
remote: Enumerating objects: 18, done.
remote: Counting objects: 100% (18/18), done.
remote: Compressing objects: 100% (17/17), done.
remote: Total 6951 (delta 6), reused 4 (delta 1), pack-reused 6933
Receiving objects: 100% (6951/6951), 1.78 GiB | 5.37 MiB/s, done.
Resolving deltas: 100% (4194/4194), done.
Checking out files: 100% (1579/1579), done.

kennethj@kennethj-ThinkPad-T430:~$ cd clo3/

kennethj@kennethj-ThinkPad-T430:~/clo3$ git status
On branch master
Your branch is up to date with 'origin/master'.

nothing to commit, working tree clean
```

- **Install dependencies with `npm`**

First navigate to `/clo3/npm-api` and install dependencies.

`cd clo-api/`
`npm install`
```
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ npm install 

> ejs@3.0.1 postinstall /home/kennethj/clo3/clo-api/node_modules/ejs
> node ./postinstall.js

Thank you for installing EJS: built with the Jake JavaScript build tool (https://jakejs.com/)


> nodemon@2.0.2 postinstall /home/kennethj/clo3/clo-api/node_modules/nodemon
> node bin/postinstall || exit 0

npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.2 (node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

added 249 packages from 257 contributors and audited 390 packages in 6.786s

3 packages are looking for funding
  run `npm fund` for details

found 2 low severity vulnerabilities
  run `npm audit fix` to fix them, or `npm audit` for details

```

Next, navigate to `npm-angular` and install dependencies. Note, the fact that we willingly accept an error here is extremely suspicious. Recommend reviewing this soon. 

`cd ..`
`cd clo-angular`
`npm install`
```
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-angular$ npm install
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.11 (node_modules/webpack-dev-server/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.11: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.11 (node_modules/watchpack/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.11: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.1 (node_modules/karma/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.1: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})

npm ERR! code EBADPLATFORM
npm ERR! notsup Unsupported platform for fsevents@2.1.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm ERR! notsup Valid OS:    darwin
npm ERR! notsup Valid Arch:  any
npm ERR! notsup Actual OS:   linux
npm ERR! notsup Actual Arch: x64

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/kennethj/.npm/_logs/2020-05-03T21_56_58_117Z-debug.log

```

- **Create and populate a local database.**

Check to ensure `mongo` has been added to Path and has expected version number.

`mongo --version`
```
MongoDB shell version v4.2.6
git version: 20364840b8f1af16917e4c23c1b5f5efd8b352f8
OpenSSL version: OpenSSL 1.1.1  11 Sep 2018
allocator: tcmalloc
modules: none
build environment:
    distmod: ubuntu1804
    distarch: x86_64
    target_arch: x86_64
```

`sudo systemctl start mongod.service `

Check to ensure the database is running with the `status` subcommand for `systemctl`/`service` (machine dependent):

`sudo systemctl status mongod.service`
```
kennethj@kennethj-ThinkPad-T430:~$ sudo systemctl status mongod.service 
● mongod.service - MongoDB Database Server
   Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset
   Active: active (running) since Sun 2020-05-03 18:03:13 EDT; 4s ago
     Docs: https://docs.mongodb.org/manual
 Main PID: 6827 (mongod)
   CGroup: /system.slice/mongod.service
           └─6827 /usr/bin/mongod --config /etc/mongod.conf

May 03 18:03:13 kennethj-ThinkPad-T430 systemd[1]: Started MongoDB Database Service
```
Navigate to `clo3/clo-database/current/` directory.

`cd ..`
`cd clo-database/current/`

Use the `mongorestore` command to populate your database from BSON dump. 

`mongorestore -d clo clo/` *Output excluded because extremely verbose.*

- **Create and store environment variables in .env file.**

Navigate to `clo-api/` directory:

`cd ../..` (*If still in database directory from previous step*.)
`cd clo-api/`

Create .env file and append environment variables for Mongo and ElasticSearch. 
`touch .env`
`echo "DB_HOST=mongodb://127.0.0.1:27017/clo" >> .env`
`echo "ES_HOST=http://127.0.0.1:9200" >> .env`

```
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ touch .env
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ 
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ echo "DB_HOST=mongodb://127.0.0.1:27017/clo" >> .env
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ 
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ echo "ES_HOST=http://127.0.0.1:9200" >> .env
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ cat .env 
DB_HOST=mongodb://127.0.0.1:27017/clo
ES_HOST=http://127.0.0.1:9200
```

## Deploy and Run

- **Run elasticsearch**
TK: Consider running ElasticSearch as a service or detatched from terminal. 

Navigate to ES install directory (mine is in my user's home directory) and run the executable:

`cd ~/elasticsearch-6.8.8`
`./bin/elasticsearch -d`

This starts ElasticSearch as a daemon.

Leave this running in the terminal. 

- **Synchronize ElasticSearch with Mongo:**

*With ElasticSearch running in another terminal...*

`cd <...>/clo3/clo-api`
`node elasticSync.js`

N.b. This script throws an exception `Finished Synchronization`. Please refactor. Exceptions should not handle valid script execution. 
```
kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ node elasticSync.js 
(node:12397) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
(node:12397) DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.
mapping created!
{
  properties: {
    letters: { type: 'nested', properties: [Object], include_in_parent: true }
  }
}
46
46
1
2
<n.b. SKIPPING SOME OUTPUT>
45
indexed 46 documents!

/home/kennethj/clo3/clo-api/elasticSync.js:116
    throw 'Finished Synchronization';
    ^
Finished Synchronization
(Use `node --trace-uncaught ...` to show where the exception was thrown)
```

- **Run clo-api.**

`cd clo-api/` (if not already there)
`npm start`

```kennethj@kennethj-ThinkPad-T430:~/clo3/clo-api$ npm start

> clo-api@1.0.0 start /home/kennethj/clo3/clo-api
> nodemon ./bin/www

[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node ./bin/www`
Connected to MongoDB at URL: mongodb://127.0.0.1:27017/clo
Connected to Elasticsearch at URL: http://127.0.0.1:9200
<...>
```
Be aware that this command is non-terminating. Keep terminal open or send process to background. 

- **Build and Serve Angular Frontend:**

In a different terminal, if necessary, navigate to `clo-angular` and serve the frontend to your localhost (by default).

`cd clo-angular`
`ng serve`

By default, your site will be served to [localhost:4200](localhost:4200) . 

 
---

### Contributors
* **Jerrod Mathis**
* **Caleb Kitzmann**
* **Prithvi Tippabhatla**
* **Joshua Nelson**
* **Kenny Johnson**
* **Ian McDowell**
* **Tyron Schultz**

---

*Documentation about contributing or extending CLO (originally found in bottom of the new-deprecated README (still available at `docs/deprecated/old-README.md`) can be found in the `docs/` folder (`docs/contrib-or-extend.me`).*

