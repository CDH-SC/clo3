from bs4 import BeautifulSoup as bs
import re
import os
import pprint as pp
from pymongo import MongoClient
from datetime import datetime  # measure the speed of script

startTime = datetime.now()
directory = './'

client = MongoClient('mongodb://localhost:27017/')
db = client.clo_test

volume = {}
l_array = []

def main():
	# loop through xml files in directory
	dirList = os.listdir(directory)
	dirList.sort()
	for i, filename in enumerate(dirList, start=1):
    	# if you just want to upload one volume, replace
		# str(i-1) with volSelect
		if filename.endswith('P5.xml'):
			file = open(os.path.join(directory, filename), 'r')
			content = file.read()
			bs_content = bs(content, 'xml')

			# get volume ID from filename
			volumeID = ''.join(re.findall('\d{2}', filename))

			# get volume dates from header
			header = bs_content.biblFull.find_all('date')
			volume_dates = header[0].string + ' - ' + header[1].string
			print(volume_dates)

			front = bs_content.find_all('div1')
			for section in front:
				print(section['id'])
				name = re.match('.{6}(.*)', section['id']).group(1)
				
				# fix section names to match MongoDB fields
				if 'letters-to' in name:
					name = 'letters_to_carlyles'
				elif 'key-to' in name:
					name = 'key_to_references'

				# join contents of section body together into single string
				body = ' '.join(map(str, section.contents))

				volume.update({name: body})
				# pp.pprint(volume, depth=1)
				# with open('log.xml', 'a') as f:
				# 	f.write('\n' + section['id'] + '\n')
				# 	f.write(body)
				# 	f.close()

			db.volumes.update_one(
				{'_id': str(volumeID)},
				{'$set': volume}, upsert=True
			)
			
			letters = bs_content.find_all('div3')
			print(letters[0].contents)
			for l in letters:
				xml_id = l.bibl['xml:id']
				docDate = l.docDate['value']
				print(docDate)

				firstPage = l.select('idno[type="firstpage"]')[0].string
				lastPage = l.select('idno[type="lastpage"]')[0].string

				docAuthor = ' '.join(l.docAuthor.stripped_strings)
				sender = l.select('person[type="sender"]')[0].string
				recipient = l.select('person[type="addressee"]')[0].string

				sourceNote = l.sourceNote.contents
				docBody = l.docBody.contents
				footnotes = l.find_all('note')

				letter = {	'xml_id': xml_id,
							'docDate': docDate,
							'firstPage': firstPage,
							'lastPage': lastPage,
							'docAuthor': docAuthor,
							'sender': sender,
							'recipient': recipient,
							'sourceNote': 'test',
							'docBody': 'test',
							'footnotes': 'footnotes'
						}

				# pp.pprint(letter, indent=3)

				l_array.append(letter)

			db.volumes.update_many(
				{'_id': str(volumeID)},
				{'$set': {'letters': l_array}}, upsert=True
			)


if __name__ == '__main__':
    main()
    print(datetime.now() - startTime)