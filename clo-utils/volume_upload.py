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
directory = "../xml_archive/"

# Connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

#############################
# Uploads the processed     #
# pages from an xml file #
# into mongodb.             #
#############################
def upload_volume():
    db.volumes.update_one(

    )

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
            file = open(os.path.join(directory, filename), "r")
            content = file.read()
            


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
