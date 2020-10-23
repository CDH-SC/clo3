import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from '../_shared/_services/album.service';
import Album from '../_shared/models/album';
import Volume from '../_shared/models/volume';

import { faAngleLeft, faAngleRight, faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

import Viewer from 'viewerjs';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent implements OnInit, AfterViewChecked {
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;

  album: Album;
  albumId: string;

  image: any;
  imageUrl: string;
  imageId: string;
  prevId: string;
  nextId: string;
  imageMetadata: any;

  volume: Volume;

  dropdownHidden = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private albumService: AlbumService
  ) { }

  ngOnInit() {
    this.albumId = this.route.snapshot.paramMap.get('album');
    this.imageId = this.route.snapshot.paramMap.get('id');

    this.albumService.getAlbumById<Album[]>(+this.albumId)
    .subscribe(data => {
      this.album = data['data'];
      this.goToImage(this.imageId);
    });
  }

  ngAfterViewChecked() {
    const viewer = new Viewer(document.getElementById('image'), {
      inline: false,
      navbar: false,
      title: false,
      toolbar: {
        zoomIn: true,
        zoomOut: true,
        oneToOne: true,
        reset: true,
        rotateLeft: true,
        rotateRight: true,
        flipHorizontal: true,
        flipVertical: true,
      },
      ready() {
        viewer.show(true);
      },
      hide() {
        viewer.destroy();
      }
    });
  }

  goToImage(id: string) {
    this.imageId = id;
    this.image = this.album.images[this.imageId];
    this.imageUrl = this.album.imagesFolder + this.image.imageUrl;
    this.router.navigateByUrl('/photo-viewer/' + this.albumId + '/' + this.imageId);
    this.prevId = this.setPrevId(this.imageId);
    this.nextId = this.setNextId(this.imageId);
    this.imageMetadata = this.image.metadata;
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
