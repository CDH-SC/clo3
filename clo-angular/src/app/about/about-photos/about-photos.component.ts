import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-photos',
  templateUrl: './about-photos.component.html',
  styleUrls: ['./about-photos.component.css']
})
export class AboutPhotosComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();
  }

}
