import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.css']
})
export class AdvancedSearchComponent {

  route = '';
  searchQuery = "";

  constructor() { }

  // Goes to search results page when enter is pressed
  onEnter(route) {
    console.log(route);
    // this.router.navigate(['search-results/', route]);
  }

  addField() {
    var fieldNum = document.getElementsByTagName("input").length-1;
    var fieldName = "newField" + fieldNum;
    var newField = 
        "<select id='" + fieldName + "boolOp'>" +
            "<option value='AND'>AND</option>" +
            "<option value='OR-'>OR</option>" + // named OR- so that the input name will have a consistent 3-letter bool prefix
            "<option value='NOT'>NOT</option>" +
        "</select>" +
        "<select id='" + fieldName + "fields'>" +
            "<option value='docBody'>Letter Body</option>" +
            "<option value='sourceNote'>Source Notes</option>" +
            "<option value='footnotes'>Foot Notes</option>" +
        "</select>" +
        "<input type='string' size=80 id='newField" + fieldNum + "' name='ANDdocBody'/><br/>";
    var input = document.createRange().createContextualFragment(newField);
    document.getElementById("new_chq").appendChild(input);
  }

  ngAfterViewInit() {
    // this.ElementRef.nativeElement.querySelector('input').addEventListener('input',
    //       function (event) {
    //           var eventID = event.target.id;
    //           if (eventID.includes("boolOp")) {
    //               var inputID = eventID.replace('boolOp','');
    //               var inputName = document.getElementById(inputID).name;
    //               document.getElementById(inputID).setAttribute("name",event.target.value + inputName.substring(3));
    //           }
    //           else if (eventID.includes("fields")) {
    //               var inputID = eventID.replace('fields','');
    //               var inputName = document.getElementById(inputID).name;
    //               document.getElementById(inputID).setAttribute("name",inputName.substring(0,3) + event.target.value);
    //           }
    //       }, false);
  }

}
