#!/bin/bash

sudo pip3 install nodeenv
cd ~/clo3
nodeenv --node=12.18.3 env
source env/bin/activate
