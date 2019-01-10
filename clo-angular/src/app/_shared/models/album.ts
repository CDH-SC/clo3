import { Injectable } from '@angular/core';

/**
  Album model
  */
  @Injectable()
  export class Album {
    _id: number;
    thumbnailUrl: string;
    fullsizeUrl: string;
    images: [{
      imageUrl: string;
      date: string;
      caption: string;
      title: string;
      creator: string;
    }];
  }

export default Album;
