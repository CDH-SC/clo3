#!/bin/bash

# Run elasticsearch in `clo-api` parent directory
#
# This script is related to `install-elasticsearch.sh`. 

# Run Elasticsearch as a daemon
./elasticsearch-7.8.0/bin/elasticsearch -d -p pid

# Instantiate environment variables
# pwd
# touch .env
# truncate -s 0 .env
# 
# # echo "DB_HOST=mongodb://127.0.0.1:27017/clo" >> .env
# echo "ES_HOST=http://127.0.0.1:9200" >> .env
# source .env 
# 
# bash ../bin/install-mongo.sh
# pwd 
# node elasticSync.js
