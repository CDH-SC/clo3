import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-printed',
  templateUrl: './about-printed.component.html',
  styleUrls: ['./about-printed.component.css']
})
export class AboutPrintedComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();
  }

}
