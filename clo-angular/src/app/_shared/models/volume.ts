import { Injectable } from '@angular/core';

/**
  Volume model
  */
  @Injectable()
  export class Volume {
    _id:        string;
    xml_id:     string;
    volume_id:  number;
    docDate:    string;
    firstpage:  string;
    lastpage:   string;
    docAuthor:  string;
    sender:     string;
    recipient:  string;
    sourceNote: string;
    textClean:  string;
    next_id:    string;
    prev_id:    string;
  }

export default Volume;
