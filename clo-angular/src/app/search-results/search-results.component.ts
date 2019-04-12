import { Component, OnInit } from '@angular/core';
import { SearchResult } from '../_shared/models/searchResult';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../_shared/_services/search.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  searchTerm: string;
  // searchResults: SearchResult;
  searchResults: any;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    // Get search term from router
    this.searchTerm = this.route.snapshot.paramMap.get('search');

    // Pass search term through search API and subscribe
    // to results
    this.searchResults = this.searchService.search(this.searchTerm);

    // Uncomment for debug purposes
    this.searchService.search(this.searchTerm).subscribe(res => {
      console.log(res);
    });
  }

}
