#!/bin/bash

# by: Kenneth Johnson
# CLO3 Remediation - Summer 2020

cd $CLO_ROOT ; source env/bin/activate 

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org

sudo systemctl stop mongod
sudo systemctl daemon-reload
sudo systemctl enable mongod
sudo systemctl start mongod

mongorestore -d clo ~/clo3/clo-database/current/clo
sudo systemctl status mongod

cd $CLO_ROOT 
