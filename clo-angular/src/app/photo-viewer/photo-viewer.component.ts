import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlbumService } from '../_shared/_services/album.service';
import Album from '../_shared/models/album';

@Component({
  selector: 'app-photo-viewer',
  templateUrl: './photo-viewer.component.html',
  styleUrls: ['./photo-viewer.component.css']
})
export class PhotoViewerComponent implements OnInit {

  album: Album;
  image;

  constructor(
    private route: ActivatedRoute,
    private albumService: AlbumService,
  ) { }

  ngOnInit() {
    const albumId = this.route.snapshot.paramMap.get('album');
    const imageId = this.route.snapshot.paramMap.get('id');
    console.log(albumId + '/' + imageId);

    this.albumService.getAlbumById<Album[]>(+albumId)
      .subscribe(data => {
        this.album = data['data'];
        this.image = this.album.albumUrl + this.album.images[imageId].imageUrl;
      });
  }

}
