import os
import sys
import re
from pymongo import MongoClient
from lxml import etree
from datetime import datetime

startTime = datetime.now()
directory = "../col_xml_archive/"

# Connect to Mongodb
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

# Set variables for lxml
xsltDoc = etree.parse("xml_styling.xslt")  # import xsl stylesheet
xsltTransformer = etree.XSLT(xsltDoc)  # define xml transformation function


def upload_letters(volumeID, lettersArray):
    db.volumes.update_one(
        {"_id": str(volumeID)},
        {"$set": {"letters": lettersArray}}
    )


def main():
    # loop through xml files in directory
    for filename in os.listdir(directory):
        if filename.endswith("33-P5.xml"):
            print filename
            lettersArray = []
            volumeID = ''.join(re.findall("\d{2}", filename))  # get volume id from filename
            file = open(os.path.join(directory, filename), "r")
            content = file.read()

            # get letters-to-carlyles
            letters_to_carlylesMatch = re.findall(
                "<div1 type=\"section\" id=\"ed-%s-letters-to-the-carlyles\">(.*?)</div1>" % volumeID, content, re.DOTALL)
            if letters_to_carlylesMatch:
                letters_to_carlyles = letters_to_carlylesMatch[0]
                letters_to_carlyles = "<body>%s</body>" % letters_to_carlyles

                sourceDoc = etree.fromstring(letters_to_carlyles)  # get string to be transformed
                letters_to_carlyles = xsltTransformer(sourceDoc)  # transform xml

                db.volumes.update_one({"_id": str(volumeID)}, {
                                      "$set": {"letters_to_carlyles": str(letters_to_carlyles)}})
            else:
                letters_to_carlyles = ''

            letterSection = re.findall("<div2 type=\"letters\">(.*?)</div2>",
                                       content, re.DOTALL)  # get all letter sections
            lettersMatch = re.findall("<div3 type=\"letter\">(.*?)</div3>",
                                      letterSection[0], re.DOTALL)  # find all letters in a volume

            print "found "+str(len(lettersMatch))+" letters for this volume: "+filename
            print "processing letters for this volume: "+filename

            try:
                # loop through each letter inside lettersMatch
                for letterContent in lettersMatch:
                    xml_id = re.findall("<bibl xml:id=\"(.*?)\">", letterContent)

                    docDate = re.findall(
                        "<docDate value=(?:.|\n)*?>(?:(?:.*|\n.*)<pb id=.*?/>)?(\n.*?|.*?)(?:</docDate>|\n.*</docDate>)", letterContent)
                    # join dates together, remove new line characters, and strip leading whitespace
                    docDate = "".join(docDate[0]).replace('\r\n', '').lstrip()

                    firstPage = re.findall("<idno type=\"firstpage\">(.*?)</idno>", letterContent)
                    lastPage = re.findall("<idno type=\"lastpage\">(.*?)</idno>", letterContent)

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
                        "<person type=\"sender\">(.*?)</person>", letterContent)
                    if senderMatch:
                        sender = senderMatch[0]
                    else:
                        sender = ''

                    # check if there is a recipient
                    recipientMatch = re.findall(
                        "<person type=\"addressee\">(.*?)</person>", letterContent)
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

                    header = "<p><strong>" + sender + " TO " + recipient + \
                        "</strong></p>"  # Create header for the top of each letter
                    docBody = header + docBody[0]  # Combine the header with the rest of the letter
                    # docBody = re.sub("<note .*?>.*?</note>", "", docBodyHeader)
                    # Enclose each letter inside <docBody> tag for the lxml parsing
                    docBody = "<docBody>%s</docBody>" % docBody

                    sourceDoc = etree.fromstring(docBody)
                    docBody = str(xsltTransformer(sourceDoc))
                    print docBody

                    # print "\n"+str(outputDoc)
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

                    upload_letters(volumeID, lettersArray)  # uploads the letters

                print "Records successfully updated\n"
            except Exception as e:
                print str(e)


if __name__ == '__main__':
    main()
    print datetime.now() - startTime
