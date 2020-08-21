#!/bin/bash

# by: Kenneth Johnson
# CLO Remediation - Summer 2020

# The primary purpose of this script is to decend into 'clo-angular'
# and 'clo-api' and install their dependencies as specified in their
# respective package.json file. 

echo "[CLO3] Activating nodeenv..."
cd $CLO_ROOT 
source env/bin/activate


npm install -g @angular/cli@latest

echo "Installing node dependencies."
echo "[Note] Decending into clo-angular..."
cd clo-angular ; npm install ; cd ..
# Next line installs typescript 3.7. This avoids conflicting dependencies
# or having to provide an alias. 
cd clo-angular ; npm install --save typescript@3.7 ; cd ..

echo "...clo-angular depencies installed."
echo "[Note] Decending into clo-api..."
cd clo-api ; npm install ; cd ..
echo "...clo-api dependencies installed."
