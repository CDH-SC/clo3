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
    rival_brothers: string;
    biographicalNote: string;
    inMemoriam: string;
    janeNotebook: string;
    simpleStory: string;
    janeJournal: string;
    geraldineJewsbury: string;
    ellenTwisleton: string;
    athanaeumAdvertisements: string;
    auroraComments: string;
    appendix: string;
    JWCbyTait: string;
    TCbyTait: string;
    letters: [{
      _id: string;
      docDate: string;
      firstPage: string;
      lastPage: string;
      docAuthor: string;
      sender: string;
      recipient: string;
      sourceNote: string;
      head: string;
      docBody: string;
      footnotes: [string];
    }];
    accounts: [{
      _id: string;
      docDate: string;
      firstPage: string;
      lastPage: string;
      docAuthor: string;
      sender: string;
      recipient: string;
      sourceNote: string;
      head: string;
      docBody: string;
      footnotes: [string];
    }];
  }

export default Volume;
