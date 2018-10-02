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
def upload_volume(volumeID, acknowledgements, introduction, letters_to_carlyles, key_to_references, chronology):
    if db.volumes.find({'_id':str(volumeID)}).count > 0:
        db.volumes.update_one(
        {"_id":str(volumeID)},
        {"$set": {
         "acknowledgements":str(acknowledgements),
         "introduction":str(introduction),
         "letters_to_carlyles":str(letters_to_carlyles),
         "key_to_references":str(key_to_references),
         "chronology":str(chronology)}},
        upsert=True)

def upload_letters(volumeID, lettersArray):
    db.volumes.update_one(
    {"_id":str(volumeID)},
    {"$set": {"letters":lettersArray}}
    )

###################################
# iterates through an xml file   #
# and parses associated data for  #
# each page.                      #
###################################
def main():
    # loop through xml files in directory
    for filename in os.listdir(directory):
        if filename.endswith("01-P5--bek.xml"):
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
            # get introduction
            introduction = re.findall("<div1 type=\"section\" id=\"ed-%s-introduction\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            # get key-to-references
            key_to_references = re.findall("<div1 type=\"section\" id=\"ed-%s-key-to-references\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            # get letters-to-carlyles
            letters_to_carlyles = re.findall("<div1 type=\"section\" id=\"ed-%s-letters-to-the-carlyles\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            # get chronology
            chronology = re.findall("<div1 type=\"section\" id=\"ed-%s-chronology\">(.*?)</div1>" % volumeID, content, re.DOTALL)

            # remove new line characters
            acknowledgements[0] = acknowledgements[0].replace('\n', '')
            introduction[0] = introduction[0].replace('\n', '')
            key_to_references[0] = key_to_references[0].replace('\n', '')
            letters_to_carlyles[0] = letters_to_carlyles[0].replace('\n', '')
            chronology[0] = chronology[0].replace('\n', '')

            lettersMatch = re.findall("<div3 type=\"letter\">(.*?)</div3>", content, re.DOTALL)
            # create the volume document
            upload_volume(volumeID, acknowledgements[0], introduction[0], letters_to_carlyles[0], key_to_references[0], chronology[0])
            print "found "+str(len(lettersMatch))+" letters for this volume: "+filename

            try:
                # loop through each letter inside lettersMatch
                for letterContent in lettersMatch:
                    xml_id = re.findall("<bibl xml:id=\"(.*?)\">", letterContent)
                    docDate = re.findall("<docDate value=.+>(.*?)</docDate>", letterContent)
                    firstPage = re.findall("<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                    lastPage = re.findall("<idno type=\"lastpage\">(.*?)</idno>", letterContent)
                    docAuthor = re.findall("<docAuthor>(?:\n.*)<name type=\"first\">(.*?)</name>(?:\n.*)<name type=\"last\">(.*?)</name>", letterContent)
                    docAuthor[0] = " ".join(docAuthor[0])
                    sender = re.findall("<person type=\"sender\">(.*?)</person>", letterContent)
                    recipient = re.findall("<person type=\"addressee\">(.*?)</person>", letterContent)
                    sourceNote = re.findall("<sourceNote>(.*?)</sourceNote>", letterContent, re.DOTALL)

                    # check if head exists
                    headMatch = re.findall("<head>((?:.|\n)*?)</head>", letterContent, re.DOTALL)
                    if headMatch:
                        head = headMatch[0]
                    else:
                        head = ''

                    docBody = re.findall("<docBody>(.*?)</docBody>", letterContent, re.DOTALL)

                    lettersArray.append({
                    "xml_id": xml_id[0],
                    "docDate": docDate[0],
                    "firstPage": firstPage[0],
                    "lastPage": lastPage[0],
                    "docAuthor": docAuthor[0],
                    "sender": sender[0],
                    "recipient": recipient[0],
                    "sourceNote": sourceNote[0],
                    "docBody": docBody[0],
                    "head": head,
                    })

                    upload_letters(volumeID, lettersArray) # uploads the letters

            except Exception as e:
                print str(e)


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
