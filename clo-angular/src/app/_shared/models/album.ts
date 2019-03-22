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
          creators: string[],
          date: string,
          media_type: string,
          note: string,
          source: string,
          digital_specs: string,
          date_digital: string,
          rights: string,
          language_note: string,
          format: string,
          publisher: string,
        }
      }
    ]
  }

export default Album;
