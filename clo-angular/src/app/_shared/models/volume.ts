import { Injectable } from '@angular/core';

/**
  Volume model
  */
  @Injectable()
  export class Volume {
    _id:        String;
    xml_id:     String;
    volume_id:  Number;
    docDate:    String;
    firstpage:  String;
    lastpage:   String;
    docAuthor:  String;
    sender:     String;
    recipient:  String;
    sourceNote: String;
    textClean:  String;
    next_id:    String;
    prev_id:    String;
  }
