import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.css']
})
export class PhotoAlbumComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const windowHeight = window.innerHeight;
    const headerHeight = document.getElementById('header').clientHeight;
    const divHeight = document.getElementById('content').clientHeight;
    const offset = 125;
    const pageHeight = headerHeight + divHeight + offset;

    // Initial Footer Placement
    if (windowHeight > pageHeight) {
      document.getElementById('footer').style.position = 'absolute';
    } else {
      document.getElementById('footer').style.position = 'relative';
    }

    // Adjusts footer position based on window resize
    window.onresize = function () {
      if (this.window.innerHeight > (pageHeight)) {
        this.document.getElementById('footer').style.position = 'absolute';
      } else {
        this.document.getElementById('footer').style.position = 'relative';
      }
    };
  }

}
