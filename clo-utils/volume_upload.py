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

startTime = datetime.now()
directory = "../col_xml_archive/" # defines working directory

# Connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

#############################
# Uploads the processed     #
# pages from an xml file #
# into mongodb.             #
#############################
def upload_volume(volumeID, volume_dates, acknowledgements, introText, letters_to_carlyles, key_to_references, chronology):
    db.volumes.update_one(
    {"_id":str(volumeID)},
    {"$set": {
     "volume_dates":str(volume_dates),
     "acknowledgements":str(acknowledgements),
     "introduction.introText":str(introText),
     "letters_to_carlyles":str(letters_to_carlyles),
     "key_to_references":str(key_to_references),
     "chronology":str(chronology),
     }},
    upsert=True)

def upload_letters(volumeID, lettersArray):
    db.volumes.update_one(
    {"_id":str(volumeID)},
    {"$set": {"letters":lettersArray}}
    )

def upload_accounts(volumeID, accountsArray):
    db.volumes.update_one(
    {"_id":str(volumeID)},
    {"$set": {"accounts":accountsArray}}
    )

###################################
# iterates through an xml file   #
# and parses associated data for  #
# each page.                      #
###################################
def main():
    # loop through xml files in directory
    for filename in os.listdir(directory):
        if filename.endswith("01-P5.xml"):
            print filename
            volumeID = ''.join(re.findall("\d{2}", filename)) # get volume id from filename
            file = open(os.path.join(directory, filename), "r")
            content = file.read()
            lettersArray = []
            notesArray = []
            accountsArray = []
            introFootnotesArray = []

            #####
            # volume-wide sections here
            #####
            # get volume_dates
            volume_datesMatch = re.findall("<publicationStmt>(?:\n.*<p>.*)(?:\n.*)*?(?:.*?<date when=.*?>|\n.*?<date when=.*?>)(.*?)</date>(?:.*\n?<date when=.*?>(.*\n.*|.*?)</date>)?(?:.*</p>|\n.*</p>)", content)
            #volume_datesMatch = re.findall("<publicationStmt>(?:.|\n)*?(?:<p>.*?<date when=.*?>|<p>\n.*?<date when=.*?>)(.*?)</date>(?:.*\n?<date when=.*?>(.*\n.*|.*?)</date>)?(?:</p>|\n.*</p>)?", content)
            if volume_datesMatch:
                volume_dates = " - ".join(volume_datesMatch[0]) # join date range together
                volume_dates = str.join("", volume_dates.splitlines()) # join multiple lines
                if volume_dates.endswith(' - '): # if only one date then remove the "-"
                    volume_dates = volume_dates[:-len(' - ')]
            else:
                volume_dates = ''

            # get acknowledgements section
            acknowledgementsMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-acknowledgements\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if acknowledgementsMatch:
                acknowledgements = acknowledgementsMatch[0]
            else:
                acknowledgements = ''

            # get introduction
            introductionMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-introduction\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if introductionMatch:
                introText = introductionMatch[0]
                # if footnotes exist add as array to introduction
                introFootnotes = re.findall("<note.*?>(.*?)</note>", introductionMatch[0], re.DOTALL)
                if introFootnotes:
                    db.volumes.update_one({"_id":str(volumeID)},{"$set":{"introduction.introFootnotes":introFootnotes}})
            else:
                introText = ''

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

            ### Checks for special volume sections ###
            # check if rival_brothers exists and if so add to volume
            rival_brothersMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-The-Rival-Brothers:-Fragment-Of-A-Play-By-Jane-Baillie-Welsh\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if rival_brothersMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"rival_brothers":str(rival_brothersMatch[0])}})

            # check if biographical-notes exists and if so add to volume
            biographicalNotesMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-biographical-notes\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if biographicalNotesMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"biographicalNotes":str(biographicalNotesMatch[0])}})

            # check if in-memoriam exists and if so add to volume
            inMemoriamMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-in-memoriam\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if inMemoriamMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"inMemoriam":str(inMemoriamMatch[0])}})

            # check if jane-carlyle-notebook exists and if so add to volume
            janeNotebookMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-jane-carlyle-notebook\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if janeNotebookMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"janeNotebook":str(janeNotebookMatch[0])}})

            # check if simple-story-of-my-own-love exists and if so add to volume
            simpleStoryMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-simple-story-of-my-own-love\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if simpleStoryMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"simpleStory":str(simpleStoryMatch[0])}})

            # check if jane-welsh-carlyle-journal exists and if so add to volume
            janeJournalMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-jane-welsh-carlyle-journal\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if janeJournalMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"janeJournal":str(janeJournalMatch[0])}})

            # check if geraldine-jewsbury-to-froude exists and if so add to volume
            geraldineJewsburyMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-geraldine-jewsbury-to-froude\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if geraldineJewsburyMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"geraldineJewsbury":str(geraldineJewsburyMatch[0])}})

            # check if ellen-twisleton-account-of-life-at-craigenputtoch exists and if so add to volume
            ellenTwisletonMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-ellen-twisleton-account-of-life-at-craigenputtoch\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if ellenTwisletonMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"ellenTwisleton":str(ellenTwisletonMatch[0])}})

            # check if athanaeum-advertisements exists and if so add to volume
            athanaeumAdvertisementsMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-athanaeum-advertisements\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if athanaeumAdvertisementsMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"athanaeumAdvertisements":str(athanaeumAdvertisementsMatch[0])}})

            # check if comments-on-aurora-leigh exists and if so add to volume
            auroraCommentsMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-comments-on-aurora-leigh\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if auroraCommentsMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"auroraComments":str(auroraCommentsMatch[0])}})

            # check if appendix exists and if so add to volume
            appendixMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-appendix\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if appendixMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"appendix":str(appendixMatch[0])}})

            # check if JWC-by-Robert-Scott-Tait exists and if so add to volume
            JWCbyTaitMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-JWC-by-Robert-Scott-Tait\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if JWCbyTaitMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"JWCbyTait":str(JWCbyTaitMatch[0])}})

            # check if TC-by-Robert-Scott-Tait exists and if so add to volume
            TCbyTaitMatch = re.findall("<div1 type=\"section\" id=\"ed-%s-TC-by-Robert-Scott-Tait\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if TCbyTaitMatch: db.volumes.update_one({"_id":str(volumeID)},{"$set": {"TCbyTait":str(TCbyTaitMatch[0])}})

            # remove new line characters
            acknowledgements = acknowledgements.replace('\n', '')
            introText = introText.replace('\n', '')
            key_to_references = key_to_references.replace('\n', '')
            letters_to_carlyles = letters_to_carlyles.replace('\n', '')
            chronology = chronology.replace('\n', '')

            ### remove comments for debugging purposes ###
            print volume_dates
            # print acknowledgements
            # print introduction
            # print key_to_references
            # print letters_to_carlyles
            # print chronology

            letterSection = re.findall("<div2 type=\"letters\">(.*?)</div2>", content, re.DOTALL) # get all letter sections
            lettersMatch = re.findall("<div3 type=\"letter\">(.*?)</div3>", letterSection[0], re.DOTALL) # find all letters in a volume

            # create the volume document
            upload_volume(volumeID, volume_dates, acknowledgements, introText, letters_to_carlyles, key_to_references, chronology)
            print "found "+str(len(lettersMatch))+" letters for this volume: "+filename
            print "processing letters for this volume: "+filename

            try:
                # loop through each letter inside lettersMatch
                for letterContent in lettersMatch:
                    xml_id = re.findall("<bibl xml:id=\"(.*?)\">", letterContent)

                    docDate = re.findall("<docDate value=(?:.|\n)*?>(?:(?:.*|\n.*)<pb id=.*?/>)?(\n.*?|.*?)(?:</docDate>|\n.*</docDate>)", letterContent)
                    docDate = "".join(docDate[0]).replace('\r\n', '').lstrip() # join dates together, remove new line characters, and strip leading whitespace

                    firstPage = re.findall("<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                    lastPage = re.findall("<idno type=\"lastpage\">(.*?)</idno>", letterContent)

                    # check if there is a docAuthor
                    ### volume 5, lt-18310400-TCAO-FMA-01 has two docAuthors
                    authorMatch = re.findall("<docAuthor>(?:\n.*)<name type=\"first\">(.*?)</name>(?:\n.*)<name type=\"last\">(.*?)</name>", letterContent)
                    if authorMatch:
                        docAuthor = " ".join(authorMatch[0])
                    else:
                        docAuthor = ''

                    # check if sender exists
                    senderMatch = re.findall("<person type=\"sender\">(.*?)</person>", letterContent)
                    if senderMatch:
                        sender = senderMatch[0]
                    else:
                        sender = ''

                    # check if there is a recipient
                    recipientMatch = re.findall("<person type=\"addressee\">(.*?)</person>", letterContent)
                    if recipientMatch:
                        recipient = recipientMatch[0]
                    else:
                        recipient = ''

                    # check if there is a sourcenote
                    sourceNoteMatch = re.findall("<sourceNote>(.*?)</sourceNote>", letterContent, re.DOTALL)
                    if sourceNoteMatch:
                        sourceNote = sourceNoteMatch[0]
                    else:
                        sourceNote = ''

                    docBody = re.findall("<docBody>(.*?)</docBody>", letterContent, re.DOTALL)

                    # check if head exists
                    headMatch = re.findall("<head>((?:.|\n)*?)</head>", letterContent, re.DOTALL)
                    if headMatch:
                        head = headMatch[0]
                    else:
                        head = ''

                    # check if there are any footnotes
                    footnotesMatch = re.findall("<note.*?>(.*?)</note>", letterContent)
                    if footnotesMatch:
                        # pull footnotes from docBody
                        footnotes = footnotesMatch
                    else:
                        footnotes = ''

                    header = "<p><strong>" + sender + " TO " + recipient + "</strong></p>"
                    docBodyHeader = header + docBody[0]
                    docBody = re.sub("<note .*?>.*?</note>", "", docBodyHeader)

                    # add all content to end of letters array
                    lettersArray.append({
                    "xml_id": xml_id[0],
                    "docDate": docDate,
                    "firstPage": firstPage[0],
                    "lastPage": lastPage[0],
                    "docAuthor": docAuthor,
                    "sender": sender,
                    "recipient": recipient,
                    "sourceNote": sourceNote,
                    "docBody": docBody,
                    "head": head,
                    "footnotes": footnotes,
                    })

                    upload_letters(volumeID, lettersArray) # uploads the letters


                    # print xml_id
                    # print docDate
                    # print firstPage
                    # print lastPage
                    # print docAuthor
                    # print sender
                    # print recipient
                    # # print sourceNote
                    # # print docBody
                    # print head
                    # print footnotes
                    # print "\n"


                print "Records successfully updated\n"
            except Exception as e:
                print str(e)

            # check if another letter section exists
            if len(letterSection)>1:
                accountMatch = re.findall("<div3 type=\"letter\">(.*?)</div3>", letterSection[1], re.DOTALL) # find all accounts in a volume
                print "found "+str(len(accountMatch))+" accounts for this volume: "+filename
                print "processing accounts for this volume: "+filename

                try:
                    # loop through each letter inside lettersMatch
                    for letterContent in accountMatch:
                        xml_id = re.findall("<bibl xml:id=\"(.*?)\">", letterContent)

                        docDate = re.findall("<docDate value=(?:.|\n)*?>(?:(?:.*|\n.*)<pb id=.*?/>)?(\n.*?|.*?)(?:</docDate>|\n.*</docDate>)", letterContent)
                        docDate = "".join(docDate[0]).replace('\r\n', '').lstrip() # join dates together, remove new line characters, and strip leading whitespace

                        firstPage = re.findall("<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                        lastPage = re.findall("<idno type=\"lastpage\">(.*?)</idno>", letterContent)

                        # check if there is a docAuthor
                        ### volume 5, lt-18310400-TCAO-FMA-01 has two docAuthors
                        authorMatch = re.findall("<docAuthor>(?:\n.*)<name type=\"first\">(.*?)</name>(?:\n.*)<name type=\"last\">(.*?)</name>", letterContent)
                        if authorMatch:
                            docAuthor = " ".join(authorMatch[0])
                        else:
                            docAuthor = ''

                        # check if sender exists
                        senderMatch = re.findall("<person type=\"sender\">(.*?)</person>", letterContent)
                        if senderMatch:
                            sender = senderMatch[0]
                        else:
                            sender = ''

                        # check if there is a recipient
                        recipientMatch = re.findall("<person type=\"addressee\">(.*?)</person>", letterContent)
                        if recipientMatch:
                            recipient = recipientMatch[0]
                        else:
                            recipient = ''

                        # check if there is a sourcenote
                        sourceNoteMatch = re.findall("<sourceNote>(.*?)</sourceNote>", letterContent, re.DOTALL)
                        if sourceNoteMatch:
                            sourceNote = sourceNoteMatch[0]
                        else:
                            sourceNote = ''

                        docBody = re.findall("<docBody>(.*?)</docBody>", letterContent, re.DOTALL)

                        # check if head exists
                        headMatch = re.findall("<head>((?:.|\n)*?)</head>", letterContent, re.DOTALL)
                        if headMatch:
                            head = headMatch[0]
                        else:
                            head = ''

                        # check if there are any footnotes
                        footnotesMatch = re.findall("<note.*?>(.*?)</note>", letterContent)
                        if footnotesMatch:
                            # pull footnotes from docBody
                            footnotes = footnotesMatch
                        else:
                            footnotes = ''

                        # add all content to end of letters array
                        accountsArray.append({
                        "xml_id": xml_id[0],
                        "docDate": docDate,
                        "firstPage": firstPage[0],
                        "lastPage": lastPage[0],
                        "docAuthor": docAuthor,
                        "sender": sender,
                        "recipient": recipient,
                        "sourceNote": sourceNote,
                        "docBody": docBody[0],
                        "head": head,
                        "footnotes": footnotes,
                        })

                        upload_accounts(volumeID, accountsArray) # uploads the letters


                        # print xml_id
                        # print docDate
                        # print firstPage
                        # print lastPage
                        # print docAuthor
                        # print sender
                        # print recipient
                        # # print sourceNote
                        # # print docBody
                        # print head
                        # print footnotes
                        # print "\n"


                    print "Records successfully updated\n"
                except Exception as e:
                    print str(e)


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
