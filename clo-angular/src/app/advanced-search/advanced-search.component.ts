import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class AdvancedSearchComponent {

  route = '';

  constructor(private router: Router) {}

  // Goes to search results page when enter is pressed
  onEnter(route) {
    // console.log(route);
    this.router.navigate(['search-results/', route]);
  }

}
