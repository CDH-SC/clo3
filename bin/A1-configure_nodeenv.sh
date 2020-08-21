#!/bin/bash

# by: Kenneth Johnson
# CLO3 Remediation - Summer 2020 

sudo apt-get install -y python3-pip python3-certbot-nginx certbot

#  Set CLO_ROOT env variable for reference in other scripts.
#  	- this is done primarily to avoid hardcoded paths in the config
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
source env/bin/activate

echo
echo "....finished setting up nodeenv."
echo
echo "[CLO3] Activate the environment with:"
echo "    source env/bin/activate"

