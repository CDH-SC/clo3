#!/bin/bash

cd ~/clo3 ; source env/bin/activate
cd clo-api/bin

wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.8.0-linux-x86_64.tar.gz
wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.8.0-linux-x86_64.tar.gz.sha512
shasum -a 512 -c elasticsearch-7.8.0-linux-x86_64.tar.gz.sha512

tar -xzf elasticsearch-7.8.0-linux-x86_64.tar.gz

rm -rf elasticsearch-7.8.0-linux-x86_64.tar.gz.sha512 elasticsearch-7.8.0-linux-x86_64.tar.gz

sudo kill -9 $( ps -aux | grep -e "elastic" | awk '{print $2}' | head -1 )
rm ./elasticsearch-7.8.0/pid 

cd ~/clo3
