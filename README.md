# CLO3 

For non-technical information about this project, consult the [about-project](https://clo.cdhsc.org/about-project) page on the site itself. 

## Build

*While most of these dependencies are installed automatically by executing the scripts in *bin/*, see below for a list of the major dependencies required to build and deploy CLO3. This list is not exhaustive, and one should consult those scripts, as well as the respective *package.json* files for a complete list. 
*

You will need root access to the machine to build CLO3. Our team currently uses Ubuntu 20.04 for its remote servers. 

**Dependencies:**

- Git
- python3-pip
- Nodeenv
- Node (^12.18.3)
- MongoDB
- ElasticSearch (^7.8)
- Angular (^9.0.4)
- jquery (^3.4.1)


**Install Git**

Install Git using your system's package manager. See [https://git-scm.com/book/en/v2/Getting-Started-Installing-Git](their installation directions). On Debian/Ubuntu based systems, the command is: 

`sudo apt-get update`  
`sudo apt-get install git-all`

Clone the repository to your command line:

`git clone https://github.com/cdh-sc/clo3`


### The Scripts

Before you begin, add the following line to your .bashrc file:

`echo "export CLO_ROOT=/home/kennethj/clo3 >> `
`source ~/.bashrc`

`cd clo3/bin`

`./A1-configure_nodeenv.sh`

`./A2-install_dependencies.sh`

`./A3-api_env_file.sh`


`source ../env/bin/activate`  
Whenever you are working with CLO3, be sure to have the nodeenv activated.

**Deploy clo-api:**


`./B1-install_mongo.sh` 

`./B2-install_elastic.sh`

`cd ../clo-api`

`node elasticSync.js`

`nohup ./bin/www &`

**Build clo-angular:**

`cd ../clo-angular`

`ng build --prod`



## Deploy CLO

**Configure NGINX**

`cd /etc/nginx/sites-enabled`

`sudo unlink default`

`sudo cp /<path>/<to>/clo3/docs/nginx-configs/clo.dev.HTTP.conf /etc/nginx/sites-available`

At this point, run `nginx -s reload` and confirm that the config is valid. You can check at this point if the front end is available at *http://<ip-address>*

Be sure to check the server_name directive.

At this point, speak to the DevOps team to setup DNS if you have not already. 

**Enable SSL/HTTPS Support:**

`sudo certbot --nginx`

Answer all the questions as given, and be sure to choose the **redirect** option for the final question. 

`sudo nginx -s reload`





 
---

### Contributors
* **Jerrod Mathis**
* **Caleb Kitzmann**
* **Prithvi Tippabhatla**
* **Joshua Nelson**
* **Kenny Johnson**
* **Ian McDowell**
* **Tyron Schultz**



## Notes:

1. *[**ATTENTION**] It is absolutely important at all times to understand your dependency structure. **It is important to document if a command is run with `sudo`.** It is important to understand whether Node is using a globally installed package, a package it knows to install w/ `npm install`, or if the dependency is not being tracked by node at all.* 



