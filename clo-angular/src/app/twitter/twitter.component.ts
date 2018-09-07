import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css']
})
export class TwitterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // Loads twitter widget when navigated to
    // twttr.widgets.load();
  }

}
