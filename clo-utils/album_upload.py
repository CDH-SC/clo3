#!/usr/bin/python

import os
import sys
import re
from pymongo import MongoClient
from datetime import datetime

startTime = datetime.now()
directory = "../clo-angular/src/assets/albums/"

# connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

def upload_album(imageArray, albumID):
    db.albums.update_one(
    {"_id": int(albumID)},
    {"$set": {
    "thumbnailUrl": "assets/albums/thumbnails/album_"+str(albumID)+"/",
    "fullsizeUrl": "assets/albums/fullsize/album_"+str(albumID)+"/",
    "images": imageArray
    }},
    upsert=True)

def main():
    for subdir, dirs, files in os.walk(directory):
        imageArray = []
        albumIDMatch = re.findall("(\d{2})", subdir)
        if albumIDMatch:
            albumID = albumIDMatch[0]
        else:
            albumID = None
        print "albumID: " +str(albumID)
        print "subdirs: " +str(subdir)

        for filename in sorted(os.listdir(subdir)):
            imageArray.append({
            "imageUrl": str(filename),
            "date": "",
            "caption": "",
            "title": "",
            "creator": ""
            })

            if albumID == None:
                print "Invalid album"
            else:
                upload_album(imageArray, albumID)

if __name__ == '__main__':
    main()
    print datetime.now() - startTime
