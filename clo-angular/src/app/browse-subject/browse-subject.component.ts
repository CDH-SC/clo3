import { Component, OnInit } from '@angular/core';
import { FooterService } from '../_shared/_services/footer.service';

@Component({
  selector: 'app-browse-subject',
  templateUrl: './browse-subject.component.html',
  styleUrls: ['./browse-subject.component.css']
})
export class BrowseSubjectComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();
  }

}
