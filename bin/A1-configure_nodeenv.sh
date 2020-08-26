#!/bin/bash

# by: Kenneth Johnson
# CLO3 Remediation - Summer 2020 

sudo apt-get install -y python3-pip python3-certbot-nginx certbot

#  Set CLO_ROOT env variable for reference in other scripts.
#  	- this is done primarily to avoid hardcoded paths in the config

if [ -z "$CLO_ROOT" ]
then
      echo "\$CLO_ROOT is empty, setting to parent directory..."
      echo "Setting \$CLO_ROOT in /etc/environment file."

      # Assume default CLO_ROOT is the parent of this bin/ directory
      # The `sed` command simply strips off the last component of the path.
      CLO_ROOT_DEFAULT=$( pwd | sed -e "s/\/[^\/]*$//" )
      echo "export CLO_ROOT=$CLO_ROOT_DEFAULT" >> ~/.bashrc
      source ~/.bashrc
else
      echo "\$CLO_ROOT is already set. It will remain unchanged."
fi

source ~/.bashrc

echo "[CLO3] Please confirm the validity of the $CLO_ROOT environment variable."
echo "....It should point to the root directory of the CLO3 repository."
echo "....This environment variable is set in the '/etc/environment' file."
echo 
echo "....\$CLO_ROOT: $CLO_ROOT"


sudo pip3 install nodeenv
cd $CLO_ROOT

echo "[CLO3] Setting up nodeenv..."
echo "....using --node=12.18.3"
nodeenv --node=12.18.3 env

echo
echo "....finished setting up nodeenv."
echo
echo "[CLO3] Activate the environment with:"
echo "    source env/bin/activate"
