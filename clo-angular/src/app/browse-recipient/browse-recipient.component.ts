import { Component, OnInit } from '@angular/core';
import { FooterService } from '../_shared/_services/footer.service';

@Component({
  selector: 'app-browse-recipient',
  templateUrl: './browse-recipient.component.html',
  styleUrls: ['./browse-recipient.component.css']
})
export class BrowseRecipientComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.footer.positionFooter();
  }

}
