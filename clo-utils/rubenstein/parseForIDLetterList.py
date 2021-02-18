#NOTE: this script makes the IDs off by one due to an

from bs4 import BeautifulSoup as bs

filePath = 'rubenstein_list.html'
print('IDs           CLO link')
print('---           --------')

with open(filePath) as f:
	soup = bs(f, 'html.parser')

idNum = 1
IDs = soup.find_all('a')
for index, id in enumerate(IDs):
    href = id['href']
    if 'duke.edu' in href and idNum < 139:
        print(idNum)
        idNum = idNum + 1
    elif 'carlyleletters' in href and idNum < 139:
        cloid = href[47:len(href)]
        print(cloid)
