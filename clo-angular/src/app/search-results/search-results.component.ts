import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SearchResult } from '../_shared/models/searchResult';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SearchService } from '../_shared/_services/search.service';
import {NgxPaginationModule} from 'ngx-pagination';
import {PaginationInstance} from '../../../node_modules/ngx-pagination';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {


  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 10,
    currentPage: 1
  };

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
    // this.searchService.search(this.searchTerm).subscribe(res => {
    //   console.log(res);
    // });
  }

}
