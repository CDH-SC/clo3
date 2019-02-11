import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-citing',
  templateUrl: './about-citing.component.html',
  styleUrls: ['./about-citing.component.css']
})
export class AboutCitingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.footer.positionFooter();
  }

}
