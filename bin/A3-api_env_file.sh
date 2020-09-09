#!/bin/bash

# by: Kenneth Johnson
# CLO3 Summer Remediation

# This script sets up the 'clo-api/.env' file.

cd $CLO_ROOT ; source env/bin/activate
cd clo-api

# The .env file is ready by scripts that are used to run clo-api. 
# As such, this file ('.env') must exist and be populated before
# running the API.

echo "Please be aware, this script will overwrite the previous '.env' file." 

touch .env
echo "DB_HOST=mongodb://127.0.0.1:27017/clo" > .env
echo "ES_HOST=http://127.0.0.1:9200" >> .env

echo "Please validate URIs for remote services..."
echo "Initialized defaults."

cat .env

cd $CLO_ROOT
