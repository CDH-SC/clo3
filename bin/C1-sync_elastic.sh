#!/bin/bash

cd ~/clo3 ; source env/bin/activate
cd clo-api

sudo kill -9 $( ps -aux | grep -e "elastic" | awk '{print $2}' | head -1 )
rm ./bin/elasticsearch-7.8.0/pid


./bin/elasticsearch-7.8.0/bin/elasticsearch -d -p pid 

sleep 20s
node elasticSync.js

cd ~/clo3
