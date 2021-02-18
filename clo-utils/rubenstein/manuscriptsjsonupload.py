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
            words = line.split()
            cloid = words[1]
            itemNum = getItemNum(i-1)
            filePath = "../../clo-angular/src/assets/rubenstein_manuscripts/" + itemNum
            arr = os.listdir(filePath)
            arr.sort()
            print(arr)
            dictionary[cloid] = arr

with open("../../clo-xml-archive/manuscripts.json", "w") as outfile:
    json.dump(dictionary, outfile)
