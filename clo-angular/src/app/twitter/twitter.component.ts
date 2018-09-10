import { Component, AfterViewInit,  } from '@angular/core';

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.component.html',
  styleUrls: ['./twitter.component.css']
})
export class TwitterComponent implements AfterViewInit {

  constructor() {}

  ngAfterViewInit() {
    if ((<any>window).twttr.ready()) {
      (<any>window).twttr.widgets.load();
    }
  }
}
