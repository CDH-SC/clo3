import { Component, OnInit } from '@angular/core';
import { FooterService } from '../_shared/_services/footer.service';

@Component({
  selector: 'app-browse-subject',
  templateUrl: './browse-subject.component.html',
  styleUrls: ['./browse-subject.component.css']
})
export class BrowseSubjectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.footer.positionFooter();
  }

}
