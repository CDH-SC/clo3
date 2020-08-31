#!/bin/bash

# Kenneth Johnson
# CLO3 Summer Remediation

cd $CLO_ROOT ; source env/bin/activate

cd clo-angular
rm -rf dist/
ng build --prod

cd /srv/
echo "....Linking the build artifact ('dist') to the /srv/ directory."

sudo ln -s $CLO_ROOT/clo-angular/dist

sudo apt-get update
sudo apt-get install nginx -y

echo "....Copying Nginx config to 'sites-available directory."
echo "....To enable it, use a symbolic link in the sites-enabled directory."
echo "....Validate the new config with `sudo nginx -t`"
echo "....Reload the new config with `sudo nginx -s reload`"

sudo cp $CLO_ROOT/docs/nginx-configs/clo.dev.HTTP.conf /etc/nginx/sites-available
