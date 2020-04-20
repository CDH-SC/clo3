#!/usr/bin/env python2

# Volume Upload Script
#
# @author Lawton C Mizell, Caleb Kitzmann
# Contact: alcamech@gmail.com, emperor.pickles@gmail.com

import os
import re
from pymongo import MongoClient
from lxml import etree
from datetime import datetime  # measure the speed of script

startTime = datetime.now()
directory = "../clo-xml-archive/"  # defines working directory

# Connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

# Set variables for lxml
xsltDoc = etree.parse("xml_styling.xslt")  # import xsl stylesheet
xsltTransformer = etree.XSLT(xsltDoc)  # define xml transformation function

# Select a particular volume for testing
volSelect = "30"

#############################
# Uploads the processed     #
# pages from an xml file #
# into mongodb.             #
#############################


class Account:
    def __init__(acc, head, xml_id, firstPage, slugline, sourceNote, recipient,
                 footnotes, docBody, sender, docDate, lastPage, docAuthor):
        acc.head = head
        acc.xml_id = xml_id


def upload_volume(volumeID, volume_dates, acknowledgements, introText, letters_to_carlyles, key_to_references, chronology):
    db.volumes.update_one(
        {"_id": str(volumeID)},
        {"$set": {
            "volume_dates": str(volume_dates),
            "acknowledgements": str(acknowledgements),
            "introduction.introText": str(introText),
            "letters_to_carlyles": str(letters_to_carlyles),
            "key_to_references": str(key_to_references),
            "chronology": str(chronology),
        }},
        upsert=True)


def upload_letters(volumeID, lettersArray):
    db.volumes.update_one(
        {"_id": str(volumeID)},
        {"$set": {"letters": lettersArray}}
    )


def upload_accounts(volumeID, accountsArray):
    db.volumes.update_one(
        {"_id": str(volumeID)},
        {"$set": {"accounts": accountsArray}}
    )


def htmlHexConverter(m):
    entity = m.group()
    hexcode = ("&#x2018;", "&#x2019;", "&#x2026;", "&#x2013;", "&#xa3;",
               "&#xbd;", "&#x2014;", "&#x201c;", "&#x201d;", "/", "&#xe0;",
               "&#xf9;", "&#xe4;", "&#xb0;", "&#xf6;", "&#xe9;", "&#xfc;",
               "&#38;", "&apos;")
    namecode = ("&lsquo;", "&rsquo;", "&hellip;", "&ndash;", "&pound;",
                "&frac12;", "&mdash;", "&ldquo;", "&rdquo;", "&sol;", "&agrave;",
                "&ugrave;", "&auml;", "&deg;", "&ouml;", "&eacute;", "&uuml;",
                "&amp;", "&#39;")
    if entity in namecode:
        i = namecode.index(entity)
        entity = hexcode[i]
    return entity


def sluglineGen(xml_id, head, humanDate, sender, recipient, firstPage, lastPage, volumeID):
    # ex: TC TO FREDERIC CHAPMAN ; july 2d, 1866; TC FREDERIC CHAPMAN DOI: 10.1215/lt-18660702-TC-FC-01 CL 44:1-1.
    # breakdown: <head><sender /> TO <addressee /></head> ; <docDate />; <sender /> <addressee /> DOI 10.1215/<xml:id /> <i>CL</i> <vol:id />:<firstpage />-<lastpage />.
    # head = " ".join(head.split())
    # slugline = "%s TO %s; %s; %s %s DOI 10.1215/%s <i>CL</i> %s:%s-%s. " % (
    #     sender, recipient, humanDate[0], sender, recipient, xml_id[0], volumeID, firstPage[0], lastPage[0])
    slugline = "%s TO %s; %s; DOI 10.1215/%s" % (
        sender, recipient, humanDate[0], xml_id[0])
    return slugline


