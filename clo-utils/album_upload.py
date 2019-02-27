import xlrd
import os
import sys
import re
from pymongo import MongoClient
from datetime import datetime

startTime = datetime.now()
# Directory for the albums
workingDir = "../clo-angular/src/assets/albums"

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
# Uncomment the next line to test script on local database
# db = client.local
# Uncomment the next line to make changes to the clo database
db = client.clo

"""
This is a helper function that uploads a certain album (id) to the current
database (db).
It takes in an array of objects (images) and an album id (id).
A single image in the images array should look like
image = {
    imageUrl: string (this is the path to the image)
    metadata: {
        title: string
        description: string
        subjects: string[]
        authors: string[]
        date: string
        genre: string
        other_titles: string
        notes: string
        reproduction_note: string
        copyright_information: string
        language_note: string
        format: string
    }
}
"""
def upload_album(images, id):
    db.albums.update_one(
        { "_id": int(id) },
        { "$set": {
            "imagesFolder": "assets/albums/fullsize/album_" + str(id) + "/",
            "images": images
        }},
        upsert=True
    )

def main():
    for subdir, _, _ in os.walk(workingDir):
        images = []
        idMatch = re.findall("(\d{2})", subdir)
        if idMatch:
            albumId = idMatch[0]
            print "Working on Album:", albumId
            albumFiles = sorted(os.listdir(subdir))
            metadataFile = subdir + '/' + albumFiles[0] if re.match('Volume.\.xlsx', albumFiles[0]) is not None else None
            if metadataFile:
                print "\tExtracting metadata from:", metadataFile
                wb = xlrd.open_workbook(metadataFile)
                sheet = wb.sheet_by_index(0)
                metadata = []
                # We first extract the image metadata from the
                # metadata file
                # We start at index 1 because index 0 is just
                # the table headers, which we do not need
                for i in range(1, sheet.nrows):
                    subjects = []
                    authors = []
                    # Subjects are between indexes 4 and 7
                    for x in range(4,8):
                        if sheet.cell_value(i,x) == xlrd.empty_cell.value:
                            continue
                        subjects.append(sheet.cell_value(i,x).encode("ascii"))
                    # Authors are between indexes 8 and 10
                    for x in range(8,11):
                        if sheet.cell_value(i,x) == xlrd.empty_cell.value:
                            continue
                        authors.append(sheet.cell_value(i,x).encode("ascii"))
                    
                    metadata.append({
                        "title": sheet.cell_value(i, 2).encode("ascii"),
                        "description": sheet.cell_value(i, 3).encode("ascii"),
                        "subjects": subjects,
                        "authors": authors,
                        "date": str(sheet.cell_value(i, 11)).split('.')[0],
                        "genre": sheet.cell_value(i, 12).encode("ascii"),
                        "other_titles": sheet.cell_value(i, 13).encode("ascii"),
                        "notes": sheet.cell_value(i, 14).encode("ascii"),
                        "reproduction_note": sheet.cell_value(i, 15).encode("ascii"),
                        "copyright_information": sheet.cell_value(i, 16).encode("ascii"),
                        "language_note": sheet.cell_value(i, 17).encode("ascii"),
                        "format": sheet.cell_value(i, 18).encode("ascii")
                    })
            
            # Now that we have the metadata for the album,
            # we go in and assign each image the appropriate
            # metadata.
            for i, filename in enumerate(albumFiles[1:]):
                if metadataFile:
                    images.append({
                        "imageUrl": str(filename),
                        "metadata": metadata[i]
                    })
                else:
                    images.append({
                        "imageUrl": str(filename),
                        "metadata": []
                    })
            
            upload_album(images, albumId)
            print "Uploaded Album:", albumId
            print ""

if __name__ == '__main__':
    main()
    print "Elapsed time:", datetime.now() - startTime
