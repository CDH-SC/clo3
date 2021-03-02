#!/bin/bash

# by: Kenneth Johnson
# CLO3 Remediation - Summer 2020

cd $CLO_ROOT ; source env/bin/activate
cd clo-api/bin

wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.8.0-linux-x86_64.tar.gz
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.8.0-linux-x86_64.tar.gz.sha512
shasum -a 512 -c elasticsearch-7.8.0-linux-x86_64.tar.gz.sha512

tar -xzf elasticsearch-7.8.0-linux-x86_64.tar.gz

# Removing previous ES directory if it existed...
rm -rf elasticsearch-7.8.0-linux-x86_64.tar.gz.sha512 elasticsearch-7.8.0-linux-x86_64.tar.gz

# Killing a previous instance of ES, if it existed. 
#exec $CLO_ROOT/bin/ZZ-kill_es_proc.sh


#echo "Deleting previous pid file..."
#rm ./elasticsearch-7.8.0/pid 

cd $CLO_ROOT/clo-api/bin/elasticsearch-7.8.0
./bin/elasticsearch -d -p pid
cd $CLO_ROOT
