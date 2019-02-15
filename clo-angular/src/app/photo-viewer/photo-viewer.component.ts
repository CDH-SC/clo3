import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../_shared/_services/album.service';
import Album from '../_shared/models/album';

import { faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

import Viewer from 'viewerjs';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent implements OnInit {

  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  album: Album;
  albumId: string;
  image: any;

  imageId: string;
  prevId: string;
  nextId: string;

  thumbnailUrl: string;
  fullsizeUrl: string;

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService
  ) { }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('album');
    this.imageId = this.route.snapshot.paramMap.get('id');

    this.albumService.getAlbumById<Album[]>(+this.albumId)
    .subscribe(data => {
      this.album = data['data'];
      this.image = this.album.images[this.imageId];
      this.thumbnailUrl = this.album.thumbnailUrl + this.image.imageUrl;
      this.fullsizeUrl = this.album.fullsizeUrl + this.image.imageUrl;
      this.prevId = this.setPrevId(this.imageId);
      this.nextId = this.setNextId(this.imageId);
    });

    const viewer = new Viewer(document.getElementById('image'), {
      viewed() {
        viewer.zoomTo(0.5);
      },
      toolbar: false,
      title: false,
      navbar: false,
    });
  }

  goToImage(id: string) {
    this.imageId = id;
    this.image = this.album.images[this.imageId];
    this.thumbnailUrl = this.album.thumbnailUrl + this.image.imageUrl;
    this.fullsizeUrl = this.album.fullsizeUrl + this.image.imageUrl;
    this.prevId = this.setPrevId(this.imageId);
    this.nextId = this.setNextId(this.imageId);
  }

  goToStart() {
    this.goToImage('0');
  }

  goToEnd() {
    this.goToImage((this.album.images.length - 1).toString());
  }

  setNextId(currId: string) {
    if (parseInt(currId, 10) >= this.album.images.length - 1) {
      return null;
    } else {
      return (parseInt(currId, 10) + 1).toString();
    }
  }

  setPrevId(currId: string) {
    if (parseInt(currId, 10) === 0) {
      return null;
    } else {
      return (parseInt(currId, 10) - 1).toString();
    }
  }

}
