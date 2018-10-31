import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Lightbox, LightboxConfig, LightboxEvent, LIGHTBOX_EVENT } from 'ngx-lightbox';
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
    private _lightbox: Lightbox,
    private _lightboxConfig: LightboxConfig,
    private _lightboxEvent: LightboxEvent,
    private modalService: NgbModal,
  ) { _lightboxConfig.disableScrolling = true; }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.albumService.getAlbumById<Album[]>(+id)
      .subscribe(data => {
        this.album = data['data'];
        console.log(this.album);

        for (let i = 0; i < this.album.images.length; i++) {
          const src = this.album.albumUrl + this.album.images[i].imageUrl;
          const album = { src: src, num: i };
          this._albums.push(album);
        }
      });
  }

// Open/close image Lightbox
  open(index: number): void {
    this._subscription = this._lightboxEvent.lightboxEvent$.subscribe(event => this._onReceivedEvent(event));
    this._lightbox.open(this._albums, index);
  }
  close(): void {
    this._lightbox.close();
  }

// Metadata modal
  openModal(content) {
    this.modalService.open(content, { windowClass: 'metadataModal', centered: true });
  }

  // Watch for any events related to lightbox
  _onReceivedEvent(event: any): void {
    if (event.id === LIGHTBOX_EVENT.CLOSE) {
      this._subscription.unsubscribe();
      this.modalService.dismissAll();
    }
    if (event.id === LIGHTBOX_EVENT.OPEN) {
    }
    if (event.id === LIGHTBOX_EVENT.CHANGE_PAGE) {
      console.log(event.data);
    }
  }
}
