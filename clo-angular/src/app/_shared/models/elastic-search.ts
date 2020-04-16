import { Injectable } from '@angular/core';

@Injectable()
export class ElasticSearch {
  _id: string;
  score: number;
  terms: string;
  letter: {
    xml_id: string,
    docDate: string,
    firstPage: string,
    lastPage: string,
    docAuthor: string,
    sender: string,
    recipient: string,
    sourceNote: string,
    docBody: string,
    footnotes: [string]
  }
}

export default ElasticSearch;
