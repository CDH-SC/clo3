import { Injectable } from '@angular/core';

/**
  Album model
  */
  @Injectable()
  export class Album {
    _id: string;
    album_url: string;
    image: {
      imageUrl: string;
    };
  }

export default Album;
