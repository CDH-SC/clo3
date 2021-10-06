import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  ngOnInit() {
    // this.footer.positionFooter();
  }

  getRandomQuoteIndex(upperBound) {
    return Math.floor(Math.random() * upperBound);
  }
  quotes = ["quote 1", "quote 2", "quote 3",
              "quote 4", "quote 5", "quote 6"];
  amountOfQuotes = this.quotes.length;
  thisQuote = this.getRandomQuoteIndex(this.amountOfQuotes);
}
