import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Album } from '../_shared/models/album';
import { AlbumService } from '../_shared/_services/album.service';

@Component({
  selector: 'app-album-viewer',
  templateUrl: './album-viewer.component.html',
  styleUrls: ['./album-viewer.component.css'],
})
export class AlbumViewerComponent implements OnInit {

  album: Album;
  _albums = [];
  _subscription: Subscription;

  constructor(
    private albumService: AlbumService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    this.albumService.getAlbumById<Album[]>(+id)
      .subscribe(data => {
        this.album = data['data'];

        for (let i = 0; i < this.album.images.length; i++) {
          const src = this.album.imagesFolder + this.album.images[i].imageUrl;
          const title = this.album.images[i].metadata.title.substring(27);
          console.log(title);
          const album = { src: src, num: i,title:title };
          this._albums.push(album);
        }
      });
  }
}
