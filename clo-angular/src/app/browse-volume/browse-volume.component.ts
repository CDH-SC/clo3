import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-browse-volume',
  templateUrl: './browse-volume.component.html',
  styleUrls: ['./browse-volume.component.css']
})
export class BrowseVolumeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const windowHeight = window.innerHeight;
    console.log(windowHeight);
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

    const collapseMenus = document.getElementsByClassName('collapse');
    for (let i = 0; i < collapseMenus.length; i++) {
      collapseMenus[i].addEventListener('transitionend', function () {
        const updatedDivHeight = document.getElementById('content').clientHeight;
        const updatedPageHeight = headerHeight + updatedDivHeight + offset;
        if (window.innerHeight > updatedPageHeight) {
          document.getElementById('footer').style.position = 'absolute';
        } else {
          document.getElementById('footer').style.position = 'relative';
        }
      });
    }
  }

}
