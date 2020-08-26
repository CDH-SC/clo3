#!/bin/bash

# by: Kenneth Johnson
# CLO3 Summer Remediation

cd $CLO_ROOT ; source env/bin/activate

#echo "Stopping previous elasticsearch instance (if it existed)..."
#exec $CLO_ROOT/bin/ZZ-kill_es_proc.sh


sleep 3s  # safety sleep to ensure ES has time to spin up...

echo "[CLO3] Attempting to sync mongo database and new ES instance."
node $CLO_ROOT/clo-api/elasticSync.js

#npm start
cd $CLO_ROOT
