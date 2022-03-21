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
    let index_of_pic = Math.floor((Math.random() * 47))+1;
    let pic_to_display = "../../assets/frontice_images/volume"+index_of_pic+".gif"
    document.getElementById('image').setAttribute('src',pic_to_display);
    let index_of_pic2 = Math.floor((Math.random() * 47))+1;
    while(index_of_pic==index_of_pic2) {
      index_of_pic2 = Math.floor((Math.random() * 47))+1;
    }
    let pic_to_display2 = "../../assets/frontice_images/volume"+index_of_pic2+".gif"
    document.getElementById('image2').setAttribute('src',pic_to_display2);
    // this.footer.positionFooter();
  }
  quotes = ["What we become depends on what we read after all of the professors are done with us. The greatest university of all is a collection of books.",
             "I've got a great ambition to die of exhaustion rather than boredom.",
               "All that mankind has done, thought, gained, or been; it is lying as in magic preservation in the pages of books.",
                "Go as far as you can see; when you get there, you'll be able to see further.",
                 "A loving heart is the beginning of all knowledge.",
                  "Conviction is worthless unless it is converted into conduct.",
                   "A loving heart is the beginning of all knowledge.",
                    "Conviction is worthless unless it is converted into conduct.",
                     "Every man is my superior in that I may learn from him.",
                       "The tragedy of life is not so much what men suffer, but rather what they miss.",
                        "Popular opinion is the greatest lie in the world."]
  AMOUNT_OF_QUOTES = this.quotes.length;
  index_of_quote_to_display = Math.floor((Math.random() * this.AMOUNT_OF_QUOTES));

}
