import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    /**
     * Sets the footer CSS position to make positioning dynamic
     */
    const windowHeight = document.body.clientHeight;
    const divHeight = document.getElementById('content').clientHeight;

    document.getElementById('footer').style.position = windowHeight > divHeight ? 'absolute' : 'relative';
  }

}
