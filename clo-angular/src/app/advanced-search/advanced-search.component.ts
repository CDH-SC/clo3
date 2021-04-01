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

  /*
   *    1. is elastic expecting currently only search strings like "<feildName>-<fieldValue>_<fieldName><fieldVal...>_ 
   *         where field name is either "docBody," "sourceNote," or "footnotes," or can i go ahead & start making it function w/ all applicable field names?
   *
   *    2. the images are in album collection, is the search currently only looking through the letters collection? If so, how do I add onto it to where it searches albums when
   *       "Image Caption & Metadata" field is selected?... and what in an album object even is the caption? It appears to be at least within the Metadata object
   *        of each album object... if this is the case, shouldn't we just search the metadata object or are they expecting it to just search the caption?
   * 
   *    3. worried about the size of file, how would i seperate the component into two, one for the search and one for search results (like basic search's componenets)?
   *
   *    4. how would i make the checkbox html more concise by using *ngFor and one-way property binding?
   */
  CONST_RETRIEVING_RESULTS = "Retrieving results... "   // to be used later to display message that assures user, after clicking search, that the search function is working
  CONST_LETTERBODY = "docBody";
  CONST_SOURCENOTE = "sourceNote";
  CONST_FOOTNOTES = "footnotes";

  //  the following strings are for html checkbox items
  allFieldsStr = "Select/ Unselect All Fields"
  letterBodyStr = "Letter Body";
  sourceNoteStr = "Source Note";
  footnotesStr = "Footnotes";
  tcStr = "Thomas Carlyle";
  jwcStr =  "Jane Welsch Carlyle";
  tccdjfStr = "Thomas Carlyle, CD & JF";
  
  //  the following bools are associated w/ checkbox items
  boolAllFields = true;
  boolLetterBody = true;
  boolSourceNote = true;
  boolFootnotes = true;


    //  Array naming convention noted below...

/*
 *   "query<attrName>Str" :  arrays used to map attribute booleans (represent checkbox is/ is not selected) to corresponding string elastic is expecting
 *        "<attrName>Str" : arrays used to leverage property binding to display checkbox items in HTML
*/
  
  fieldsStr = [this.allFieldsStr, this.letterBodyStr, this.sourceNoteStr, this.footnotesStr];
  fields = [this.boolAllFields, this.boolLetterBody, this.boolSourceNote, this.boolFootnotes];
  queryFieldsStr = ["", this.CONST_LETTERBODY, this.CONST_SOURCENOTE, this.CONST_FOOTNOTES];

  boolOps = ["searchTerm1boolOp"];
  inputs = ["searchTerm1"];
  
  query = [this.boolOps, this.inputs];
  queries = [this.query];
  queryNumber = 1;
  searchResults: any;

  displayQuery = ["","",""];

  page = 1;
  pageSize = 10;

  start = 1;
  end = 10;



  addField() {
    this.queryNumber++;
    this.boolOps.push("searchTerm"+this.queryNumber+"boolOp");
    this.inputs.push("searchTerm"+this.queryNumber);
    let newQuery = [this.boolOps,this.inputs];
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
    if(id.includes("boolOp")) {
      var inputID = id.replace("boolOp","");
      var inputName = (<HTMLInputElement>document.getElementById(inputID)).name;
      document.getElementById(inputID).setAttribute("name",event.target.value);
    //  document.getElementById(inputID).setAttribute("name",event.target.value + inputName.substring(3));
    } 
  }

  searchField(fieldIndexBool) {return this.fields[fieldIndexBool]; }
  searchAllFields() {
    return this.fields[0];
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

  makeSearchString(boolString, currTermOfQuery)
  {
    // [this.CONST_LETTERBODY, this.CONST_SOURCENOTE, this.CONST_FOOTNOTES]
    var retString = "";
    if (this.searchAllFields())
    {
      for (let k = 0; k < this.queryFieldsStr.length; k++)
      {
        //  debugger;
        retString += this.queryFieldsStr[k+1] + "-" + currTermOfQuery + "_";
      }
    }
    else // wants to search all fields but not all of them
    {
      for (let k = 0; k < this.queryFieldsStr.length; k++)
      {
        if (!this.fields[k+1])
          continue;
        else 
          retString += this.queryFieldsStr[k+1] + "-" + currTermOfQuery + "_";
      }
    }
    console.log("Should append:\t" + retString + "\n...to " + boolString + "string");
    return retString;
  }

  startSearch() {
    
    var result = [];
    var aQueryID = "";
    var aQueryName = "";
    var aQueryValue = "";




    for(var i = 0; i < this.queryNumber; i++) {
      aQueryID = "searchTerm".concat((i+1).toString());
      aQueryName = (<HTMLInputElement>document.getElementById(aQueryID)).name;
      aQueryValue = (<HTMLInputElement>document.getElementById(aQueryID)).value;
      var check = this.checkQuery(result,aQueryName);
      if(check[0]) {
        result[check[1]][1].push(aQueryValue);
      } else {
        result.push([aQueryName, [aQueryValue]]);
      }
    }

    console.log(result);
    var boolOp; // used in loops below to determine which boolean goes with *this* array of terms (second index of result array)
    var queryString = ""
    var ANDString = "$AND:_"
    var ORString = "$OR:_"
    var NOTString = "$NOT:_"

    for(var i = 0; i < result.length; i++) {
      boolOp = result[i][0];
      for (let j = 0; j < result[i][1].length; j++)
      {
      switch(boolOp) {
        case "AND":
          ANDString += this.makeSearchString(ANDString, result[i][1][j]);
          break;
        case "OR":
          ORString += this.makeSearchString(ORString, result[i][1][j]);
          break;
        case "NOT":
          NOTString += this.makeSearchString(NOTString, result[i][1][j]);
          break;
        default:
        }
    }
    continue;
  }
    
    queryString = ANDString + ORString + NOTString
    this.displayQuery[0] =  ANDString.substring(6);
    this.displayQuery[1] = ORString.substring(5);
    this.displayQuery[2] = NOTString.substring(6);
    

    let ANDIndex = this.displayQuery[0];
    let ORIndex = this.displayQuery[1];
    let NOTIndex = this.displayQuery[2];
    /*
     * if the only index in displayQuery that's non-empty is AND index
     *      construct AND sentence
     * else if the only index in displayQuery that's non-empty is OR index
     *      construct OR sentence
     

    if (this.isANDSentence(ANDIndex) && (!(this.isORSentence(ORIndex)) && !(this.isNOTSentence(NOTIndex))))
    {
        this.constructANDSentence(ANDIndex);
    }
    else if (this.isORSentence(ORIndex) && (!(this.isANDSentence(ANDIndex)) && !(this.isNOTSentence(NOTIndex))))
    {
      this.constructORSentence(ORIndex); // 
    }
*/
  

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
