# CLO3 Remediation

**Summer 2020**  
**Author: Kenneth Johnson**

---

The purpose of this document is to keep a record of the bugs and issues worked by Kenneth Johnson in the summer of 2020. My relationship with the project began in May 2020, when I was asked to take a look at a CLO3 patch that seemed to break the site. 

It will primarily be used to organize a meeting with the development team in August 2020. 

Documentation related to the ongoing development of CLO3 can be found in the updated repository README. Much of the documentation for the build system specifically can be found in comments of the scripts in the new `bin/` directory located in the root of the repository. 

Additional documentation may be found in the `docs/` directory.  

## Changelog

### Bug Report(s):

This list may seem rather short. I agree. I was pleased to find very few "breaking" issues in CLO3. However, it will be discussed later how dealing with this class of bug was made significantly more difficult by the opaque Docker build system. 

### Resolved:

#### 1a. CORS Issues w/ Elasticsearch patch

This is the primary bug at the root of the issues arising with the elasticsearch patch. I was made aware of this issue in late April 2020.

The primary way this bug manifested itself to users of the new "Advanced Search" feature was by breaking the connection to the API. No results would be returned, and a CORS error message (`CORS request did not succeed`) can be found in the browser console's "Networking" tab.  

This issue with CORS arises when trying to access a resource from an unauthorized protocol or host. In this case, the CORS issue would arise whenever the angular front-end tried to make a request to the API that was explicitly defined and served from the same server. 

This bug is resolved by leaving the API location as an empty string in the `clo-angular/src/environment/environment.prod.ts` file and handling the /api request in the same server block in the nginx configuration. 

The server configuration should be checked to be valid for the HTTP configuration before running `sudo certbot --nginx` to enable SSL support. 

**Solution:**

// Nginx Config Directives
// Discuss directives in Express server?

- [0] https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSDidNotSucceed

#### 1(b). Mixed content violation. 

![](../screenshots/mixed-block-00.png)

*Figure: Screenshot of web console Networking tab when this issue arises.*

A "Mixed Block" violation occurs most often when a request is made from a host using the HTTPS protocol to a less secure service using only HTTP. This can occur if the webserver is configured to support SSL for the clo-angular site, but the Angular front-end is configured to make direct requests to the API via. HTTP.

Essentially, if both the frontend and the API are on the same host, this situation will likely throw a CORS Request complaint (see *1(a)*). This would mask the "Mixed Content Violation" issue. Once the CORS issue is resolved, this networking issue should be visible. 

**Solution:**

Thankfully, I found the best solution to this issue was to not touch the *clo-angular* or *clo-api* configurations on account of this issue, and instead let my Nginx configuration handle the SSL and proxying requets (using the `proxy_pass` directive) to a service running on the host machine. 

A different, valid solution would be to configure HTTPS in the Express server definition itself (a.k.a. in the *clo-api* code). I did not determine this to be the best approach as configuring Nginx to proxy_pass to the service solved the issue of serving the API from the same machine. 

Confirm that the 'apiURL' definition is set to a null string in the *clo-angular/src/environment/environment.prod.ts* file.

`nano clo-angular/src/environment/environment.prod.ts`

```
$cat src/environments/environment.prod.ts 
export const environment = {
  production: true,
  apiUrl: ''
};

```

