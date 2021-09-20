import { Injectable } from '@angular/core';

/**
  Volume model
  */
  @Injectable()
  export class Volume {
    _id: string;
    volume_dates: string;
    acknowledgements: {
      body: string;
      footnotes: [string];
    };
    introduction: {
      body: string;
      footnotes: [string];
    };
    letters_to_carlyles: string;
    key_to_references: string;
    chronology: string;
    rival_brothers: {
      body: string;
      footnotes: [string];
    };
    biographicalNote: string;
    inMemoriam: string;
    janeNotebook: {
      body: string;
      footnotes: [string];
    };
    simpleStory: {
      body: string;
      footnotes: [string];
    };
    janeJournal: {
      body: string;
      footnotes: [string];
    };
    geraldineJewsbury: {
      body: string;
      footnotes: [string];
    };
    ellenTwisleton: {
      body: string;
      footnotes: [string];
    };
    athanaeumAdvertisements: string;
    auroraComments: string;
    appendix: string;
    JWCbyTait: string;
    TCbyTait: string;
    will_of_TC: string;
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
      // manuscript: [string];
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
    frontice_piece: {
      imageUrl: string;
      imageCaption: string;
    };
  }

export default Volume;
