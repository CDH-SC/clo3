#!/bin/bash

# Kenneth Johnson
# CLO Remediation - Summer 2020



cd ~/clo3
source env/bin/activate

npm install -g @angular/cli@latest

echo "Installing node dependencies."
echo "[Note] Decending into clo-angular..."
cd clo-angular ; npm install ; cd ..
cd clo-angular ; npm install --save typescript@3.7 ; cd ..

echo "...clo-angular depencies installed."
echo "[Note] Decending into clo-api..."
cd clo-api ; npm install ; cd ..
echo "...clo-api dependencies installed."
