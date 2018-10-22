import { Injectable } from '@angular/core';

/**
  Album model
  */
  @Injectable()
  export class Album {
    _id: number;
    albumUrl: string;
    images: [{
      imageUrl: string;
    }];
  }

export default Album;