def linkFix(m):
    ref = m.group(2)
    vol_id = m.group(1)
    body = m.group(3)
    prefix = "<a href=\"..volume/"
    newLink = m.group(0)

    if "biographical" in ref:
        newLink = "%s%s/biographicalNotes\">%s</a>" % (prefix, vol_id, body)
    elif re.match("pg-\\d+:\\d+?", ref):
        newLink = "%s%s/biographicalNotes\">%s</a>" % (prefix, vol_id, body)
    elif "introduction" in ref:
        newLink = "%s%s/introduction\">%s</a>" % (prefix, vol_id, body)
    elif re.match("pg-\\d+:\\D+?", ref):
        newLink = "%s%s/introduction\">%s</a>" % (prefix, vol_id, body)
    elif "jane" in ref:
        newLink = "%s%s/janeJournal\">%s</a>" % (prefix, vol_id, body)
    elif "geraldine" in ref:
        newLink = "%s%s/geraldineJewsbury\">%s</a>" % (prefix, vol_id, body)
    elif "in_memoriam" in ref:
        newLink = "%s%s/inMemoriam\">%s</a>" % (prefix, vol_id, body)
    elif "athanaeum" in ref:
        newLink = "%s%s/athanaeumAdvertisements\">%s</a>" % (prefix, vol_id, body)
    elif "ellen" in ref:
        newLink = "%s%s/ellenTwisleton\">%s</a>" % (prefix, vol_id, body)
    elif "acknowledgements" in ref:
        newLink = "%s%s/acknowledgements\">%s</a>" % (prefix, vol_id, body)
    elif "chronology" in ref:
        newLink = "%s%s/chronology\">%s</a>" % (prefix, vol_id, body)
    elif "comments" in ref:
        newLink = "%s%s/auroraComments\">%s</a>" % (prefix, vol_id, body)
    elif "simple-story" in ref:
        newLink = "%s%s/simpleStory\">%s</a>" % (prefix, vol_id, body)
    elif "references" in ref:
        newLink = "%s%s/key_to_references\">%s</a>" % (prefix, vol_id, body)
    elif "appendix" in ref:
        newLink = "%s%s/appendix\">%s</a>" % (prefix, vol_id, body)
    elif "letters-to" in ref:
        newLink = "%s%s/letters-to-the-carlyles\">%s</a>" % (prefix, vol_id, body)
    elif re.match("[\\d]{8}[^)]*?", ref):
        newLink = re.sub(
            "(<ref target=\"volume-\\d{2}\\/)([\\d]{8}[^)]*?)(?:\">|\\)\">)", "\\1lt-\\2\">", m.group(0))
    elif "oxforddnb" in ref:
        newLink = "<ref target=\"volume-%s/http://%s>%s</ref>" % (vol_id, ref, body)
    else:
        print "NO MATCH, link is as follows:\n" + m.group(0) + "\n"

    return newLink

###################################
# iterates through an xml file   #
# and parses associated data for  #
# each page.                      #
###################################


