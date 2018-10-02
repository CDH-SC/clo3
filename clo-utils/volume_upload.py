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
        if filename.endswith("P5--bek.xml"):
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
            acknowledgementsMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-acknowledgements\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if acknowledgementsMatch:
                acknowledgements = acknowledgementsMatch[0]
            else:
                acknowledgements = ''
            # get introduction
            introductionMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-introduction\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if introductionMatch:
                introduction = introductionMatch[0]
            else:
                introduction = ''
            # get key-to-references
            key_to_referencesMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-key-to-references\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if key_to_referencesMatch:
                key_to_references = key_to_referencesMatch[0]
            else:
                key_to_references = ''
            # get letters-to-carlyles
            letters_to_carlylesMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-letters-to-the-carlyles\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if letters_to_carlylesMatch:
                letters_to_carlyles = letters_to_carlylesMatch[0]
            else:
                letters_to_carlyles = ''
            # get chronology
            chronologyMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-chronology\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if chronologyMatch:
                chronology = chronologyMatch[0]
            else:
                chronology = ''

            # remove new line characters
            acknowledgements = acknowledgements.replace('\n', '')
            introduction = introduction.replace('\n', '')
            key_to_references = key_to_references.replace('\n', '')
            letters_to_carlyles = letters_to_carlyles.replace('\n', '')
            chronology = chronology.replace('\n', '')

            lettersMatch = re.findall("<div3 type=\"letter\">(.*?)</div3>", content, re.DOTALL)
            # create the volume document
            upload_volume(volumeID, acknowledgements, introduction, letters_to_carlyles, key_to_references, chronology)
            print "found "+str(len(lettersMatch))+" letters for this volume: "+filename
            print "\n"

            try:
                # loop through each letter inside lettersMatch
                for letterContent in lettersMatch:
                    xml_id = re.findall("<bibl xml:id=\"(.*?)\">", letterContent)
                    docDate = re.findall("<docDate value=(?:.|\n)*?>(?:.|\n)*?(.*?)</docDate>", letterContent)
                    firstPage = re.findall("<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                    lastPage = re.findall("<idno type=\"lastpage\">(.*?)</idno>", letterContent)

                    # check if there is a docAuthor
                    ### volume 5, lt-18310400-TCAO-FMA-01 has two docAuthors
                    authorMatch = re.findall("<docAuthor>(?:\n.*)<name type=\"first\">(.*?)</name>(?:\n.*)<name type=\"last\">(.*?)</name>", letterContent)
                    if authorMatch:
                        docAuthor = " ".join(authorMatch[0])
                    else:
                        docAuthor = ''

                    sender = re.findall("<person type=\"sender\">(.*?)</person>", letterContent)
                    recipient = re.findall("<person type=\"addressee\">(.*?)</person>", letterContent)
                    sourceNote = re.findall("<sourceNote>(.*?)</sourceNote>", letterContent, re.DOTALL)
                    docBody = re.findall("<docBody>(.*?)</docBody>", letterContent, re.DOTALL)

                    # check if head exists
                    headMatch = re.findall("<head>((?:.|\n)*?)</head>", letterContent, re.DOTALL)
                    if headMatch:
                        head = headMatch[0]
                    else:
                        head = ''

                    # pull footnotes from docBody
                    footnotes = re.findall("<note.*?>(.*?)</note>", letterContent)

                    lettersArray.append({
                    "xml_id": xml_id[0],
                    "docDate": docDate[0],
                    "firstPage": firstPage[0],
                    "lastPage": lastPage[0],
                    "docAuthor": docAuthor,
                    "sender": sender[0],
                    "recipient": recipient[0],
                    "sourceNote": sourceNote[0],
                    "docBody": docBody[0],
                    "head": head,
                    "footnotes": footnotes,
                    })

                    upload_letters(volumeID, lettersArray) # uploads the letters

                    '''
                    print xml_id
                    print docDate
                    print firstPage
                    print lastPage
                    print docAuthor
                    print sender
                    print recipient
                    # print sourceNote
                    # print docBody
                    print head
                    print footnotes
                    '''

            except Exception as e:
                print str(e)


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
