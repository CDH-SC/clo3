#!/bin/bash

# by: Kenneth Johnson
# CLO3 Remediation - Summer 2020

cd $CLO_ROOT

# This line simple pulls out the proces number of the current running
# Elasticsearch instance. This is the safest way to handle this as we# run elasticsearch in the background ("detached"). 
ES_PROC_LINE=$( sudo ps -aux | grep -v "grep" | grep -v "vim" | grep -e "elastic" )

echo "\$ES_PROC_LINE: $ES_PROC_LINE" 
sleep 2s  # Added this sleep to view the results of the previous line...

ES_PROC=$( echo $ES_PROC_LINE | awk '{print $2}' | head -1 )

if [[ $ES_PROC ]] ; then
  echo "[CLO3] Running ES process found!"
  echo "....killing it..."
  sudo kill -9 $ES_PROC;
  echo "....erasing its legacy..."
#  rm $CLO_ROOT/clo-api/bin/elasticsearch-7.8.0/pid
  echo "    Gone." 
fi 

cd $CLO_ROOT

