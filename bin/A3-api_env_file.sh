#!/bin/bash

cd ~/clo3 ; source env/bin/activate
cd clo-api

touch .env
echo "DB_HOST=mongodb://127.0.0.1:27017/clo" >> .env
echo "ES_HOST=http://127.0.0.1:9200" >> .env

echo "Please validate URIs for remote services..."
echo "Initialized defaults."

cd ~/clo3
