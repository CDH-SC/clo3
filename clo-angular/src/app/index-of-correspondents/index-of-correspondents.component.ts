import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import xml2js from 'xml2js';  
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

@Component({
  selector: 'app-index-of-correspondents',
  templateUrl: './index-of-correspondents.component.html',
  styleUrls: ['./index-of-correspondents.component.css']
})
export class IndexOfCorrespondentsComponent {

  //ngOnInit(){};
   // title = 'read-xml-angular8';  
    public xmlItems: any;  
    constructor(private _http: HttpClient) { this.loadXML(); }  
    loadXML() {  
      this._http.get('./volume-46-correspondent-index.xml',  
        {  
          headers: new HttpHeaders()  
            .set('Content-Type', 'text/xml')  
            .append('Access-Control-Allow-Methods', 'GET')  
            .append('Access-Control-Allow-Origin', '*')  
            .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),  
          responseType: 'text'  
        })  
        .subscribe((data) => {  
          this.parseXML(data)  
            .then((data) => {  
              this.xmlItems = data;  
            });  
        });  
    }  
    parseXML(data) {  
      return new Promise(resolve => {  
        var k: string | number,  
          arr = [],  
          parser = new xml2js.Parser(  
            {  
              trim: true,  
              explicitArray: true 
            });  
        parser.parseString(data, function (err, result) {  
         var obj = result.Correspondent;
         for (k in obj.ixe) {  
            var item = obj.ixe[k]; 
            arr.push({  
              entry: item.entry[0]
            }); 
          } 
          resolve(arr);  
        });  
      });  
    }
  }
  /*
  generateLetters() {
    var lengthOfAlphabet = 26;
    var letters = new Array<String>(lengthOfAlphabet);
    var charCode = 0;
    for (let i=0; i < lengthOfAlphabet; i++) {
      charCode
      letters[i] = String.fromCharCode(i + 65);
    }
    return letters;
  }
  
  
  
  letterToNumber(aLetter) {
    let thisLettersCode = aLetter.charCodeAt('90');
    let key = thisLettersCode - 65;  // A's code is 65, Z is 90, offset key to use values in hashmap 
    return key;
  }
  
  letters = this.generateLetters();
  correspondentsMap = new Map([
    [ this.letters[0], [ ["Alex"], ["Albert"], ["Adriiene"] ] ],
    [ this.letters[1], [ ["Blane"], ["Borat"] ] ],
    [ this.letters[2], [ ["Charly"]           ] ],
    [ this.letters[3], [ ["De"]           ] ],
    [ this.letters[4], [ ["Ed"]           ] ],
  ]);
} 

//letters = ['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

*/