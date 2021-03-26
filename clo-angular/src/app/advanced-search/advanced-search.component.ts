import { Component, OnInit, ElementRef, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {NgForm} from '@angular/forms';
import { faPlusSquare, faGrinTongueSquint } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ElasticSearchService } from '../_shared/_services/elastic-search.service';
import { ElasticSearch } from '../_shared/models/elastic-search';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { identifierModuleUrl } from '@angular/compiler';
// import {MatCheckboxModule} from '@angular/material';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent {

  route = '';
  searchQuery: string;
  faPlusSquare = faPlusSquare;

  constructor(
    @Inject(DOCUMENT) document,
    private searchService: ElasticSearchService,
    private sanitizer: DomSanitizer) { }

  // Goes to search results page when enter is pressed
  onEnter(route) {
    console.log(route);
    // this.router.navigate(['search-results/', route]);
  }


  
  CONST_LETTERBODY = "docBody-";
  CONST_SOURCENOTE = "sourceNote-";
  CONST_FOOTNOTES = "footnotes-";
  
  allFieldsStr = "Select/ Unselect All Fields"
  letterBodyStr = "Letter Body";
  sourceNoteStr = "Source Note";
  footnotesStr = "Footnotes";
  
  boolAllFields = true;
  boolLetterBody = true;
  boolSourceNote = true;
  boolFootnotes = true;

  tcStr = "Thomas Carlyle";
  jwcStr =  "Jane Welsch Carlyle"
  tccdjfStr = "Thomas Carlyle, CD & JF"
  
  fieldsStr = [this.allFieldsStr, this.letterBodyStr, this.sourceNoteStr, this.footnotesStr];

  fields = [this.boolAllFields, this.boolLetterBody, this.boolSourceNote, this.boolFootnotes];
  queryStrFields = ["allFields", "docBody", "sourceNote", "footnotes"];
  fieldsMap = new Map<String, Boolean>();


  
  trackByIndex(index: number, obj: any): any {
    return index;
  }



  CONST_RETRIEVING_RESULTS = "Retrieving results... "   // to be used later to display message that assures user, after clicking search, that the search function is working

  // fields = ["newField1fields"];
  
  boolOps = ["newField1boolOp"];
  inputs = ["newField1"];
  sender = ["newField1sender"];
  query = [this.boolOps,this.fields,this.inputs];
  //  query = [this.boolOps, this.fields, this.inputs, this.sender];
  queries = [this.query,this.fields];
  queryNumber = 1;
  searchResults: any;



  displayQuery = ["","",""];

  page = 1;
  pageSize = 10;

  start = 1;
  end = 10;

  getBoolOp() {
    var boolInputID = "newField".concat((this.queryNumber).toString().concat("boolOp"));
    return (<HTMLInputElement>document.getElementById(boolInputID)).value;
  }

  getField() {
    var fieldInputID = "newField".concat((this.queryNumber).toString().concat("fields"));
    return (<HTMLInputElement>document.getElementById(fieldInputID)).value;
  }

  getSearchTerm() {
    var searchInputID = "newField".concat((this.queryNumber).toString());
    return (<HTMLInputElement>document.getElementById(searchInputID)).value;
  }


  addField() {
    this.queryNumber++;
    //  this.fields.push("newField"+this.queryNumber+"fields");
    this.boolOps.push("newField"+this.queryNumber+"boolOp");
    this.inputs.push("newField"+this.queryNumber);
    let newQuery = [this.boolOps,this.fields,this.inputs];
    //  this.sender.push(this.CONST_NEW_FIELD+this.queryNumber+this.CONST_SENDER);
    //  let newQuery = [this.boolOps, this.fields, this.inputs, this.sender];
    this.queries.push(newQuery);
  }

  removeField() {
    if (this.queryNumber > 1) {
      this.queryNumber--;
      this.queries.splice(this.queryNumber);
    }
  }

  changeDropDown(event: any) {
    let val = event.srcElement.value;
    let id = event.srcElement.id;
    // console.log(val,id);
    if(id.includes("boolOp")) {
      var inputID = id.replace("boolOp","");
      var inputName = (<HTMLInputElement>document.getElementById(inputID)).name;
      document.getElementById(inputID).setAttribute("name",event.target.value + inputName.substring(3));
    } else if (id.includes("fields")) {
      var inputID = id.replace("fields","");
      var inputName = (<HTMLInputElement>document.getElementById(inputID)).name;
      document.getElementById(inputID).setAttribute("name",inputName.substring(0,3) + event.target.value);
    }
  }


  // Not sure if still needed
  // https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
  compareValues(key, order = 'asc') {
    return function innerSort(a, b) {
      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string')
        ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string')
        ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  // checks if displayQuery[] index for AND is non-empty
  isANDSentence(indexOfANDString: string) { if (indexOfANDString != "") return true; }

  // checks if displayQuery[] index for OR is non-empty
  isORSentence(indexOfORStr: string) { if (indexOfORStr != "") return true; }

  // checks if displayQuery[] index for NOT is non-empty
  isNOTSentence(indexOfNOTStr: string){ if (indexOfNOTStr != "") return true; }

  searchOnlyOneField(indexOfSearchStr: string)
  {
    if (indexOfSearchStr.includes(this.CONST_LETTERBODY))
    {
      if (indexOfSearchStr.includes(this.CONST_FOOTNOTES) || indexOfSearchStr.includes(this.CONST_SOURCENOTE))
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    else if (indexOfSearchStr.includes(this.CONST_SOURCENOTE))
    {
      if (indexOfSearchStr.includes(this.CONST_LETTERBODY) || indexOfSearchStr.includes(this.CONST_FOOTNOTES))
      {
        return false;
      }
      else
      {
        return true;
      }
    }
    else if (indexOfSearchStr.includes(this.CONST_FOOTNOTES))
    {
      if (indexOfSearchStr.includes(this.CONST_LETTERBODY) || indexOfSearchStr.includes(this.CONST_SOURCENOTE))
      {
        return false;
      }
      else
      {
        return true;
      }
    }
  }
  constructANDSentence(searchString: string)
  {
    let docBodyPhrase = " in the letter body,";
    let sourceNotePhrase = " in the source note,";
    let footnotesPhrase = " in the footnotes,";
    /* create array splitting indices by the character at end of each search term
     * if user searches for 'oxford liberalism' in letter body and 'emerson' in the footnotes the search string is currently: docBody-oxford liberalism_footnotes-emerson_
     * after splitting the array to partition by each distinct search, the searchArray indices will be as follows...
     *
     *  searchArray[0]:   "docBody-oxford liberalism"
     *  searchArray[1]:   "footnotes-emerson"
     *  searchArray[2]:   ""
     */

    let searchArray = searchString.split('_'); searchArray.pop(); // we split on underscore, the last underscore was after the last letter of last term, so this index containing an empty string will not be needed

    // for each index, we need to give it a phrase corresponding to the search term so initialize an empty string at first
    let subStrPhrase = '';
    /* for each index...
     * 1) we need to decide which subStrPhrase is associated with it
     * 2) then we need to replace the "<field>-" part and replace it with an opening single quote since we will have chopped of the string to where the first index is the search term
     * 3) then we need to add the associated phrase after the actual term, which phrase for which index determined in following loop
     * 4) lastly, we need to add an ending single quote around each search term
     */
     for (let i=0; i < searchArray.length; i++)
     {
       // the if-else block executes steps 1-3, after the loop the index will contain the corresponding subStrPhrase so we can just append the particular phrase after the block
       if (searchArray[i].includes(this.CONST_LETTERBODY))
       {
         subStrPhrase = docBodyPhrase;
         searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " '");
       }
       else if (searchArray[i].includes(this.CONST_SOURCENOTE))
       {
         subStrPhrase = sourceNotePhrase;
         searchArray[i] = searchArray[i].replace(this.CONST_SOURCENOTE, " '");
       }
       else if (searchArray[i].includes(this.CONST_FOOTNOTES))
       {
         subStrPhrase = footnotesPhrase;
         searchArray[i] = searchArray[i].replace(this.CONST_FOOTNOTES, " '");
       }
       searchArray[i] += subStrPhrase;
       /* step 4 also done for each index, regardless of the phrase since each phrase has the word "in,"... " '<term1> in " (and so on till termN) where we need a closing single quote nearby:
       *   " '<term1> in "    ->    "'<term1>' in "
       *   " '<term2> in "    ->    "'<term2>' in "
       *   " '<term3> in "    ->    "'<term3>' in "
       *   ...
       *   " '<termN> in "    ->    "'<termN>' in "
       */
      searchArray[i] = searchArray[i].replace(" in", "' in");
     }

    let ANDSentence = "Results that contain";

    // append indices of searchArray to the sentence
    for (let i=0; i < searchArray.length; i++)
    {
      ANDSentence += searchArray[i];
    }
    ANDSentence = ANDSentence.replace(new RegExp(',' + '$'), '.'); // last index has a comma at the end, change the last occurence of a comma to a period

    // need to put an "and" after the last occurence of comma now
    let firstTermToPenultimateTerm = ANDSentence.substring(0, ANDSentence.lastIndexOf(',')+1);
    let subStrAND = " and";
    let lastTerm = ANDSentence.substring(ANDSentence.lastIndexOf(',')+1, ANDSentence.length);
    if (ANDSentence.includes(","))
    {
      ANDSentence = firstTermToPenultimateTerm + subStrAND + lastTerm;
    }
    this.displayQuery[0] = ANDSentence;
}

  constructORSentence(searchString: string) {
    let docBodyPhrase = " in the letter body,";
    let sourceNotePhrase = " in the source note,";
    let footnotesPhrase = " in the footnotes,";

    let searchArray = searchString.split('_');
    searchArray.pop();

    let subStrPhrase = '';
     for (let i=0; i < searchArray.length; i++)
     {
       if (searchArray[i].includes(this.CONST_LETTERBODY))
       {
         subStrPhrase = docBodyPhrase;
         //if it is the first search term, don't add "or" in front of it
         if(i===0) {
           searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " '");
         }
         else {
           searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " or '");
         }
       }
       else if (searchArray[i].includes(this.CONST_SOURCENOTE))
       {
         subStrPhrase = sourceNotePhrase;
         if(i===0) {
           searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " '");
         }
         else {
           searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " or '");
         }
       }
       else if (searchArray[i].includes(this.CONST_FOOTNOTES))
       {
         subStrPhrase = footnotesPhrase;
         if(i===0) {
           searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " '");
         }
         else {
           searchArray[i] = searchArray[i].replace(this.CONST_LETTERBODY, " or '");
         }
       }
       searchArray[i] += subStrPhrase;
       searchArray[i] = searchArray[i].replace(" in", "' in");
     }

    let ORSentence = "Results that contain";
    for (let i=0; i < searchArray.length; i++)
    {
      ORSentence += searchArray[i];
    }
    ORSentence = ORSentence.replace(new RegExp(',' + '$'), '.');
    this.displayQuery[1] = ORSentence;
  }

  defineMapping(emptyMap, keys:string[], vals:boolean[]) {
  // boolsVal parameter is the fields array representing whether or not user wants to search a particular term (TRUE/FALSE: *that* checkbox item is selected.)
  // keysStr parameter is queryStrFields array denoting the expected format of each field needed for query strings (for example, we displayed "Letter Body" but the field name Elastic is expecting is "docBody")
  
  for (let i=0; i < keys.length; i++)
  {
    emptyMap.set(keys[i], vals[i]);
  }
}
  //  checks if a boolean-searchfield combination has been added already
  checkQuery(resultArray,inputName) {
    if(resultArray.length < 1) {
      return [false,0];
    } else {
      for(var i = 0; i < resultArray.length; i++) {
        if(resultArray[i][0].includes(inputName)) {
          return [true,i];
        }
      }
      return [false,resultArray.length];
    }
  }

  startSearch() {

  /* 
     for (fieldSearching in fieldsSearching)
     append fieldSearching + "-" + <theSearchTerm> + "_" to AND/OR/NOT string
  
  */
 
    for (let i=0; i < this.fields.length; i++) {
      console.log(this.fields[i])
      console.log("\n");
    }
    
    var result = [];
    for(var i = 0; i < this.queryNumber; i++) {
      var currInputId = "newField".concat((i+1).toString());
      var currInputName = (<HTMLInputElement>document.getElementById(currInputId)).name;
      var currInputValue = (<HTMLInputElement>document.getElementById(currInputId)).value;
      //  console.log(currInputValue);
      var check = this.checkQuery(result,currInputName);
      if(check[0]) {
        result[check[1]][1].push(currInputValue);
      } else {
        result.push([currInputName, [currInputValue]]);
      }
    }
    console.log(result);
    var queryString = ""
    var ANDString = "$AND:_"
    var ORString = "$OR:_"
    var NOTString = "$NOT:_"

    for(var i = 0; i < result.length; i++) {
      if(result[i][0].includes("AND")) {
        for(var j = 0; j < result[i][1].length; j++) {
          /*
          if (result[i][0].substring(3).includes("allFields"))
          {
            ANDString += "docBody" + "-" + result[i][1][j] + "_";
            ANDString += "sourceNote" + "-" + result[i][1][j] + "_";
            ANDString += "footnotes" + "-" + result[i][1][j] + "_";
            continue;
          }
          */
         for (var k = 0; k < this.fields.length; k++)
         {
         if (k==0 && this.fields[k] == true)
         {
            ANDString += this.queryStrFields[k+1] + "-" + result[i][1][j] + "_";
            ANDString += this.queryStrFields[k+2] + "-" + result[i][1][j] + "_";
            ANDString += this.queryStrFields[k+3] + "-" + result[i][1][j] + "_";
            break; // no need to check other booleans since first index means user wants to search all fields
         } else if(this.fields[k] == true)
         {
            ANDString += this.queryStrFields[k] + "-" + result[i][1][j] + "_";
         }
        }
      }
    }
    else if(result[i][0].includes("OR")) {
        for(var j = 0; j < result[i][1].length; j++) {
          for (var k = 0; k < this.fields.length; k++)
          {
          if (k==0 && this.fields[k] == true)
          {
             ORString += this.queryStrFields[k+1] + "-" + result[i][1][j] + "_";
             ORString += this.queryStrFields[k+2] + "-" + result[i][1][j] + "_";
             ORString += this.queryStrFields[k+3] + "-" + result[i][1][j] + "_";
             break;
          } else if(this.fields[k] == true)
          {
             ORString += this.queryStrFields[k] + "-" + result[i][1][j] + "_";
          }
         }
        }
      } else if(result[i][0].includes("NOT")) {
        for(var j = 0; j < result[i][1].length; j++) {
          for (var k = 0; k < this.fields.length; k++)
          {
          if (k==0 && this.fields[k] == true)
          {
             ANDString += this.queryStrFields[k+1] + "-" + result[i][1][j] + "_";
             ANDString += this.queryStrFields[k+2] + "-" + result[i][1][j] + "_";
             ANDString += this.queryStrFields[k+3] + "-" + result[i][1][j] + "_";
             break;
          } else if(this.fields[k] == true)
          {
             ANDString += this.queryStrFields[k] + "-" + result[i][1][j] + "_";
          }
         }
      }

    } // close if statement
   } // close for loop
    
    queryString = ANDString + ORString + NOTString
    this.displayQuery[0] =  ANDString.substring(6);
    this.displayQuery[1] = ORString.substring(5);
    this.displayQuery[2] = NOTString.substring(6);
    /*
    console.log("Before constructing sentences, the indices of displayQuery array are as follows:\n")
    for (let i = 0; i < this.displayQuery.length; i++)
    {
      console.log("this.displayQuery["+i+"] = " + this.displayQuery[i]);
    }
    */
    let ANDIndex = this.displayQuery[0];
    let ORIndex = this.displayQuery[1];
    let NOTIndex = this.displayQuery[2];
    /*
     * if the only index in displayQuery that's non-empty is AND index
     *      construct AND sentence
     * else if the only index in displayQuery that's non-empty is OR index
     *      construct OR sentence
     */

    if (this.isANDSentence(ANDIndex) && (!(this.isORSentence(ORIndex)) && !(this.isNOTSentence(NOTIndex))))
    {
        this.constructANDSentence(ANDIndex);
    }
    else if (this.isORSentence(ORIndex) && (!(this.isANDSentence(ANDIndex)) && !(this.isNOTSentence(NOTIndex))))
    {
      this.constructORSentence(ORIndex); // 
    }

    console.log("Query String sent to elastic search: " + queryString);

    this.searchResults = this.searchService.advancedSearch(queryString);
    this.searchService.advancedSearch(queryString).subscribe(data => {
      console.log("data",data['data']);
    })
    this.searchQuery = queryString;
  }

  safeHTML(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  setPage(page: number) {
    this.page = page;
    this.end = this.page * this.pageSize;
    this.start = this.end - (this.pageSize - 1);
  }
}
