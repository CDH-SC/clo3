import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FooterService } from '../_shared/_services/footer.service';

@Component({
  selector: 'app-browse-volume',
  templateUrl: './browse-volume.component.html',
  styleUrls: ['./browse-volume.component.css']
})
export class BrowseVolumeComponent implements OnInit {

  constructor(private footer: FooterService) { }

  ngOnInit() {
    this.footer.positionFooter();

    const volumeButtons = document.getElementsByClassName('collapse');
    for (let i = 0; i < volumeButtons.length; i++) {
      volumeButtons[i].addEventListener('transitionend', () => {
        this.footer.positionFooter();
      });
    }
  }
}
