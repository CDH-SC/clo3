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
import { mapToMapExpression } from '@angular/compiler/src/render3/util';
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


  CONST_RETRIEVING_RESULTS = "Retrieving results... "; 
  
  CONST_LETTERBODY = "docBody";
  CONST_SOURCENOTE = "sourceNote";
  CONST_FOOTNOTES = "footnotes";

  CONST_AUTHORS = "docAuthor";
  CONST_DATE = "docDate";

  CONST_TC = "Thomas Carlyle";
  CONST_TWC = "Thomas Welsh Carlyle"
  // most letters from him have "Thomas Carlyle" as sender BUT others have "Thomas Welsh Carlyle" as sender

  CONST_JWC = "Jane Welsh Carlyle";  // NEED this field value to retrieve both "Jane Welsch Carlyle" & "Jane Bailee Carlyle" 
  CONST_MW = "Margaret Welsh"; 
  CONST_TCJC = "Thomas Carlyle Jane Welsh Carlyle";


  //  the following strings are for html checkbox items
  allFieldsStr = "Select/ Unselect All Fields"
  letterBodyStr = "Letter Body";
  sourceNoteStr = "Source Note";
  footnotesStr = "Footnotes";

  allAuthorsStr = "Select/ Unselect All Senders";
  tcStr = "Thomas Carlyle"; 
  /*
   * to index "Thomas Carlyle" & "Thomas Welsh Carlyle" signed documents...
   * ... it'd be frivolous and awkard to use 2 distinct checkbox items...
   * ... so we'll just append the 2 different constants to the OR string...
   * ... if the one item is selected
   */

  jwcStr =  "Jane Welsh Carlyle";
  tccdjfStr = "Thomas Carlyle, CD & JF";
  mwStr = "Margaret Welsh";
  tcjcStr = "Thomas & Jane Carlyle" // corresponds to db value: "Thomas Carlyle Jane Welsch Carlyle"

  //  the following bools are associated w/ checkbox items
  boolAllFields = true;
  boolLetterBody = true;
  boolSourceNote = true;
  boolFootnotes = true;

  boolTC = true;
  boolJWC = true;
  boolTCJC = true;
  boolMW = true;
  boolAllAuthors = true;

  dateRange = [];

  docAuthorsStr = [this.allAuthorsStr, this.tcStr, this.jwcStr, this.mwStr, this.tcjcStr];
  authors = [this.boolAllAuthors, this.boolTC, this.boolJWC, this.boolMW, this.boolTCJC];

  fieldsStr = [this.allFieldsStr, this.letterBodyStr, this.sourceNoteStr, this.footnotesStr];
  fields = [this.boolAllFields, this.boolLetterBody, this.boolSourceNote, this.boolFootnotes];

  recipientsStr = ["Thomas Carlyle","Jane Welsh Carlyle","Margaret Welsh","Goethe","Ralph Waldo Emerson","John Stuart Mill"];

  // the index, i, of this array corresponds to the index i+1 in docAuthorsStr array

  correspondenceMap = [["Jane Welsh Carlyle", "Margaret Welsh", "Goethe"],  // recipients to whom Thomas Carlyle wrote
                        ["John A. Carlyle", "Margaret Welsh", "Thomas Carlyle"], // recipients to whom Jane Carlyle wrote
                          ["Jane Welsh Carlyle", "Thomas A. Carlyle", "John A. Carlyle"], // recipients to whom Margaret Carlyle wrote
                            ["Jane Welsh Carlyle", "Margaret Welsh", "John A. Carlyle"]]; // recipients to whom TC + JC wrote
  
 
  queryFieldsStr = ["", this.CONST_LETTERBODY, this.CONST_SOURCENOTE, this.CONST_FOOTNOTES];
  queryAuthorsStr = ["", this.CONST_TC, this.CONST_JWC, this.CONST_MW, this.CONST_TCJC];
 


  recipient = ["recipient1"];
  recipients = [this.recipient];

  boolOps = ["searchTerm1boolOp"];
  inputs = ["searchTerm1"];
  
  query = [this.boolOps, this.inputs];
  queries = [this.query];
  queryNumber = 1;
  recipientNumber = 1;
  searchResults: any;

  isSearching = false;
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

  addRecipient() {
    this.recipientNumber++;
    this.recipient.push("recipient" + this.recipientNumber);
    let newRecipient = [this.recipient]
  }

  removeRecipient() {
    if (this.recipients.length > 1) {
      this.recipients.splice(this.recipientNumber);
      this.recipientNumber--;
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

  //  TODO: consolidate the following two methods
  checkUncheckAllAuthors(event: any) {
    //  if this method was called, change authors[0] to the opposite of what it currently is
    this.authors[0] = !this.authors[0];
    for (let i=0; i < this.authors.length; i++)
      this.authors[i] = this.authors[0];
  }
  checkUncheckAllFields(event: any) {
    this.fields[0] = !this.fields[0];
    for (let i=0; i < this.fields.length; i++)
      this.fields[i] = this.fields[0];
  }



  searchAll(aBoolArray) 
  {
    return aBoolArray[0];
  }
  searchThomasCarlyle(aBoolArray)
  {
    return aBoolArray[1];
  }

  searchMultiple(aBoolArray) {
    var itemsSelected = 0;
    if (this.searchAll(aBoolArray))
      return true;
    else 
    {
    for (var i = 0; i < aBoolArray.length; i++) {
        if (aBoolArray[i+1])
          ++itemsSelected;
        else if (i+1 == 2 && aBoolArray == this.authors && this.searchThomasCarlyle(aBoolArray)) // don't increment another time for the second thomas carlyle bool
          continue;
    }
      if (itemsSelected > 1) 
        return true;
      else
        return false; 
  }
}
  dateRangeIsSpecified() {
    return this.dateRange[0] >= 0 || this.dateRange[1] >= 0;
  }

  specifiesALetterField (segmentOfSearchString) {
    return segmentOfSearchString.includes(this.CONST_LETTERBODY)
             || segmentOfSearchString.includes(this.CONST_FOOTNOTES)
               || segmentOfSearchString.includes(this.CONST_SOURCENOTE); 
  }
  
  specifiesAnAuthor (segmentOfSearchString) {
    return segmentOfSearchString.includes(this.CONST_AUTHORS);
  }
  
  specifiesDate (segmentOfSearchString) {
    return segmentOfSearchString.includes(this.CONST_DATE);
  }
  makeSentence(whichSentence, searchString: string)
  {
    let somethingSpecified = true;
    if(searchString == "") {
      // then they didn't have any and/or/not in their search, so return empty string to display nothing for this irrelevant sentence
      somethingSpecified = false;
    }
    let sentence = "";
    let fieldsPreposition = " in the";
    let docBodyPhrase = "letter body";
    let sourceNotePhrase = "source note";
    let footnotesPhrase = "footnotes";
    let prepositionalPhrase = fieldsPreposition + " ";
    let fieldsPhrasesArray = ["all fields", docBodyPhrase, sourceNotePhrase, footnotesPhrase];
    /* create array splitting indices by the character at end of each search term
     * if user searches for 'oxford liberalism' in letter body and 'emerson' in the footnotes the search string is currently: docBody-oxford liberalism_footnotes-emerson_
     * after splitting the array to partition by each distinct search, the searchArray indices will be as follows...
     *
     *  searchArray[0]:   "docBody-oxford liberalism"
     *  searchArray[1]:   "footnotes-emerson"
     *  searchArray[2]:   ""
     */
    let beginningOfSentence = "Results";
    let termsIncluded = "";
    let writtenBy= "";
    let dateRangePhrase = "sent"
    let searchArray = searchString.split('_'); searchArray.pop(); // we split on underscore, the last underscore was after the last letter of last term, so this index containing an empty string will not be needed
    //console.log(searchArray);

        /* for each index...
     * 2) then we need to replace the "<field>-" part and replace it with an opening single quote since we will have chopped of the string to where the first index is the search term
     * 4) lastly, we need to add an ending single quote around each search term
     */
    for (let i=0; i < searchArray.length; i++)
    {
      let searchField = searchArray[i].substr(0, searchArray[i].indexOf("-"));
      // the if-else block executes steps 1-3, after the loop the index will contain the corresponding subStrPhrase so we can just append the particular phrase after the block
      if (this.specifiesALetterField(searchField)) {
        searchArray[i] = searchArray[i].replace(searchField + "-", " '");
        searchArray[i] = searchArray[i] + ",'";
        termsIncluded += searchArray[i];
       }
       else if (this.specifiesAnAuthor(searchField)) {
         searchArray[i] = searchArray[i].replace(searchField + "-","");
         if (writtenBy !== "") {
           if (writtenBy.includes("Thomas") && searchArray[i].includes("Thomas")) {
             continue; // already specified him once, no need to do it again for the second field that contains thomas carlyle in database
           }
          writtenBy += ", or " + searchArray[i];   
         }
         else {
           // first author specified, no need to prepend a comma
           writtenBy += searchArray[i];
         }
       }
       else if (this.specifiesDate(searchField)) {
         if (searchField.includes("Min")) {
          searchArray[i] = searchArray[i].replace(searchField + "-", "");
          dateRangePhrase += " between " + searchArray[i];
         }
         else if (searchField.includes("Max")) {
           searchArray[i] = searchArray[i].replace(searchField + "-", "");
           dateRangePhrase += " and " + searchArray[i] + ".";
         }
        }
       }



   // ANDSentence = ANDSentence.replace(new RegExp(',' + '$'), ''); 

    // need to put an "and" after the last occurence of comma now
    let firstTermToPenultimateTerm = termsIncluded.substring(0, termsIncluded.lastIndexOf("\' ")+1);
    let lastTerm = termsIncluded.substring(termsIncluded.lastIndexOf("\' ")+2)
    let subStrAND = " and ";
    //let lastTerm = ANDSentence.substring(ANDSentence.lastIndexOf(",'")+1, ANDSentence.length);
    for (let i = 0; i < this.fields.length; i++)
    {
      if (this.fields[i+1]) {
        prepositionalPhrase += fieldsPhrasesArray[i+1];
      }
    }
    if (dateRangePhrase === "sent")
      // user didn't enter date, so the default values were used in the filter of query
      dateRangePhrase += " between 1812 and 1870."
 

    if (whichSentence.includes("AND"))
        beginningOfSentence += " must contain ";
    else if (whichSentence.includes("OR"))
        beginningOfSentence += " may contain ";
    else if (whichSentence.includes("NOT"))
        beginningOfSentence += " must not contain ";

    sentence += beginningOfSentence + firstTermToPenultimateTerm + subStrAND + lastTerm + prepositionalPhrase + "; ";
    if (whichSentence.includes("AND")) {
        sentence += writtenBy + " wrote and sent these letters " + dateRangePhrase; 
    }
    else if (whichSentence.includes("OR") && this.displayQuery[0].includes("or")) {
      sentence += ". These letters were sent " + dateRangePhrase;
    }
    else if (whichSentence.includes("NOT")) {
      sentence += " letters" + dateRangePhrase + " that were written by " + writtenBy + " are not included.";
    }

  if (somethingSpecified) {
  switch(whichSentence) {
    case "AND":
      this.displayQuery[0] = sentence;
    case "OR":
      this.displayQuery[1] = sentence;
    case "NOT":
      this.displayQuery[2] = sentence;
  }
}
else if (!somethingSpecified) {
  switch(whichSentence) {
    case "AND":
      this.displayQuery[0] = "";
    case "OR":
      this.displayQuery[1] = "";
    case "NOT":
      this.displayQuery[2] = "";
  }
}
}

  //  return search string of authors
  appendAuthorsToSearchString(boolString)
  {
    /*
     *  remember, string format must be <fieldName1>-<fieldValue1>_<fieldName2>-<fieldValue2>_ ... ... <fieldNameN>-<fieldValueN>_
     *  in db, fieldName = docAuthor for the senders
    */
    var retString = "";    
    if (this.searchAll(this.authors)) {
      return retString; // elastic searches all authors by default so no need to append all authors to search string
    }
    else {
      for (let i = 0; i < this.authors.length; i++) {
        if (!this.authors[i+1]) 
          continue;
        else {
          retString += this.CONST_AUTHORS + "-" + this.queryAuthorsStr[i+1] + "_";
         /* if (i+1 == 1)
            retString += this.CONST_AUTHORS + "-" + this.CONST_TWC + "_"; // above code added this.CONST_TC, now we have to add the other "Thomas Carlyle"
        */
          }
      }
      //console.log("append authors to "+boolString+"\n"+retString);
      return retString;
    }
} 
//TODO: 
//   1: figure out how to change values using binding and user text input
//   2: Uncomment method below, call it in startSearch(), integrating it into existing logic


bothBoundariesSpecified() {
    if (this.dateRange[0] && this.dateRange[1])
      return true;
    else
      return false;
}
  appendDateRangeToSearchString() {
    var retString = "";
    if (this.bothBoundariesSpecified()) {
      retString += this.CONST_DATE + "Min" + "-" + this.dateRange[0] + "_" + this.CONST_DATE + "Max" + "-" + this.dateRange[1] + "_";
      return retString;
    } else if (this.dateRange[0]) {
      retString += this.CONST_DATE + "Min" + "-" + this.dateRange[0] + "_";
      return retString;
    } else if (this.dateRange[1]) {
      retString += this.CONST_DATE + "Max" + "-" + this.dateRange[1] + "_";
      return retString;
    }
  }


  appendFieldsAndTermsToSearchString(boolString, currTermOfQuery)
  {
    var retString = "";
    for (let i = 0; i < this.queryFieldsStr.length; i++) {
      if (this.fields[i+1]) { 
        retString += this.queryFieldsStr[i+1] + "-" + currTermOfQuery + "_";
      }
    }
    return retString;
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

    this.isSearching = true;
    var result = [];

    for(var i = 0; i < this.queryNumber; i++) {
      var currInputId = "searchTerm".concat((i+1).toString());
      var currInputeName = (<HTMLInputElement>document.getElementById(currInputId)).name;
      var currInputValue = (<HTMLInputElement>document.getElementById(currInputId)).value;
      var check = this.checkQuery(result,currInputeName);
      if(check[0]) {
        result[check[1]][1].push(currInputValue);
      } else {
        result.push([currInputeName, [currInputValue]]);
      }
    }

    console.log(result);
   // var boolOp; // used in loops below to determine which boolean goes with *this* array of terms (second index of result array)
    var queryString = ""
    var ANDString = "$AND:_"
    var ORString = "$OR:_"
    var NOTString = "$NOT:_"
    if (this.dateRange[0] || this.dateRange[1])
      ANDString += this.appendDateRangeToSearchString(); 

    for(var i = 0; i < result.length; i++) {
      var boolOp = result[i][0];
      for (let j = 0; j < result[i][1].length; j++)
      {
      switch(boolOp) {
        case "AND":
          ANDString += this.appendFieldsAndTermsToSearchString(ANDString, result[i][1][j]);
          if (!this.searchMultiple(this.authors)) {
           ANDString += this.appendAuthorsToSearchString(ANDString);
          }
          else  {
            if (j == 0)
              ORString += this.appendAuthorsToSearchString(ORString);
          }
          break;
        case "OR":
          ORString += this.appendFieldsAndTermsToSearchString(ORString, result[i][1][j]);
          ORString += this.appendAuthorsToSearchString(ORString);
          break;
        case "NOT":
          NOTString += this.appendFieldsAndTermsToSearchString(NOTString, result[i][1][j]);
          NOTString += this.appendAuthorsToSearchString(NOTString);
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
    let whichSentence = "";
    this.makeSentence("AND",ANDIndex);
    this.makeSentence("OR", ORIndex);
    this.makeSentence("NOT", NOTIndex);
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
