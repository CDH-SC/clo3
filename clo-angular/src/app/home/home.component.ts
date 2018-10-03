import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FooterService } from '../_shared/_services/footer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router, private footer: FooterService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  ngOnInit() {
    this.footer.positionFooter();
  }
}
