# CLO3 
[Production Site](https://carlyleletters.dukeupress.edu/home)
[Development Site](https://clo.dev.cdhsc.org/home)
For non-technical information about this project, consult the [about-project](https://clo.cdhsc.org/about-project) page on the site itself. 

# Table of Contents
* [Installation](#installation)<br>
* [Contributing](#contributing)<br>
* [Contributors](#contributors)


## <a name="installation">Installation</a>

*While most of these dependencies are installed automatically by executing the scripts in *bin/*, see below for a list of the major dependencies required to build and deploy CLO3. This list is not exhaustive, and one should consult those scripts, as well as the respective *package.json* files for a complete list.*

You will need root access to the machine to build CLO3. Our team currently uses Ubuntu 20.04 for its remote servers.

Attempting the install on your own local machine, especially if you're on Mac, might be difficult. If you're struggling, ask the sysadmins to set up a clean virtual machine for you.

**Dependencies:**

- Git
- python3-pip
- Nodeenv
- Node (^12.18.3)
- MongoDB
- ElasticSearch (^7.8)
- Angular (^9.0.4)
- jquery (^3.4.1)


**Install Dependencies from Package Manager**

Install Git using your system's package manager. See [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](their installation directions). On Debian/Ubuntu based systems, the command is:

`sudo apt-get update`  
`sudo apt-get install git python3-pip certbot python3-certbot-nginx`

This may take awhile, especially on the line *"processing triggers for man-db"*. Be patient.

Clone the repository to your command line:

### The Scripts

The bin/ directory at the root of the project contains all the build scripts. These scripts are named sequentially. Most are small, and do not do more than a few different things. Be sure that you are in the /bin directory before executing the first script. Executing the first script outside of /bin directory may prevent correct configuration of the environment variable.

#### Install Node & Configure Environment Variable

`./A1-configure_nodeenv.sh`

The first script should configure the CLO_ROOT environment variable. However, this change will only propogate after exiting and re-logging into the server (quitting an restarting SSH) or by running the "source" command on your .bashrc file in the terminal (`source ~/.bashrc`).

Before running the next script, ensure the environment variable is set via `echo $CLO_ROOT`.

If it is empty, the environment variable is not set. Check that the necessary "export" line has been appended to your ~/.bashrc file and run `source ~/.bashrc`.

```
$ echo $CLO_ROOT
/home/kennethj/clo3
```

If `echo $CLO_ROOT` still shows that it is empty, you can set it manually:

Find your current path by running `pwd`, then run export `CLO_ROOT=`*your current path here* .

Then run `source ~/.bashrc` again, and `echo $CLO_ROOT` to check that it was correctly set.

This script creates the Nodeenv (https://pypi.org/project/nodeenv/). Activate it manually with:

`source ../env/bin/activate` or `source $CLO_ROOT/env/bin/activate`  

If this doesn't work, you may need to run `./A1-configure_nodeenv.sh` again from the clo3 directory, and then try the above command again.

**Whenever you are working with CLO3, be sure to have the nodeenv activated.**

#### Install Required Node Packages

`./A2-install_dependencies.sh`

The second script decends into 'clo-angular' and 'clo-api' to install the required node packages. Note that the script will prompt the user for returning feedback about Angular to Google. Answer as you please.

#### Configure API

`./A3-api_env_file.sh`

This script creates and populates the .env file in clo-api. You can check that it is correctly configured with `cat $CLO_ROOT/clo-api/.env`.


**Deploy clo-api:**


`./B1-install_mongo.sh`

This script install MongoDB and restores the contents of the database. You can check that is is running via `ps -aux | grep -e "mongo" | grep -v "grep"`.

`./B2-install_elastic.sh`

This script installs elasticsearch to the $CLO_ROOT/clo-api/bin directory. You can check that it is running via `ps -aux | grep -e "elastic" | grep -v "grep"`.

`cd ../clo-api`

`node elasticSync.js`

`nohup ./bin/www &`

This last command runs the equivalent of 'npm start' using the `nohup` ("no hangup") command. The "&" sends the process to the background immediately. This allows the process to continue running after the shell has been detached.

Due to a inconsistency in the output of `nohup`, you may need to press Enter/Return to get another command prompt in your terminal. This is normal.

At this point, your API is running. Ensure it is configured correctly by checking the contents of the logging file with `cat nohup.out`.

```
$ cat nohup.out
Connected to MongoDB at URL: mongodb://127.0.0.1:27017/clo
Connected to Elasticsearch at URL: http://127.0.0.1:9200
```

**Build clo-angular:**

`cd $CLO_ROOT/bin`

`./C1-build_site_PROD.sh`

This script builds the Angular front-end. It also creates a symlink from the build artifact ('dist') to the /srv/ directory as per the LFSH. This is the directory that NGINX points to.

This script also copies the HTTP version of the Nginx config to the '/etc/nginx/sites-available' directory.

Note that this will take awhile to run. Developers often report the longest wait at `92% compiling`. Be patient.

## Deploy CLO

**Configure NGINX**

`cd /etc/nginx/sites-enabled`

`sudo unlink default`

`sudo cp /<path>/<to>/clo3/docs/nginx-configs/clo.dev.HTTP.conf /etc/nginx/sites-available`

Run `ls` to check that this has been done correctly. You should see clo.dev.HTTP.conf .

If you are working on a virtual machine provided by the sysadmin, you will need to change to localhost by doing the following:

Run `sudo vim clo.dev.HTTP.conf`. Type `i` to go into insert mode, and then change server_name to localhost. `esc` and `:wq` to save and exit.

At this point, run `nginx -s reload` and confirm that the config is valid. You can check at this point if the front end is available at *http://<ip-address>*.

Be sure to check the server\_name directive. It defaults to a non-existent clo.dev2.cdhsc.org.

At this point, speak to the DevOps team to setup DNS if you have not already.

**Enable SSL/HTTPS Support:**

`sudo certbot --nginx`

Answer all the questions as given, and be sure to choose the **redirect** option for the final question.
Please note that changes to the DNS can take up to 5 minutes to propogate. Also, make sure your browser is not using a cached version of the site if you are not seeing the changes you expected. It is common to use the "private mode" of a browser for troubleshooting of this type.

`sudo nginx -s reload`

**Webserver Configuration:**

This section is mainly used by the DevOps team.







---

### <a name=contributing>Contributing</a>
Clear and concise commit messages are a must. Let's all shoot for unambiguous language.

>
__~~Making some changes.~~__<br>
__~~Fixed a bug.~~__
>
>___Made a change that fixes rendering errors associated with database field.___
>___Fixed a bug in Authentication Fields.___

Please make your a serious attempt to be both thorough and brief. Describe <em> what </em> changes were made, describe <em> which </em> bug was fixed, etc.

A good rule of thumb is that messages should have a specific object. Also, for new members especially, it could help to format your messages in a way that completes this sentence:

> ___If applied, this commit will...___

All major changes should be documented in the [changelog](docs/CHANGELOG.md). 

If working on a feature branch other than master, you can checkout that branch via `git checkout <branch-name>`. Use the '-b' flag to create a NEW branch. 

### <a name=contributors>Contributors</a>
* **Jerrod Mathis**
* **Caleb Kitzmann**
* **Prithvi Tippabhatla**
* **Joshua Nelson**
* **Kenny Johnson**
* **Ian McDowell**
* **Tyron Schultz**
* **Mitchell Lambert**
* **Stella Masucci**


## Notes:

1. *[**ATTENTION**] It is absolutely important at all times to understand your dependency structure. **It is important to document if a command is run with `sudo`.** It is important to understand whether Node is using a globally installed package, a package it knows to install w/ `npm install`, or if the dependency is not being tracked by node at all.*
