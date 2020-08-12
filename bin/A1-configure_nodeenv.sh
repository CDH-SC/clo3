#!/bin/bash

sudo apt-get install python3-certbot-nginx certbot

sudo pip3 install nodeenv
cd ~/clo3
nodeenv --node=12.18.3 env
source env/bin/activate
