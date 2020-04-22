import { Component, OnInit, ElementRef, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {NgForm} from '@angular/forms';
import { faPlusSquare, faGrinTongueSquint } from '@fortawesome/free-solid-svg-icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { ElasticSearchService } from '../_shared/_services/elastic-search.service';
import { ElasticSearch } from '../_shared/models/elastic-search';

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

  fields = ["newField1fields"];
  boolOps = ["newField1boolOp"];
  inputs = ["newField1"];
  query = [this.boolOps,this.fields,this.inputs];
  queries = [this.query];
  queryNumber = 1;
  searchResults: any;

  page = 1;
  pageSize = 10;

  start = 1;
  end = 10;

  addField() {
    this.queryNumber++;
    this.fields.push("newField"+this.queryNumber+"fields");
    this.boolOps.push("newField"+this.queryNumber+"boolOp");
    this.inputs.push("newField"+this.queryNumber);
    let newQuery = [this.boolOps,this.fields,this.inputs];
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

  //checks if a boolean-searchfield combination has been added already
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
          ANDString += result[i][0].substring(3) + "-" + result[i][1][j] + "_";
        }
      } else if(result[i][0].includes("OR")) {
        for(var j = 0; j < result[i][1].length; j++) {
          ORString += result[i][0].substring(3) + "-" + result[i][1][j] + "_";
        }
      } else if(result[i][0].includes("NOT")) {
        for(var j = 0; j < result[i][1].length; j++) {
          NOTString += result[i][0].substring(3) + "-" + result[i][1][j] + "_";
        }        
      }
    }
    queryString = ANDString + ORString + NOTString
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