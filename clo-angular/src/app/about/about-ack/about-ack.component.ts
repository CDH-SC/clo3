import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-ack',
  templateUrl: './about-ack.component.html',
  styleUrls: ['./about-ack.component.css']
})
export class AboutAckComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();
  }

}
