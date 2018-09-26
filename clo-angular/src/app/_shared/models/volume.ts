import { Injectable } from '@angular/core';

/**
  Volume model
  */
  @Injectable()
  export class Volume {
    _id: string;
    volume_dates: string;
    acknowledgements: string;
    introduction: string;
    letters_to_carlyles: string;
    key_to_references: string;
    chronology: string;
    letters: [{
      _id: string;
      docDate: string;
      firstPage: string;
      lastPage: string;
      docAuthor: string;
      sender: string;
      recipient: string;
      sourceNote: string;
      docBody: string;
      footnotes: [string];
    }];
  }

export default Volume;
