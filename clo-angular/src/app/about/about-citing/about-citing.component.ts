import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-citing',
  templateUrl: './about-citing.component.html',
  styleUrls: ['./about-citing.component.css']
})
export class AboutCitingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const windowHeight = window.innerHeight;
    const headerHeight = document.getElementById('header').clientHeight;
    const divHeight = document.getElementById('content').clientHeight;
    const offset = 200;
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
