#!/usr/bin/env python3

""" Volume Upload Script

Given a directory of xml files it will parse each file
and format it into usable html before uploading each volume
to the MongoDB database
 """

# standard library
import re
import os
import json
from datetime import datetime

# 3rd party packages
from lxml import etree
from pymongo import MongoClient
from bs4 import BeautifulSoup as bs

# start timing of script
startTime = datetime.now()
# working directory for xml files
directory = '../../clo-xml-archive/'

# establish connection to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.clo

# load xslt stylesheet for later styling
xsltDoc = etree.parse('xml_styling.xslt')
xsltTransformer = etree.XSLT(xsltDoc)


def htmlHexConverter(m):
	""" Convert HTML entities to their hexcode values to prevent errors
	when using XSLT styling """
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


def linkFix(m):
	""" Convert <ref> tags in XML into <a href> tags that point to
	the correct urls of the site """
	ref = m.group(2)
	vol_id = m.group(1)
	body = m.group(3)
	prefix = '<a href=\"volume/'
	newLink = m.group(0)

	if 'biographical' in ref:
		newLink = '%s%s/biographicalNotes\">%s</a>' % (prefix, vol_id, body)
	elif re.match('pg-\\d+:\\d+?', ref):
		newLink = '%s%s/biographicalNotes\">%s</a>' % (prefix, vol_id, body)
	elif 'introduction' in ref:
		newLink = '%s%s/introduction\">%s</a>' % (prefix, vol_id, body)
	elif re.match('pg-\\d+:\\D+?', ref):
		newLink = '%s%s/introduction\">%s</a>' % (prefix, vol_id, body)
	elif 'jane' in ref:
		newLink = '%s%s/janeJournal\">%s</a>' % (prefix, vol_id, body)
	elif 'geraldine' in ref:
		newLink = '%s%s/geraldineJewsbury\">%s</a>' % (prefix, vol_id, body)
	elif 'in_memoriam' in ref:
		newLink = '%s%s/inMemoriam\">%s</a>' % (prefix, vol_id, body)
	elif 'athanaeum' in ref:
		newLink = '%s%s/athanaeumAdvertisements\">%s</a>' % (prefix, vol_id, body)
	elif 'ellen' in ref:
		newLink = '%s%s/ellenTwisleton\">%s</a>' % (prefix, vol_id, body)
	elif 'acknowledgements' in ref:
		newLink = '%s%s/acknowledgements\">%s</a>' % (prefix, vol_id, body)
	elif 'chronology' in ref:
		newLink = '%s%s/chronology\">%s</a>' % (prefix, vol_id, body)
	elif 'comments' in ref:
		newLink = '%s%s/auroraComments\">%s</a>' % (prefix, vol_id, body)
	elif 'simple-story' in ref:
		newLink = '%s%s/simpleStory\">%s</a>' % (prefix, vol_id, body)
	elif 'references' in ref:
		newLink = '%s%s/key_to_references\">%s</a>' % (prefix, vol_id, body)
	elif 'appendix' in ref:
		newLink = '%s%s/appendix\">%s</a>' % (prefix, vol_id, body)
	elif 'letters-to' in ref:
		newLink = '%s%s/letters-to-the-carlyles\">%s</a>' % (prefix, vol_id, body)
	elif re.match('[\\d]{8}[^)]*?', ref):
		newLink = re.sub(
			'(<ref target=\"volume-\\d{2}\\/)([\\d]{8}[^)]*?)(?:\">|\\)\">)', '\\1lt-\\2\">', m.group(0))
	elif 'oxforddnb' in ref:
		newLink = '<ref target=\"volume-%s/http://%s>%s</ref>' % (vol_id, ref, body)
	else:
		print('NO MATCH, link is as follows:\n' + m.group(0) + '\n')
	return newLink


def nameFix(name):
	""" Rename the front sections of the XML to match the MongoDB naming sceme """
	if 'letters-to' in name:
		name = 'letters_to_carlyles'
	elif 'key-to' in name:
		name = 'key_to_references'
	elif 'Rival-Brothers' in name:
		name = 'rival_brothers'
	elif 'biographical' in name:
		name = 'biographicalNotes'
	elif 'in-memoriam' in name:
		name = 'inMemoriam'
	elif 'JWC-by-Robert' in name:
		name = 'JWCbyTait'
	elif 'TC-by-Robert' in name:
		name = 'TCbyTait'
	elif 'carlyle-notebook' in name:
		name = 'janeNotebook'
	elif 'carlyle-journal' in name:
		name = 'janeJournal'
	elif 'simple-story' in name:
		name = 'simpleStory'
	elif 'geraldine-jewsbury' in name:
		name = 'geraldineJewsbury'
	elif 'ellen-twisleton' in name:
		name = 'ellenTwisleton'
	elif 'athanaeum' in name:
		name = 'athanaeumAdvertisements'
	elif 'aurora-leigh' in name:
		name = 'auroraComments'
	return name


def sluglineGen(xml_id, humanDate, sender, recipient):
	""" Generate the slugline to attach to the front of each letter

	ex: TC TO FREDERIC CHAPMAN; july 2d, 1866; DOI 10.1215/lt-18660702-TC-FC-01.
	XML breakdown: <head><sender /> TO <addressee /></head>; <docDate />; DOI 10.1215/<xml:id />."""

	if recipient:
		slugline = '%s TO %s; %s; DOI 10.1215/%s' % (sender, recipient, humanDate, xml_id)
	else:
		slugline = '%s; %s; DOI 10.1215/%s' % (sender, humanDate, xml_id)
	return slugline


