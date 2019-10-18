import os
import re
from pprint import pprint
from lxml import etree

directory = "../clo-xml-archive/"  # defines working directory

# Set variables for lxml
xsltDoc = etree.parse("xml_styling.xslt")  # import xsl stylesheet
xsltTransformer = etree.XSLT(xsltDoc)  # define xml transformation function

for filename in os.listdir(directory):
    if filename.endswith("45-P5.xml"):
        print filename
        # get volume id from filename
        volumeID = ''.join(re.findall("\\d{2}", filename))
        print(volumeID)
        file = open(os.path.join(directory, filename), "r")
        content = file.read()

        # links to biographical notes
        # content = re.sub(
        #     "<ref target=\"volume-(\d{2})\/.{6}biographical-notes\">(.*?)</ref>", "<a href=\"../volume/\\1/biographicalNotes\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\d{2})\/pg-\\d+:\\d+?\">(.*?)</ref>", "<a href=\"../volume/\\1/biographicalNotes\">\\2</a>", content, re.DOTALL)
        #
        # # links to introduction
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/pg-\\d+:\\D+?\">(.*?)</ref>", "<a href=\"../volume/\\1/introduction\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/[^lt]{2}.{4}introduction\">(.*?)</ref>", "<a href=\"../volume/\\1/introduction\">\\2</a>", content, re.DOTALL)
        #
        # # fix letter links missing the beginning "lt-"
        # content = re.sub(
        #     "(<ref target=\"volume-\\d{2}\\/)([\\d]{8}[^)]*?)(?:\">|\\)\">)", "\\1lt-\\2\">", content, re.DOTALL)
        #
        # # links to special cases
        # content = re.sub(
        #     "<ref target=\"volume-(\d{2})\/.{6}jane.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/janeJournal\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}geraldine.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/geraldineJewsbury\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}in_memoriam.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/inMemoriam\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}athanaeum-advertisements.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/athanaeumAdvertisements\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}ellen.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/ellenTwisleton\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}acknowledgements\">(.*?)</ref>", "<a href=\"../volume/\\1/acknowledgements\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}chronology\">(.*?)</ref>", "<a href=\"../volume/\\1/chronology\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}comments.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/auroraComments\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}simple-story.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/simpleStory\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}key-to-references.*?\">(.*?)</ref>", "<a href=\"../volume/\\1/key_to_references\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}appendix\">(.*?)</ref>", "<a href=\"../volume/\\1/appendix\">\\2</a>", content, re.DOTALL)
        # content = re.sub(
        #     "<ref target=\"volume-(\\d{2})\\/.{6}letters-to-the-carlyles\">(.*?)</ref>", "<a href=\"../volume/\\1/letters-to-the-carlyles\">\\2</a>", content, re.DOTALL)

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
                newLink = "%s%s/http://%s\">%s</a>" % (prefix, vol_id, ref, body)
            else:
                print "NO MATCH, link is as follows:\n" + m.group(0) + "\n"

            return newLink

        content = re.sub(
            "<ref target=\"volume-(\\d{2})\\/([^lt\"]{2}.*?)>(.*?)</ref>", linkFix, content)

        def htmlHexConverter(m):
            entity = m.group()
            hexcode = ("&#x2018;", "&#x2019;")
            namecode = ("&lsquo;", "&rsquo;")

            if entity in namecode:
                print entity
                i = namecode.index(entity)
                entity = hexcode[i]
                print entity + "\n"
            return entity

        content = re.sub("&.{0,6};", htmlHexConverter, content)

        # xmlString = content
        # sourceDoc = etree.fromstring(xmlString)
        # xmlString = xsltTransformer(sourceDoc)  # transform xml
        # content = str(xmlString)

        # links = re.findall("<ref target=\"volume-\\d{2}\\/[^lt\"]{2}.*?>.*?</ref>", content)
        links = re.findall("<figure>.*?</figure>", content, re.DOTALL)

        with open("links.xml", "a") as f:
            f.write("\n" + volumeID + "\n")
            for link in links:
                f.write(link+"\n")
            f.close()
        with open("log.xml", "w") as f:
            f.write(content)
            f.close()
        content = None
        f.close()
