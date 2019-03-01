import { Injectable } from '@angular/core';

/**
  Album model
  */
  @Injectable()
  export class Album {
    _id: number;
    imagesFolder: string;
    images: [
      {
        imageUrl: string,
        metadata: {
          title: string,
          description: string,
          subjects: string[],
          authors: string[],
          date: string,
          genre: string,
          other_titles: string,
          notes: string,
          reproduction_note: string,
          copyright_information: string,
          language_note: string,
          format: string
        }
      }
    ]
  }

export default Album;
