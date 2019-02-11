import { Component, OnInit } from '@angular/core';
import { FooterService } from '../../_shared/_services/footer.service';

@Component({
  selector: 'app-about-project',
  templateUrl: './about-project.component.html',
  styleUrls: ['./about-project.component.css']
})
export class AboutProjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.footer.positionFooter();
  }

}
