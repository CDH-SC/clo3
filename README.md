# CLO3 

For non-technical information about this project, consult the [about-project](https://clo.cdhsc.org/about-project) page on the site itself. 

## Build

*While most of these dependencies are installed automatically by executing the scripts in *bin/*, see below for a list of the major dependencies required to build and deploy CLO3. This list is not exhaustive, and one should consult those scripts, as well as the respective *package.json* files for a complete list. 
*


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


### The Scripts

 

## Deploy CLO

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



## Notes:

1. *[**ATTENTION**] It is absolutely important at all times to understand your dependency structure. **It is important to document if a command is run with `sudo`.** It is important to understand whether Node is using a globally installed package, a package it knows to install w/ `npm install`, or if the dependency is not being tracked by node at all.* 



