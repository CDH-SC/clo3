import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-carlyles',
  templateUrl: './about-carlyles.component.html',
  styleUrls: ['./about-carlyles.component.css']
})
export class AboutCarlylesComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();
  }

}
