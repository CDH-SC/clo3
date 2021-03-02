import pprint
pp = pprint.PrettyPrinter(indent=4)

from bs4 import BeautifulSoup as bs

filePath = 'rubenstein_list.html'
manuscript = []
letter = []

with open(filePath) as f:
	soup = bs(f, 'html.parser')

links = soup.find_all('a')
for link in links:
	print(link.string)
	href = link['href']
	if 'idn.duke.edu' in href:
		manuscript.append(href)
	elif 'carlyleletters' in href:
		letter.append(href)

print('Manuscript Links\n')
pp.pprint(manuscript)

print('\n\nLetter Links\n')
pp.pprint(letter)