def xsltFormat(inputString):
	""" Apply XSLT stylesheet to input XML """

	# convert html entities to their hex codes
	inputString = re.sub('&.{1,6}?;', htmlHexConverter, inputString)
	# converts loose "&" into the hex entity for "&"
	inputString = re.sub('&\\s|&(?=\\w?[^#])', '&#38;', inputString)
	# fix any broken links
	inputString = re.sub("<ref target=\"volume-(\\d{2})\\/([^lt\"]{2}.*?)>(.*?)</ref>", linkFix, inputString)

	sourceDoc = etree.fromstring('<div>%s</div>' % inputString)
	formattedDoc = str(xsltTransformer(sourceDoc))

	return formattedDoc


def footnoteFormat(footnotesArray):
	""" Apply XSLT to each footnote in given array """
	footnotes = []
	for f in footnotesArray:
		footnote = xsltFormat(''.join(map(str, f.contents)))
		footnotes.append(footnote)
	return footnotes


def letterUpload(array, letterType, volumeID):
	""" Parse and upload any letters/accounts """
	print('%d %s found' % (len(array), letterType))
	letterArray = []

	for l in array:
		xml_id = l.bibl['xml:id']
		docDate = l.docDate['value']
		humanDate = ''.join(l.docDate.strings)

		firstPage = l.select('idno[type="firstpage"]')[0].string
		lastPage = l.select('idno[type="lastpage"]')[0].string

		if l.docAuthor:
			docAuthor = ' '.join(l.docAuthor.stripped_strings)
		else: docAuthor = None

		if l.select('person[type="sender"]'):
			sender = l.select('person[type="sender"]')[0].string
		else: sender = None

		if l.select('person[type="addressee"]'):
			recipient = l.select('person[type="addressee"]')[0].string
		else: recipient = None

		if l.sourceNote.contents:
			sourceNote = xsltFormat(''.join(map(str, l.sourceNote.contents)))
		else: sourceNote = None
		docBody = xsltFormat(str(l.docBody))

		slugline = sluglineGen(xml_id, humanDate, sender, recipient)

		if recipient:
			header = "<p>%s</p><p><strong>%s TO %s</strong></p>" % (slugline, sender, recipient)
		else:
			header = "<p>%s</p><p><strong>%s</strong></p>" % (slugline, sender)
		docBody = header + docBody

		footnotesArray = l.find_all('note')
		if footnotesArray:
			footnotes = footnoteFormat(footnotesArray)
		else: footnotes = None

		letter = {
			'xml_id': xml_id,
			'docDate': docDate,
			'firstPage': firstPage,
			'lastPage': lastPage,
			'docAuthor': docAuthor,
			'sender': sender,
			'recipient': recipient,
			'sourceNote': sourceNote,
			'docBody': docBody,
			'footnotes': footnotes,
		}
		letterArray.append(letter)

	try:
		db.volumes.update_many(
			{'_id': str(volumeID)},
			{'$set': {letterType: letterArray}}, upsert=True
		)
		print('%s successfully uploaded\n' % letterType)
	except Exception as e: print(e)


def main():
	# get frontice piece objects from json file
	with open('%sfrontice.json' % directory) as f:
		fronticePieces = json.load(f)

	# loop through xml files in directory
	dirList = os.listdir(directory)
	dirList.sort()
	for i, filename in enumerate(dirList, start=1):
		if filename.endswith('-P5.xml'):
			file = open(os.path.join(directory, filename), 'r')
			content = file.read()
			bs_content = bs(content, 'xml')
			
			volume = {}

			# get volume ID from filename
			volumeID = ''.join(re.findall('\d{2}', filename))

			# get volume dates from header
			dates = bs_content.biblFull.find_all('date')
			if int(dates[1]['when'][:4]) < 1900:
				volumeDates = str.join('', (dates[0].string + ' - ' + dates[1].string).splitlines())
			elif int(dates[0]['when'][:4]) < 1900:
				volumeDates = dates[0].string
			else: volumeDates = 'Not found'

			volume.update({'volume_dates': volumeDates})
			print('Volume ' + volumeID)

			hasFootnotes = [
				'introduction',
				'acknowledgements',
				'rival_brothers',
				'janeJournal',
				'janeNotebook',
				'simpleStory',
				'geraldineJewsbury',
				'ellenTwisleton',
			]


			front = bs_content.find_all('div1')
			for section in front:
				name = re.match('.{6}(.*)', section['id']).group(1)
				
				# fix section names to match MongoDB fields
				name = nameFix(name)

				# check for any footnotes in section
				footnotesArray = section.find_all('note')
				if footnotesArray:
					footnotes = footnoteFormat(footnotesArray)
				else: footnotes = None

				# join contents of section body together into single string and format with xslt
				# body = xsltFormat(' '.join(map(str, section.contents)))
				body = xsltFormat(str(section))

				if name in hasFootnotes:
					body = {
						'body': body,
						'footnotes': footnotes
					}
				volume.update({name: body})

			# create frontice piece object
			frontice_piece = {
				'imageUrl': fronticePieces.get(volumeID)['imageUrl'],
				'imageCaption': fronticePieces.get(volumeID)['imageCaption']
			}
			volume.update({'frontice_piece': frontice_piece})
			print('%d front sections found' % len(volume))

			try:
				db.volumes.update_one(
					{'_id': str(volumeID)},
					{'$set': volume}, upsert=True
				)
				print('Front sections successfully uploaded')
			except Exception as e: print(e)

			# get all letters in volume and check for any accounts (eg: vol43)
			letterSections = bs_content.find_all('div2')
			if letterSections[0]:
				letters = letterSections[0].find_all('div3')
				letterUpload(letters, 'letters', volumeID)
			if len(letterSections) > 1:
				accounts = letterSections[1].find_all('div3')
				letterUpload(accounts, 'accounts', volumeID)


if __name__ == '__main__':
	main()
	# print script runtime
	print(datetime.now() - startTime)