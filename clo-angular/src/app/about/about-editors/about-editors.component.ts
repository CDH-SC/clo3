import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-editors',
  templateUrl: './about-editors.component.html',
  styleUrls: ['./about-editors.component.css']
})
export class AboutEditorsComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();
  }

}
