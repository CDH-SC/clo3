# Add Frontice Piece Script
#
# @author Jerrod C Mathis
# Contact: jerrodmathis95@gmail.com

import os
import sys
import re
from pymongo import MongoClient
from datetime import datetime  # measure the speed of the script

startTime = datetime.now()

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

##################################
# Inserts a frontice_piece field #
# into each document in the      #
# volumes collection             #
##################################

def update_fields():
    db.volumes.update(
        {},
        {"$set": {
            "frontice_piece": {
                "imageUrl": "",
                "imageCaption": ""
            }
        }},
        upsert=False,
        multi=True
    )

if __name__ == '__main__':
    update_fields()
    print datetime.now() - startTime