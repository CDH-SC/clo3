import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/api/esearch/';

@Injectable({providedIn: 'root'})
export class ElasticSearchService {

  constructor(
    private http: HttpClient,
  ) {}

  search(searchTerm: string) {
    return this.http.get(BACKEND_URL + searchTerm);
  }

  advancedSearch(query: string) {
    return this.http.get(BACKEND_URL + 'advanced-search/' + query);
  }

}
