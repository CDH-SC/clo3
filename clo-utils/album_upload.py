#!/usr/bin/python

import os
import sys
from pymongo import MongoClient
from datetime import datetime

startTime = datetime.now()
directory = "../clo-angular/src/assets/albums/album_02/"

# connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

def upload_album(imageArray):
    db.albums.update_one(
    {"_id": 02},
    {"$set": {
    "albumUrl": "assets/albums/album_02/",
    "images": imageArray
    }},
    upsert=True)

def main():
    imageArray = []
    for filename in sorted(os.listdir(directory)):
        print filename

        imageArray.append({
        "imageUrl": str(filename)
        })

        upload_album(imageArray)

if __name__ == '__main__':
    main()
    print datetime.now() - startTime
