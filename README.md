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

It's recommended that you check out all the scripts before running them to get a general sense of what's going on. Opening them in a different window and then closing that window after moving on from the script is a good idea. Let's check out the first one in a different window. Right click the link and choose the option "open in a different window:"<a href="bin/A1-configure_nodeenv.sh" target="_blank">the first script.</a>


The first script serves two important functions. First, it configure the CLO_ROOT environment variable. Second, it creates the Node environment. 
Configuring a variable initially is only tentative. The change in our bash configuration file  will only propogate after exiting and re-logging into the server (quitting and restarting SSH) or by running the "source" command on your .bashrc file in the terminal (`source ~/.bashrc`).

`./A1-configure_nodeenv.sh`

Before running the next script, ensure the environment variable is set via `echo $CLO_ROOT`.

<!-- moved this output block above following sentence (it was below initially), it makes more logical sense here? -->
```
$ echo $CLO_ROOT
/home/kennethj/clo3
```

If it is empty, the environment variable is not set. Check that the necessary "export" line has been appended to your ~/.bashrc file. Let's issue a command to quickly do this.
<!-- need to ask someone who's not on mac whether or not the tilde symbol is alias for home directory. b/c if it's not then this command won't uniformly work like this -->
`tail -r ~/.bashrc`
```
$ tail -r ~/.bashrc 

export CLO_ROOT="/home/mitchelllambert/clo3"

alias python=...
PS1=...
```

The tail command just entered a process. We'll have to exit out before moving on. Doing so is quite simple.

`q`

If you do not see the export statement at the bottom of this command output, the export line was not appended.

At this point, you should try setting it manually:

Find your current path by running `pwd`, then run

`export CLO_ROOT=`*your current path here* .

Then run

`source ~/.bashrc`

`echo $CLO_ROOT`

to check that it was correctly set.

Now that we have the first part taken care of, we can move onto activating the Node environment. Be sure to have this environment activated at any time you're working with CLO3.
`source ../env/bin/activate` or `source $CLO_ROOT/env/bin/activate`  

<!-- stella's additions -->
If this doesn't work, you may need to execute the script again (in the /bin directory), and then try the above source command again.

`pwd`

```
$ pwd
/home/mitchelllambert/clo3/bin
```
`./A1-configure_nodeenv.sh`
`source ../env/bin/activate`

What we've just installed and activated is Node.js, this is a JavaScript runtime environment that lets us execute our JavaScript code outside a web browser.
**Whenever you are working with CLO3, be sure to have the nodeenv activated.**

#### Dependency Management 

<!-- added a bit to this section because it was seriously lacking -->
Let's check out the <a href="bin/A2-install_dependencies.sh" target="_blank">the second script</a> in a new window.

<!-- this comment was first below execution statement, but i think it'd be a good idea to save execution for after explanation --> 
The second script decends into 'clo-angular' and 'clo-api' to install the required node packages. Rember that last script installed Node for us. Node comes with a default (node) package manager. Which means Node's default package manager is a dependency of Node itself. 

As you can see if you're following along in the script, our package manager installs dependencies after descending into the two directories using the aptly named... 

`npm install`... 

... command. Now, to introduce you to our dependency structure, let's check where our package manager is obtaining the dependency information. 

They can be found in the package.json files of Angular's & the API's root directory. Check them out by clicking on the links below our run the commands below to view the segment of these two files that our package manager is getting the required information. 


##### Where is NPM locating Dependency Information?
<details>

  <summary> Locate and Open the Files </summary>

	1.	`cd ../clo-angular && vim package.json`
>___Backtrack to the project's root direct then move into angular's root directory, and open up the file (we use vim here but you can use whichever text editor you're most comfortable with.___	
	
	2. Take note of the dependencies & devDependencies section, these are angular's dependencies and all the key-value pairs listed here is where our package manager is reading from in the second script.
	3.	`:q!`
>___Exit the vim editor.___
	
	4. Repeat this process for checking out the API's dependencies, subsiting the API's root folder in for step 1.
</details>

<details>
	
  <summary> Output Dependencies List from Command Line </summary>

`sed -n '/"dependencies'/,$p' ../clo-angular/package.json`

  <details>

  <summary> Expected Output </summary>	 

```
$ sed -n '/"dependencies"/,$p' ../clo-angular/package.json
  "dependencies": {
    "@angular/common": "^9.0.4",
    "@angular/compiler": "^9.0.4",
    "@angular/compiler-cli": "^9.0.4",
    "@angular/core": "^9.0.4",
    "@angular/forms": "^9.0.4",
    "@angular/localize": "^9.0.4",
    "@angular/platform-browser": "^9.0.4",
    "@angular/platform-browser-dynamic": "^9.0.4",
    "@angular/router": "^9.0.4",
    "@fortawesome/angular-fontawesome": "^0.6.0",
    "@fortawesome/fontawesome-svg-core": "^1.2.27",
    "@fortawesome/free-solid-svg-icons": "^5.12.1",
    "@ng-bootstrap/ng-bootstrap": "^6.0.0",
    "bootstrap": "^4.4.1",
    "font-awesome": "^4.7.0",
    "jquery": "^3.4.1",
    "mark.js": "^8.11.1",
    "nan": "^2.14.0",
    "popper.js": "^1.16.1",
    "rxjs": "^6.5.4",
    "tslib": "^1.11.1",
    "zone.js": "~0.10.2"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "~0.900.4",
    "@angular/cli": "~9.0.4",
    "@fortawesome/fontawesome-free": "^5.12.1",
    "jasmine-core": "~3.5.0",
    "jasmine-spec-reporter": "~4.2.1",
    "karma": "^4.4.1",
    "karma-chrome-launcher": "~3.1.0",
    "karma-coverage-istanbul-reporter": "^2.1.1",
    "karma-jasmine": "~3.1.1",
    "karma-jasmine-html-reporter": "^1.5.2",
    "protractor": "^5.4.3",
    "ts-node": "~8.6.2",
    "tslint": "~6.0.0",
    "typescript": "^3.7.5",
    "viewerjs": "^1.5.0"
  }
}

```
  </details>


Similarly, we can run the same command, substituting the api's package.json in as argument file to check the api's dependencies:

`sed -e '/"dependencies": {/,$p' clo-api/package.json`

</details>

Now that we've checked out where our package manager is getting it's information, let's execute the script.

`./A2-install_dependencies.sh`

Note that the script will prompt the user for returning feedback about Angular to Google. Answer as you please.


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

If you are working on a virtual machine provided by the sysadmin, you will need to change to localhost:

`sudo vim clo.dev.HTTP.conf`

Type `i` to go into insert mode, and then change server_name to localhost.

`esc` and `:wq` to save and exit.

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


