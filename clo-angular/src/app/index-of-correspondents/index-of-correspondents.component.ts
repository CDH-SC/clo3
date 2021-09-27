import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index-of-correspondents',
  templateUrl: './index-of-correspondents.component.html',
  styleUrls: ['./index-of-correspondents.component.css']
})
export class IndexOfCorrespondentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
letters = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];


correspondentsMap = 
                                                 [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
// index of correspondent whose name starts w/...  a, b, c,...              ...                          ...z


/* loading xml file data
 * 1. create new request object
 * 2. open object & specify HTTP verb/request
 * 3. set request header
 * 4. define event listener
 * 5. send request
  */
 letterToNumber(aLetter) {
   let thisLettersCode = aLetter.charCodeAt('0');
   let key = thisLettersCode - 65;  // A's code is 65, Z is 90, offset key to use values in hashmap 
   return key;
 }

  xmlFile = "$CLO_ROOT/*.xml"
  loadXMLFile(path, callback) {
    let request = new XMLHttpRequest();
    request.open("GET", path); // will be the xml file name
    request.setRequestHeader("Content-Type","text/xml");
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        callback(request.responseXML);
      }
    }
    request.send();
  }

makeCorrespondentMap() {
  // httprequest returns a huge xml string, need to parse it into an XML tree
  let parser = new DOMParser();
  let xmlDOM = parser.parseFromString(this.xmlFile, "text/xml");

  let amountOfCorrespondents = xmlDOM.getElementsByTagName('entities').length;

  for (let i = 0; i < amountOfCorrespondents; i++) {
    let aCorrespondent = xmlDOM.getElementsByTagName('entities')[i].innerHTML;
    let firstLetterInName = aCorrespondent.slice(0,1);
    let numberKey = this.letterToNumber(firstLetterInName);
    this.correspondentsMap[numberKey].push(aCorrespondent);
  }
}

// loadXMLFile(xmlFile, makeCorrespondentMap);
}
