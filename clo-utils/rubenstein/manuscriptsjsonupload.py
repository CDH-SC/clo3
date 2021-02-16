
import json
import os

def getItemNum(num):
    numstr = str(num)
    if num < 10:
        return "Item00"+numstr
    elif num < 100:
        return "Item0"+numstr
    else:
        return "Item"+numstr

dictionary = {}

with open("IDLetterList.txt", "r") as file:
    for i, line in enumerate(file):
        if "lt" in line:
            #key = get xml id substring
            itemNum = getItemNum(i-1)
            filePath = "../../clo-angular/src/assets/rubenstein_manuscripts/" + itemNum
            print(filePath)
            print("--------")
            for entry in os.listdir(filePath):
                #create array of strings of images in order
            #dictionary[key] = array


# dictionary = {
# "lt-18330228-TC-JHLH-01": ["John", "Mary"],
# "lt-18330228-TC-JHLH-05": ["Stella", "Dante"],
# "lt-18330228-TC-JHLH-08": ["Hi", "X", "Y"]
# }

# x = json.dumps(dictionary)
# print(x)



#look at .txt list
#create a dictionary
#if there is a letter ID - put it in the manuscript.json file
#then go to corresponding item folder, and find 1 2 3 4.jpg
#
# key -- xml ID
# value -- array of strings

# with open("../../clo-xml-archive/manuscripts.json", "w") as outfile:
#     json.dump(dictionary, outfile)
