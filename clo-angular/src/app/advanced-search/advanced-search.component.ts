import { Component, OnInit, ElementRef, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent {

  route = '';
  searchQuery;

  constructor(@Inject(DOCUMENT) document) { }

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

  addField() {
    this.queryNumber++;
    this.fields.push("newField"+this.queryNumber+"fields");
    this.boolOps.push("newField"+this.queryNumber+"boolOp");
    this.inputs.push("newField"+this.queryNumber);
    let newQuery = [this.boolOps,this.fields,this.inputs];
    this.queries.push(newQuery);
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
      console.log(check);
      if(check[0]) {
        result[check[1]][1].push(currInputValue);
      } else {
        result.push([currInputName, [currInputValue]]);
      }
    }
    console.log(result); //remove the checks for typeof 

    // var result = Object.keys(req.body).map(function(key) {
    //   return [key, req.body[key]];
    // });
    // var queryString = ""
    // andArray = [];
    // orArray = [];
    // notArray = [];
    // for(var i = 0; i < result.length; i++) {
    //   var fieldName = "letters." + result[i][0].substring(3);
    //   if(result[i][0].includes("AND")) {
    //     if(typeof(result[i][1]) == typeof("")) {
    //       match_phrase = {};
    //       match_phrase[fieldName] = result[i][1];
    //       andArray.push({
    //         match_phrase
    //       });
    //       queryString += "AND "+ result[i][0].substring(3) + ": " + result[i][1] + "\n";
    //     } else {
    //       for(var j = 0; j < result[i][1].length; j++) {
    //         match_phrase = {};
    //         match_phrase[fieldName] = result[i][1][j];
    //         andArray.push({
    //           match_phrase
    //         });
    //         queryString += "AND "+ result[i][0].substring(3) + ": " + result[i][1][j] + "\n";
    //       }
    //     }
    //   } else if(result[i][0].includes("OR")) {
    //     if(typeof(result[i][1]) == typeof("")) {
    //       match_phrase = {};
    //       match_phrase[fieldName] = result[i][1];
    //       orArray.push({
    //         match_phrase
    //       });
    //       queryString += "OR "+ result[i][0].substring(3) + ": " + result[i][1] + "\n";
    //     } else {
    //       for(var j = 0; j < result[i][1].length; j++) {
    //         match_phrase = {};
    //         match_phrase[fieldName] = result[i][1][j];
    //         orArray.push({
    //           match_phrase
    //         });
    //         queryString += "OR "+ result[i][0].substring(3) + ": " + result[i][1][j] + "\n";
    //       }
    //     }
    //   } else if(result[i][0].includes("NOT")) {
    //     if(typeof(result[i][1]) == typeof("")) {
    //       match_phrase = {};
    //       match_phrase[fieldName] = result[i][1];
    //       notArray.push({
    //         match_phrase
    //       });
    //       queryString += "NOT "+ result[i][0].substring(3) + ": " + result[i][1] + "\n";
    //     } else {
    //       for(var j = 0; j < result[i][1].length; j++) {
    //         match_phrase = {};
    //         match_phrase[fieldName] = result[i][1][j];
    //         andArray.push({
    //           match_phrase
    //         });
    //         queryString += "NOT "+ result[i][0].substring(3) + ": " + result[i][1][j] + "\n";
    //       }
    //     }
    //   }
    // }
    // queryObject = {
    //     must: andArray,
    //     should: orArray,
    //     must_not: notArray
    //   };
    // console.log(queryObject);
    // console.log(andArray);
    // console.log(orArray);
    // console.log(notArray);
    // client.search({
    //   size: 45,
    //   index: 'volumes',
    //   body: {
    //     query: {
    //       nested: {
    //         path: "letters",
    //         query: {
    //           bool: queryObject
    //         },
    //         inner_hits : {
    //           size: 10
    //         }
    //       }
    //     }
    //   }
    // },function (error, response,status) {
    //     if (error){
    //       console.log("search error: "+error)
    //     }
    //     else {
    //       var searchResults = new Array();
    //       response.body.hits.hits.forEach(function(hit) {
    //         hit.inner_hits.letters.hits.hits.forEach(function(inHit){
    //           console.log(hit._id);
    //           var result = {
    //             _id: hit._id,
    //             source: inHit._source,
    //             terms: result,
    //             letter: inHit._source
    //           }
    //           searchResults.push(result);
    //         });
    //       });
    //       searchResults.sort(compareValues('score', 'desc'));
    //       res.render("boolesearch", {searchQuery:queryString, volumes:searchResults});
    //     }
    //   });
  }
}