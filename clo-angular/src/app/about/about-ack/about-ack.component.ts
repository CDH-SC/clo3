import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-ack',
  templateUrl: './about-ack.component.html',
  styleUrls: ['./about-ack.component.css']
})
export class AboutAckComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.footer.positionFooter();
  }

}
