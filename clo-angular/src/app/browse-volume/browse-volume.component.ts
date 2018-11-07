import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FooterService } from '../_shared/_services/footer.service';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';

@Component({
  selector: 'app-browse-volume',
  templateUrl: './browse-volume.component.html',
  styleUrls: ['./browse-volume.component.css']
})
export class BrowseVolumeComponent implements OnInit {

  faIcon = faPlus;

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();

    const collapseMenus = document.getElementsByClassName('collapse');
    for (let i = 0; i < collapseMenus.length; i++) {
      collapseMenus[i].addEventListener('transitionend', () => {
        this.footer.positionFooter();
      });
    }
  }
}