def main():
    # loop through xml files in directory
    dirList = os.listdir(directory)
    dirList.sort()
    for i, filename in enumerate(dirList, start=1):
        # if you just want to upload one volume, replace
        # str(i-1) with volSelect
        if filename.endswith("%s-P5.xml" % str(i-1)):
            print "%d/%d" % (i, len(dirList))
            print filename
            # get volume id from filename
            volumeID = ''.join(re.findall("\d{2}", filename))
            print(volumeID)
            file = open(os.path.join(directory, filename), "r")
            content = file.read()
            lettersArray = []
            accountsArray = []

            # convert html entities to their hex codes
            content = re.sub("&.{1,6}?;", htmlHexConverter, content)

            # converts loose "&" into the hex entity for "&"
            content = re.sub("&\\s|&(?=\\w?[^#])", "&#38;", content)

            # uses linkFix function to replace old links with usable ones
            content = re.sub(
                "<ref target=\"volume-(\\d{2})\\/([^lt\"]{2}.*?)>(.*?)</ref>", linkFix, content)

            # checks for any leftover broken links and logs them in "links.xml"
            links = re.findall("<ref target=\"volume-\\d{2}\\/[^lt\"]{2}.*?>.*?</ref>", content)
            with open("links.xml", "a") as f:
                f.write("\n" + volumeID + "\n")
                for link in links:
                    f.write(link+"\n")
                f.close()
            with open("log.xml", "w") as f:
                f.write(content)
                f.close()

            #####
            # volume-wide sections here
            #####
            # get volume_dates
            volume_datesMatch = re.findall(
                "<publicationStmt>(?:\n.*<p>.*)(?:\n.*)*?(?:.*?<date when=.*?>|\n.*?<date when=.*?>)(.*?)</date>(?:.*\n?<date when=.*?>(.*\n.*|.*?)</date>)?(?:.*</p>|\n.*</p>)", content)
            # volume_datesMatch = re.findall(
            # "<publicationStmt>(?:.|\n)*?(?:<p>.*?<date when=.*?>|<p>\n.*?<date when=.*?>)(.*?)</date>(?:.*\n?<date when=.*?>(.*\n.*|.*?)</date>)?(?:</p>|\n.*</p>)?", content)
            if volume_datesMatch:
                # join date range together
                volume_dates = " - ".join(volume_datesMatch[0])
                # join multiple lines
                volume_dates = str.join("", volume_dates.splitlines())
                # if only one date then remove the "-"
                if volume_dates.endswith(' - '):
                    volume_dates = volume_dates[:-len(' - ')]
            else:
                volume_dates = ''

            # get acknowledgements section
            acknowledgementsMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-acknowledgements\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if not acknowledgementsMatch:
                acknowledgementsMatch = re.findall(
                    "<div1 type=\"section\" id=\"ed-%s-acknowledgments\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if acknowledgementsMatch:
                acknowledgements = acknowledgementsMatch[0]
                xmlString = "<body>%s</body>" % acknowledgements

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                acknowledgements = str(xmlString)
            else:
                acknowledgements = ''

            # get introduction
            introductionMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-introduction\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if introductionMatch:
                introText = introductionMatch[0]
                xmlString = "<body>%s</body>" % introText

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                introText = str(xmlString)
                # if footnotes exist add as array to introduction
                introFootnotes = re.findall("<note.*?>(.*?)</note>",
                                            introductionMatch[0], re.DOTALL)
                if introFootnotes:
                    db.volumes.update_one({"_id": str(volumeID)}, {
                                          "$set": {"introduction.introFootnotes": introFootnotes}})
            else:
                introText = ''

            # get key-to-references
            key_to_referencesMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-key-to-references\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if key_to_referencesMatch:
                key_to_references = key_to_referencesMatch[0]
                xmlString = "<body>%s</body>" % key_to_references

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                key_to_references = str(xmlString)
            else:
                key_to_references = ''

            # get letters-to-carlyles
            letters_to_carlylesMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-letters-to-the-carlyles\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if letters_to_carlylesMatch:
                letters_to_carlyles = letters_to_carlylesMatch[0]
                xmlString = "<body>%s</body>" % letters_to_carlyles

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                letters_to_carlyles = str(xmlString)
            else:
                letters_to_carlyles = ''

            # get chronology
            chronologyMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-chronology\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if chronologyMatch:
                chronology = chronologyMatch[0]
                xmlString = "<body>%s</body>" % chronology

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                chronology = str(xmlString)
            else:
                chronology = ''

            ### Checks for special volume sections ###
            # check if rival_brothers exists and if so add to volume
            rival_brothersMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-The-Rival-Brothers:-Fragment-Of-A-Play-By-Jane-Baillie-Welsh\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if rival_brothersMatch:
                rival_brothers = rival_brothersMatch[0]
                xmlString = "<body>%s</body>" % rival_brothers

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                rival_brothers = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"rival_brothers": rival_brothers}})

            # check if biographical-notes exists and if so add to volume
            biographicalNotesMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-biographical-notes\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if biographicalNotesMatch:
                biographicalNotes = biographicalNotesMatch[0]
                xmlString = "<body>%s</body>" % biographicalNotes

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                biographicalNotes = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"biographicalNotes": biographicalNotes}})

            # check if in-memoriam exists and if so add to volume
            inMemoriamMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-in-memoriam\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if inMemoriamMatch:
                inMemoriam = inMemoriamMatch[0]
                xmlString = "<body>%s</body>" % inMemoriam

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                inMemoriam = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"inMemoriam": inMemoriam}})

            # check if jane-carlyle-notebook exists and if so add to volume
            janeNotebookMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-jane-carlyle-notebook\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if janeNotebookMatch:
                janeNotebook = janeNotebookMatch[0]
                xmlString = "<body>%s</body>" % janeNotebook

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                janeNotebook = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"janeNotebook": janeNotebook}})

            # check if simple-story-of-my-own-love exists and if so add to volume
            simpleStoryMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-simple-story-of-my-own-love\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if simpleStoryMatch:
                simpleStory = simpleStoryMatch[0]
                xmlString = "<body>%s</body>" % simpleStory

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                simpleStory = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"simpleStory": simpleStory}})

            # check if jane-welsh-carlyle-journal exists and if so add to volume
            janeJournalMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-jane-welsh-carlyle-journal\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if janeJournalMatch:
                janeJournal = janeJournalMatch[0]
                xmlString = "<body>%s</body>" % janeJournal

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                janeJournal = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"janeJournal.journalText": janeJournal}})
                
                # if footnotes exist add as array to introduction
                journalFootnotes = re.findall("<note.*?>(.*?)</note>",
                                            janeJournalMatch[0], re.DOTALL)
                if journalFootnotes:
                    db.volumes.update_one({"_id": str(volumeID)}, {
                                          "$set": {"janeJournal.journalFootnotes": journalFootnotes}})

            # check if geraldine-jewsbury-to-froude exists and if so add to volume
            geraldineJewsburyMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-geraldine-jewsbury-to-froude\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if geraldineJewsburyMatch:
                geraldineJewsbury = geraldineJewsburyMatch[0]
                xmlString = "<body>%s</body>" % geraldineJewsbury

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                geraldineJewsbury = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"geraldineJewsbury": geraldineJewsbury}})

            # check if ellen-twisleton-account-of-life-at-craigenputtoch exists and if so add to volume
            ellenTwisletonMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-ellen-twisleton-account-of-life-at-craigenputtoch\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if ellenTwisletonMatch:
                ellenTwisleton = ellenTwisletonMatch[0]
                xmlString = "<body>%s</body>" % ellenTwisleton

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                ellenTwisleton = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"ellenTwisleton": ellenTwisleton}})

            # check if athanaeum-advertisements exists and if so add to volume
            athanaeumAdvertisementsMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-athanaeum-advertisements\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if athanaeumAdvertisementsMatch:
                athanaeumAdvertisements = athanaeumAdvertisementsMatch[0]
                xmlString = "<body>%s</body>" % athanaeumAdvertisements

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                athanaeumAdvertisements = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"athanaeumAdvertisements": athanaeumAdvertisements}})

            # check if comments-on-aurora-leigh exists and if so add to volume
            auroraCommentsMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-comments-on-aurora-leigh\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if auroraCommentsMatch:
                auroraComments = auroraCommentsMatch[0]
                xmlString = "<body>%s</body>" % auroraComments

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                auroraComments = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"auroraComments": auroraComments}})

            # check if appendix exists and if so add to volume
            appendixMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-appendix\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if appendixMatch:
                appendix = appendixMatch[0]
                xmlString = "<body>%s</body>" % appendix

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                appendix = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"appendix": appendix}})

            # check if JWC-by-Robert-Scott-Tait exists and if so add to volume
            JWCbyTaitMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-JWC-by-Robert-Scott-Tait\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if JWCbyTaitMatch:
                JWCbyTait = JWCbyTaitMatch[0]
                xmlString = "<body>%s</body>" % JWCbyTait

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                JWCbyTait = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"JWCbyTait": JWCbyTait}})

            # check if TC-by-Robert-Scott-Tait exists and if so add to volume
            TCbyTaitMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-TC-by-Robert-Scott-Tait\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if TCbyTaitMatch:
                TCbyTait = TCbyTaitMatch[0]
                xmlString = "<body>%s</body>" % TCbyTait

                # get string to be transformed
                sourceDoc = etree.fromstring(xmlString)
                xmlString = xsltTransformer(sourceDoc)  # transform xml
                TCbyTait = str(xmlString)

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"TCbyTait": TCbyTait}})

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

            letterSection = re.findall("<div2 type=\"letters\">(.*?)</div2>",
                                       content, re.DOTALL)  # get all letter sections
            lettersMatch = re.findall("<div3 type=\"letter\">(.*?)</div3>",
                                      letterSection[0], re.DOTALL)  # find all letters in a volume

            # create the volume document
            upload_volume(volumeID, volume_dates, acknowledgements, introText,
                          letters_to_carlyles, key_to_references, chronology)
            print "found " + str(len(lettersMatch)) + \
                " letters for this volume: " + filename
            print "processing letters for this volume: " + filename

            try:
                # loop through each letter inside lettersMatch
                for letterContent in lettersMatch:
                    # print (letterContent)
                    letterContent = "<div3>" + letterContent + "</div3>"

                    xml_id = re.findall(
                        "<bibl xml:id=\"(.*?)\">", letterContent)

                    docDate = re.findall(
                        "<docDate value=\"(.*?)\"", letterContent)

                    firstPage = re.findall(
                        "<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                    lastPage = re.findall(
                        "<idno type=\"lastpage\">(.*?)</idno>", letterContent)

                    # check if there is a docAuthor
                    # volume 5, lt-18310400-TCAO-FMA-01 has two docAuthors
                    authorMatch = re.findall(
                        "<docAuthor>(?:\n.*)<name type=\"first\">(.*?)</name>(?:\n.*)<name type=\"last\">(.*?)</name>", letterContent)
                    if authorMatch:
                        docAuthor = " ".join(authorMatch[0])
                    else:
                        docAuthor = ''

                    # check if sender exists
                    senderMatch = re.findall(
                        "<person type=\"sender\">(.*?)</person>", letterContent, re.DOTALL)
                    if senderMatch:
                        sender = senderMatch[0]
                    else:
                        sender = ''

                    # check if there is a recipient
                    recipientMatch = re.findall(
                        "<person type=\"addressee\">(.*?)</person>", letterContent, re.DOTALL)
                    if recipientMatch:
                        recipient = recipientMatch[0]
                    else:
                        recipient = ''

                    # check if there is a sourcenote
                    sourceNoteMatch = re.findall(
                        "<sourceNote>(.*?)</sourceNote>", letterContent, re.DOTALL)
                    if sourceNoteMatch:
                        sourceNote = "<div>%s</div>" % sourceNoteMatch[0]
                        sourceDoc = etree.fromstring(sourceNote)
                        sourceNote = str(xsltTransformer(sourceDoc))
                    else:
                        sourceNote = None

                    docBody = re.findall(
                        "<docBody>(.*?)</docBody>", letterContent, re.DOTALL)

                    # check if head exists
                    headMatch = re.findall(
                        "<head>((?:.|\n)*?)</head>", letterContent, re.DOTALL)
                    if headMatch:
                        head = headMatch[0]
                    else:
                        head = ''

                    # check if there are any footnotes
                    footnotesMatch = re.findall(
                        "<note.*?>(.*?)</note>", letterContent, re.DOTALL)
                    if footnotesMatch:
                        # pull footnotes from docBody
                        footnotes = []
                        for footnote in footnotesMatch:
                            footnote = "<div>%s</div>" % footnote
                            sourceDoc = etree.fromstring(footnote)
                            footnote = str(xsltTransformer(sourceDoc))
                            footnotes.append(footnote)
                    else:
                        footnotes = None
                    # with open("log.html", "w") as f:
                    #     print >> f, letterContent

                    humanDate = re.findall("<docDate.*?>(.*?)</docDate>", letterContent, re.DOTALL)

                    # create slugline for beginning of each letter
                    slugline = sluglineGen(xml_id, head, humanDate, sender,
                                           recipient, firstPage, lastPage, volumeID)

                    # Create header for the top of each letter
                    header = "<p><p>%s</p></p><p><strong>%s TO %s</strong></p>" % (
                        slugline, sender, recipient)
                    # Combine the header with the rest of the letter
                    docBody = header + ''.join(docBody)
                    # docBody = re.sub("<note .*?>.*?</note>", "", docBodyHeader)
                    # Enclose each letter inside <docBody> tag for the lxml parsing
                    docBody = "<docBody>%s</docBody>" % docBody

                    sourceDoc = etree.fromstring(docBody)
                    docBody = str(xsltTransformer(sourceDoc))
                    # print docBody

                    docBody = "<div id=\"letterText\">%s</div>" % docBody

                    # add all content to end of letters array
                    lettersArray.append({
                        "xml_id": xml_id[0],
                        "docDate": docDate[0].strip(),
                        "firstPage": firstPage[0],
                        "lastPage": lastPage[0],
                        "docAuthor": docAuthor,
                        "sender": sender,
                        "recipient": recipient,
                        "sourceNote": sourceNote,
                        "docBody": docBody,
                        "head": head,
                        "footnotes": footnotes,
                        "slugline": slugline,
                    })

                    # uploads the letters
                    upload_letters(volumeID, lettersArray)

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
                print ("\033[31m {}\033[00m" .format(str(e))+"\n")

            # check if another letter section exists
            if len(letterSection) > 1:
                # find all accounts in a volume
                accountMatch = re.findall(
                    "<div3 type=\"letter\">(.*?)</div3>", letterSection[1], re.DOTALL)
                print "found " + str(len(accountMatch)) + \
                    " accounts for this volume: " + filename
                print "processing accounts for this volume: " + filename

                try:
                    # loop through each letter inside lettersMatch
                    for letterContent in accountMatch:
                        letterContent = "<div3>" + letterContent + "</div3>"

                        xml_id = re.findall(
                            "<bibl xml:id=\"(.*?)\">", letterContent)

                        docDate = re.findall(
                            "<docDate value=\"(.*?)\"", letterContent)

                        firstPage = re.findall(
                            "<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                        lastPage = re.findall(
                            "<idno type=\"lastpage\">(.*?)</idno>", letterContent)

                        # check if there is a docAuthor
                        # volume 5, lt-18310400-TCAO-FMA-01 has two docAuthors
                        authorMatch = re.findall(
                            "<docAuthor>(?:\n.*)<name type=\"first\">(.*?)</name>(?:\n.*)<name type=\"last\">(.*?)</name>", letterContent)
                        if authorMatch:
                            docAuthor = " ".join(authorMatch[0])
                        else:
                            docAuthor = ''

                        # check if sender exists
                        senderMatch = re.findall(
                            "<person type=\"sender\">(.*?)</person>", letterContent, re.DOTALL)
                        if senderMatch:
                            sender = senderMatch[0]
                        else:
                            sender = ''

                        # check if there is a recipient
                        recipientMatch = re.findall(
                            "<person type=\"addressee\">(.*?)</person>", letterContent, re.DOTALL)
                        if recipientMatch:
                            recipient = recipientMatch[0]
                        else:
                            recipient = ''

                        # check if there is a sourcenote
                        sourceNoteMatch = re.findall(
                            "<sourceNote>(.*?)</sourceNote>", letterContent, re.DOTALL)
                        if sourceNoteMatch:
                            sourceNote = sourceNoteMatch[0]
                        else:
                            sourceNote = ''

                        docBody = re.findall(
                            "<docBody>(.*?)</docBody>", letterContent, re.DOTALL)

                        # check if head exists
                        headMatch = re.findall(
                            "<head>((?:.|\n)*?)</head>", letterContent, re.DOTALL)
                        if headMatch:
                            head = headMatch[0]
                        else:
                            head = ''

                        # check if there are any footnotes
                        footnotesMatch = re.findall(
                            "<note.*?>(.*?)</note>", letterContent, re.DOTALL)
                        if footnotesMatch:
                            # pull footnotes from docBody
                            footnotes = []
                            for footnote in footnotesMatch:
                                footnote = "<div>%s</div>" % footnote
                                sourceDoc = etree.fromstring(footnote)
                                footnote = str(xsltTransformer(sourceDoc))
                                footnotes.append(footnote)
                        else:
                            footnotes = ''
                        # with open("log.html", "w") as f:
                        #     print >> f, letterContent

                        humanDate = re.findall("<docDate.*?>(.*?)</docDate>",
                                               letterContent, re.DOTALL)

                        # create slugline for beginning of each letter
                        slugline = sluglineGen(xml_id, head, humanDate, sender,
                                               recipient, firstPage, lastPage, volumeID)

                        # Create header for the top of each letter
                        header = "<p><p>%s</p></p><p><strong>%s TO %s</strong></p>" % (
                            slugline, sender, recipient)
                        # Combine the header with the rest of the letter
                        docBody = header + ''.join(docBody)
                        # docBody = re.sub("<note .*?>.*?</note>", "", docBodyHeader)
                        # Enclose each letter inside <docBody> tag for the lxml parsing
                        docBody = "<docBody>%s</docBody>" % docBody

                        sourceDoc = etree.fromstring(docBody)
                        docBody = str(xsltTransformer(sourceDoc))
                        # print docBody

                        docBody = "<div id=\"letterText\">%s</div>" % docBody

                        # account = Account(head, xml_id[0], firstPage[0], slugline, sourceNote,
                        #                   recipient, footnotes, docBody, sender, docDate, lastPage[0], docAuthor)

                        # add all content to end of letters array
                        accountsArray.append({
                            "xml_id": xml_id[0],
                            "docDate": docDate[0].strip(),
                            "firstPage": firstPage[0],
                            "lastPage": lastPage[0],
                            "docAuthor": docAuthor,
                            "sender": sender,
                            "recipient": recipient,
                            "sourceNote": sourceNote,
                            "docBody": docBody,
                            "head": head,
                            "footnotes": footnotes,
                            "slugline": slugline,
                        })

                        # uploads the letters
                        # upload_accounts(volumeID, accountsArray)

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
                    upload_accounts(volumeID, accountsArray)
                    print "Records successfully updated\n"
                except Exception as e:
                    print ("\033[31m {}\033[00m" .format(str(e))+"\n")


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
