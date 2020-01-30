from bs4 import BeautifulSoup as bs
import re
import os
import pprint as pp
from pymongo import MongoClient
from lxml import etree
from datetime import datetime

startTime = datetime.now()
directory = '../../clo-xml-archive/'

client = MongoClient('mongodb://localhost:27017/')
db = client.clo_test

xsltDoc = etree.parse('xml_styling.xslt')
xsltTransformer = etree.XSLT(xsltDoc)


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


def linkFix(m):
	ref = m.group(2)
	vol_id = m.group(1)
	body = m.group(3)
	prefix = '<a href=\"..volume/'
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


def sluglineGen(xml_id, humanDate, sender, recipient):
	# ex: TC TO FREDERIC CHAPMAN ; july 2d, 1866; TC FREDERIC CHAPMAN DOI: 10.1215/lt-18660702-TC-FC-01 CL 44:1-1.
	# breakdown: <head><sender /> TO <addressee /></head> ; <docDate />; <sender /> <addressee /> DOI 10.1215/<xml:id /> <i>CL</i> <vol:id />:<firstpage />-<lastpage />.
	# slugline = "%s TO %s; %s; %s %s DOI 10.1215/%s <i>CL</i> %s:%s-%s. " % (
	# sender, recipient, humanDate[0], sender, recipient, xml_id[0], volumeID, firstPage[0], lastPage[0])
	if recipient:
		slugline = '%s TO %s; %s; DOI 10.1215/%s' % (sender, recipient, humanDate, xml_id)
	else:
		slugline = '%s; %s; DOI 10.1215/%s' % (sender, humanDate, xml_id)
	return slugline


def xsltFormat(inputString):
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
	footnotes = []
	for f in footnotesArray:
		footnote = xsltFormat(''.join(map(str, f.contents)))
		footnotes.append(footnote)
	return footnotes


def main():
	# loop through xml files in directory
	dirList = os.listdir(directory)
	dirList.sort()
	for i, filename in enumerate(dirList, start=1):
		if filename.endswith('-P5.xml'):
			file = open(os.path.join(directory, filename), 'r')
			content = file.read()
			bs_content = bs(content, 'xml')
			
			volume = {}
			letterArray = []

			# with open('log.xml', 'w') as f:
			# 	# f.write(''.join(map(str, bs_content.contents)))
			# 	f.write(bs_content)

			# get volume ID from filename
			volumeID = ''.join(re.findall('\d{2}', filename))

			# get volume dates from header
			dates = bs_content.biblFull.find_all('date')
			if int(dates[1]['when'][:4]) < 1900:
				volume_dates = str.join('', (dates[0].string + ' - ' + dates[1].string).splitlines())
			elif int(dates[0]['when'][:4]) < 1900:
				volume_dates = dates[0].string
			else: volume_dates = 'Not found'
			print(volumeID)
			print(volume_dates)


			front = bs_content.find_all('div1')
			for section in front:
				name = re.match('.{6}(.*)', section['id']).group(1)
				
				# fix section names to match MongoDB fields
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
				print(name)

				# check for any footnotes in section
				footnotesArray = section.find_all('note')
				if footnotesArray:
					footnotes = footnoteFormat(footnotesArray)

				# join contents of section body together into single string and format with xslt
				body = xsltFormat(' '.join(map(str, section.contents)))

				if name == 'introduction':
					body = {
						'introText': body,
						'introFootnotes': footnotes,
						}

				volume.update({name: body})


			db.volumes.update_one(
				{'_id': str(volumeID)},
				{'$set': volume}, upsert=True
			)


			letters = bs_content.find_all('div3')
			print('%d letters found\n' % len(letters))
			for l in letters:
				xml_id = l.bibl['xml:id']
				docDate = l.docDate['value']
				humanDate = l.docDate.string

				# pp.pprint(xml_id, indent=4)

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

				sourceNote = xsltFormat(' '.join(map(str, l.sourceNote.contents)))
				docBody = xsltFormat(' '.join(map(str, l.docBody.contents)))

				slugline = sluglineGen(xml_id, humanDate, sender, recipient)

				if recipient:
					header = "<p>%s</p><p><strong>%s TO %s</strong></p>" % (slugline, sender, recipient)
				else:
					header = "<p>%s</p><p><strong>%s</strong></p>" % (slugline, sender)
				docBody = header + docBody

				footnotesArray = l.find_all('note')
				footnotes = footnoteFormat(footnotesArray)

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


			db.volumes.update_many(
				{'_id': str(volumeID)},
				{'$set': {'letters': letterArray}}, upsert=True
			)


if __name__ == '__main__':
	main()
	print(datetime.now() - startTime)