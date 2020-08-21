#!/bin/bash

# by: Kenneth Johnson
# CLO3 Summer Remediation

cd $CLO_ROOT ; source env/bin/activate
cd clo-api

#echo "Stopping previous elasticsearch instance (if it existed)..."
#exec $CLO_ROOT/bin/ZZ-kill_es_proc.sh

cd $CLO_ROOT

# [CLO3] Starting an instance of ES
# n.b. '-d' flag runs in detached mode (required for persistence)
./clo-api/bin/elasticsearch-7.8.0/bin/elasticsearch -d -p pid # 
#./clo-api/bin/elasticsearch-7.8.0/bin/elasticsearch -p pid 

sleep 8s  # safety sleep to ensure ES has time to spin up...

echo "[CLO3] Attempting to sync mongo database and new ES instance."
node $CLO_ROOT/clo-api/elasticSync.js
npm start
cd $CLO_ROOT
