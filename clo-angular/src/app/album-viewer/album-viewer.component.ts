import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';

import { Album } from '../_shared/models/album';
import { AlbumService } from '../_shared/_services/album.service';

@Component({
  selector: 'app-album-viewer',
  templateUrl: './album-viewer.component.html',
  styleUrls: ['./album-viewer.component.css']
})
export class AlbumViewerComponent implements OnInit {

  album: Album;
  _albums = [];

  constructor(
    private albumService: AlbumService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox,
    private _lightboxConfig: LightboxConfig,
  ) { _lightboxConfig.disableScrolling = true; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.albumService.getAlbumById<Album[]>(id)
      .subscribe(data => {
        this.album = data['data'];
        console.log(this.album);

        for (let i = 1; i <= this.album.image.length; i++) {
          const src = this.album.album_url + this.album.image[i].imageUrl;
          const thumb = src;
          const album = {
            src: src,
            thumb: thumb
          };
          this._albums.push(album);
        }
      });
  }

  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }
  close(): void {
    this._lightbox.close();
  }

}