Remember, changes to this configuration file - or any config files for clo-angular are not deployed until the app is rebuilt (most simply by executing `ng build --prod` from the *clo-angular/* directory).



#### 1(c). Volumes drop-down caret not listing volumes

![The caret before it is activated.](../screenshots/carrot-00.png)

*Figure: The orange caret in the "inactive" position.*

![What the drop down menu should display.](../screenshots/carrot-01.png)

*Figure: Correct functionality of the drop-down list.*

I won't spend too much time on this one, but for some I know it was their first hint that something might be causing problems in CLO's backend. 

A connection to the API could not be established for the reasons given in the previous two sections. This was never an issue of the database not existing, or data being lost. Thankfully, it was just another symptom of being unable to connect to the API. 


### Ongoing:


#### 1. Visual Bugs in Letters / Results

// *TODO:*   
// [  ] *Resolve Issue* **and/or**  
// [  ] *Finish this section of the report*


### New Build System

To remove complexity in the build system, I have replaced the Docker/docker-compose container definitions with a set of scripts. These scripts can be found in `bin\` directory in the root directory of the repository (henceforth, `$CLO3_ROOT`).

These bash scripts are self documented, and combined with a few notes from documentation are sufficient to install configure, and deploy CLO3. Certainly, they are more approachable for new team members and more extensible for new features. 

**Why get rid of Docker?**

This question is well-warranted, as we often glorify the benefits of Docker as the solution to issues of complexity and repeatibility for CDH's partner projects. However, after 3 years working with Docker and the unpredictable realities of these digital humanities projects, I believe that Docker often results in a net gain in complexity. Docker itself is a layer of complexity that can obfuscate problems, increase the difficulty of onboarding new teammates. For this team, at this time, the up-front cost to mental bandwidth is not worth it for 

Also, it must be understood that a robust, well-documented, discrete set of build scripts will massively reduce the complexity of containerizes the application in the future, if the environment necessitates it. This is true for almost any potential updates or changes to the production environment of CLO3. 

Related links:  
[0] https://news.ycombinator.com/item?id=20541188
[1] https://news.ycombinator.com/item?id=22628274

**Fresh Build vs. Extending In Place**

As discussed, one reason I do not think Docker is the right tool for this job is it's tendency to hide complexity. This is a good thing *until* there is an issue at that targets that area of complexity. 

As such, please familiarize yourself with the scripts by reading through each one before executing. I have written them to be as un-intimidating as possible. I do not recommend running scripts on one's own project without at least a moderate understanding of what/why the script exists in the first place. 

I have tried to write the scripts in such a way that they will not break the application if run out of turn. They should fail gracefully. That said, they are Bash scripts, and if I tried to cover every edge case they would not long be "simple and approachable". Just like how choosing to use Docker has trade-offs, this is the trade-off I think is best for the CLO project. 

For example, there is no need to run the `XX-install_elasticsearch.sh` script if you are working on an existing CLO3 server. Nothing bad should happen, of course, but it highlights the notion that simple, effective tools & common sense is what keeps a project healthy, not set-and-forget abstractions that create roadblocks to new developers. 

// More on this in the demo itself / comments in *bin/ files.*


### NGINX Configuration:
Included in the build are two configuration files. I have chosen to include them in the repository.

**HTTP (w/o SSL):**

```
server {
  server_name clo.dev.colin.cdhsc.org;
  root /srv/dist/clo;

  location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control';

    try_files $uri $uri/ /index.html;
  }
  location /api {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control';
    
    proxy_pass http://127.0.0.1:3000;
  }

}
```

Setting up SSL for the webserver is easy. We use a command-line tool from Let's Encrypt, Certbot, for this purpose. Installing on a Ubuntu or Debian machine is easy:

```
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx
```

Configuration is just as easy. With the Nginx webserver running and configured to serve the HTTP configuration file. You can quickly confirm the validity of the current configuration with `sudo nginx -t`. 

When you are ready to proceed (there might be a few seconds of downtime...) run: 

`sudo certbot --nginx`



**HTTPS/SSL:**

```
server {
  server_name clo.dev.colin.cdhsc.org;
  root /srv/dist/clo;

  location / {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control';

    try_files $uri $uri/ /index.html;
  }
  location /api {
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control';
    
    proxy_pass http://127.0.0.1:3000;
  }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/clo.dev.colin.cdhsc.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/clo.dev.colin.cdhsc.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = clo.dev.colin.cdhsc.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


  listen 80;
  server_name clo.dev.colin.cdhsc.org;
    return 404; # managed by Certbot
}

```


## Some Closing Thoughts

In some ways, it doesn't seem like I fixed very much this summer - this is roughly true. However, there are more ways a software project can be improved beyond the obvious (1) new features, and (2) fixing bugs. I am a strong advocate for this point. 

I (Kenny) believe the work I accomplished this summer was in an important, third category: time, love, and care. TLC is similar, in this context, to accountability of the entire application. Of these three categories, TLC is the most difficult to maintain and improve for projects like CLO, where student developer's can only devote a limited amount of their time to the project, and turnover is high. 

For example, due to the constant flow of people on and off the CLO team, nobody on the CLO or DevOps teams could speak to the entirety of the CLO build system. Usually this would not be a problem, as the previous Docker build system worked just fine. This lack of community/team knowledge only becomes apparent when a bug or issue arises in the build system. 

This is why I switched to the simplest build system for the job. A series of scripts + documentation. A simple build system is the most transparent, approachable, and debug-able type of build system. It does not make any attempt to hide complexity in abstraction. 





## TODOs 
- Include demo video (literally just a quick recording of my terminal standing up the new site)
- Confirm decent development environment for devs.(`ng serve`?)
    - quick chat to confirm their development workflow
    - clo-angular vs. clo-api dev workflows?
    - Git workflows
- Misc. workflow
	- Ask about `nodeSync.js` script
	- Dependency questions?
- Explicitly define Dev/Prod environments
- DB Questions
	- related to backup / recovery options
- Security hardening 
	- VM Access
	- Talk w/ Zach?
- Backups
	- Dedicated backup? (Think of how we are now able to stand up https://clo.dev.**colin**.cdhsc.org with control & ease.)
	- **RECOVERY PLAN**
		- I consider mandatory
		- I can put together very quickly. This is exactly the sort of thing that requires just a ~10 minute chat with the team to make sure we provide a solution that works for them - and, importantly, *makes sense* to them. 

