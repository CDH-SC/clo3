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


  CONST_LETTERBODY = "docBody";
  CONST_SOURCENOTE = "sourceNote";
  CONST_FOOTNOTES = "footnotes";
  CONST_RETRIEVING_RESULTS = "Retrieving results... "   // to be used later to display message that assures user, after clicking search, that the search function is working
  
  fields = ["newField1fields"];
  boolOps = ["newField1boolOp"];
  inputs = ["newField1"];
  sender = ["newField1sender"];
  query = [this.boolOps,this.fields,this.inputs];
  //  query = [this.boolOps, this.fields, this.inputs, this.sender];
  queries = [this.query];
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
    this.fields.push("newField"+this.queryNumber+"fields");
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
    /*  } else if (id.includes(this.CONST_SENDER)) {
       var inputID = id.replace(this.CONST_SENDER, "");
       var inputName = (<HTMLInputElement>document.getElementById(inputID)).name;
       document.getElementById(inputID).setAttribute()
    */
    }
  }
/*
  generateCorrespondingParams(theSearchTerm: string, theBoolOp: string, theField: string)
  {
    var searchTermID = "newField".concat((this.queryNumber).toString());
    (<HTMLInputElement>document.getElementById(searchTermID)).value = theSearchTerm;
    var boolOpID = "newField".concat((this.queryNumber).toString().concat("boolOp"));
    (<HTMLInputElement>document.getElementById(boolOpID)).value = theBoolOp;
    var fieldID = "newField".concat((this.queryNumber).toString().concat("fields"));
    (<HTMLInputElement>document.getElementById(fieldID)).value = theField;
  }
*/

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
    let finalPhrase = "";

    //  if (searchString.includes('docBody')) 
    if (searchString.includes(this.CONST_LETTERBODY))
    {
      searchString = searchString.replace(/docBody-/g,''); //  replace all occurences of field name with empty string
      finalPhrase = " in the letter body, ";
    }
    //  else if (searchString.includes("sourceNote"))
    else if (searchString.includes(this.CONST_SOURCENOTE))
    {
      searchString = searchString.replace(/sourceNote-/g,'');
      finalPhrase = " in the source note, "
    }
    //  else if (searchString.includes("footnotes"))
    else if (searchString.includes(this.CONST_FOOTNOTES))
    {
      searchString = searchString.replace(/footnotes-/g,'');
      finalPhrase = " in the footnotes, ";
    }
    searchString = searchString.replace(/_/g, ' ' + finalPhrase); // put comma and space in between each term
    searchString = searchString.replace(new RegExp(', ' + '$'), '.'); 
    let searchStringLastIndex = searchString.lastIndexOf(',');
    let firstTermToPenultimateTerm = searchString.substring(0, searchString.lastIndexOf(',')+1);
    let lastTerm = searchString.substring(searchString.lastIndexOf(',')+1, searchString.length);
    let subStrAND = " and";
    searchString = "Results that contain "+ firstTermToPenultimateTerm + subStrAND + lastTerm;
    this.displayQuery[0] = searchString;
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
    var result = [];
    for(var i = 0; i < this.queryNumber; i++) {
      var currInputId = "newField".concat((i+1).toString());
      var currInputName = (<HTMLInputElement>document.getElementById(currInputId)).name;
      var currInputValue = (<HTMLInputElement>document.getElementById(currInputId)).value;
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
          if (result[i][0].substring(3).includes("allFields"))
          {
            ANDString += "docBody" + "-" + result[i][1][j] + "_";
            ANDString += "sourceNote" + "-" + result[i][1][j] + "_";
            ANDString += "footnotes" + "-" + result[i][1][j] + "_";
            continue;
          }
          ANDString += result[i][0].substring(3) + "-" + result[i][1][j] + "_";
        }
      } else if(result[i][0].includes("OR")) {
        for(var j = 0; j < result[i][1].length; j++) {
          if (result[i][0].substring(3).includes("allFields"))
          {
            ORString += "docBody" + "-" + result[i][1][j] + "_";
            ORString += "sourceNote" + "-" + result[i][1][j] + "_";
            ORString += "footnotes" + "-" + result[i][1][j] + "_";
            continue;
          }
          ORString += result[i][0].substring(3) + "-" + result[i][1][j] + "_";
        }
      } else if(result[i][0].includes("NOT")) {
        for(var j = 0; j < result[i][1].length; j++) {
          if (result[i][0].substring(3).includes("allFields"))
          {
            NOTString += "docBody" + "-" + result[i][1][j] + "_";
            NOTString += "sourceNote" + "-" + result[i][1][j] + "_";
            NOTString += "footnotes" + "-" + result[i][1][j] + "_";
            continue;
          }
          NOTString += result[i][0].substring(3) + "-" + result[i][1][j] + "_";
        }        
      }
    }
    queryString = ANDString + ORString + NOTString
    this.displayQuery[0] =  ANDString.substring(6);
    this.displayQuery[1] = ORString.substring(5);
    this.displayQuery[2] = NOTString.substring(6);
    console.log("Before constructing sentences, the indices of displayQuery array are as follows:\n")
    for (let i = 0; i < this.displayQuery.length; i++) 
    {
      console.log("this.displayQuery["+i+"] = " + this.displayQuery[i]);
    }
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
      //this.displayQuery[1] = this.displayQuery[2] = "";
      if (this.searchOnlyOneField(ANDIndex))
      {
        this.constructANDSentence(ANDIndex);
      } 
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