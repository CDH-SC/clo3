import { Component, OnInit, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Mark from 'mark.js';

// import { SearchService } from '../_shared/_services/search.service';
import { ElasticSearchService } from '../_shared/_services/elastic-search.service';
import { ElasticSearch } from '../_shared/models/elastic-search';
import { VolumeService } from '../_shared/_services/volumes.service';
import { Volume } from '../_shared/models/volume';

import { faPlusSquare, faGrinTongueSquint } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchResultsComponent implements OnInit {

  searchTerm: string;
  searchResults: any;
  text: string;

  viewContent: SafeHtml;
  letters: any;
  volume: [Volume];

  page = 1;
  pageSize = 10;

  start = 1;
  end = 10;

  faPlusSquare = faPlusSquare;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    // private searchService: SearchService,
    private searchService: ElasticSearchService,
    private volumeService: VolumeService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Get search term from router
    this.searchTerm = this.route.snapshot.paramMap.get('search');

    // Pass search term through search API and subscribe
    // to results
    // this.searchService.search(this.searchTerm).subscribe(data => {
    //   this.searchResults = data['data'];
    // });
    this.searchResults = this.searchService.search(this.searchTerm);
    this.searchService.search(this.searchTerm).subscribe(data => {
      console.log(data['data']);
    })
  }

  ngAfterViewChecked() {
    var instance = new Mark(document.querySelectorAll('.viewer-box'));
    instance.mark(this.searchTerm);
  }

  setPage(page: number) {
    this.page = page;
    this.end = this.page * this.pageSize;
    this.start = this.end - (this.pageSize - 1);
  }

  safeHTML(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
