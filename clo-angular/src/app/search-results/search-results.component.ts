import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { SearchService } from '../_shared/_services/search.service';

import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {

  searchTerm: string;
  searchResults: any;

  page = 1;
  pageSize = 10;

  start = 1;
  end = 10;

  faPlusSquare = faPlusSquare;

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
  }

  private setPage(page: number) {
    this.page = page;
    this.end = this.page * this.pageSize;
    this.start = this.end - (this.pageSize - 1);
  }

}
