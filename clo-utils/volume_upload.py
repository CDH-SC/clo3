#!/usr/bin/python

# Volume Upload Script
#
# @author Lawton C Mizell, Caleb Kitzmann
# Contact: alcamech@gmail.com, emperor.pickles@gmail.com

import os
import sys
import re
from pymongo import MongoClient
from datetime import datetime # measure the speed of script
from pprint import pprint # pprint library is used to make the output look pretty

startTime = datetime.now()
directory = "../col_xml_archive/completed/"

# Connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

#############################
# Uploads the processed     #
# pages from an xml file #
# into mongodb.             #
#############################
# def upload_volume():
#     db.volumes.update_one({
#     "_id":str(volumeID)
#     "volume_dates":str(volumeDate)},
#     {
#     "$set": {
#      "letters":lettersArray,
#      }
#     })

###################################
# iterates through an xml file   #
# and parses associated data for  #
# each page.                      #
###################################
def main():
    # loop through xml files in directory
    for filename in os.listdir(directory):
        if filename.endswith(".xml"):
            print filename
            volumeID = ''.join(re.findall("\d{2}", filename)) # get volume id from filename
            file = open(os.path.join(directory, filename), "r")
            content = file.read()
            lettersArray = []
            notesArray = []

            #####
            # volume-wide sections here
            ####$
            # get acknowledgements section
            acknowledgements = re.findall("<div1 type=\"section\" id=\"ed-%s-acknowledgements\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            print acknowledgements
            # get introduction
            introduction = re.findall("<div1 type=\"section\" id=\"ed-%s-introduction\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            print introduction
            # get key-to-references
            key-to-references = re.findall("<div1 type=\"section\" id=\"ed-%s-key-to-references\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            # get letters-to-carlyles
            letters-to-carlyles = re.findall("<div1 type=\"section\" id=\"ed-%s-letters-to-the-carlyles\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            # get chronology
            chronology = re.findall("<div1 type=\"section\" id=\"ed-%s-chronology\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            #####
            # volume 30 has some additional sections here
            #####


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
