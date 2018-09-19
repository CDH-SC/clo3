import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../_shared/_services/volumes.service';
import { Volume } from '../_shared/models/volume';

@Component({
  selector: 'app-volume-content',
  templateUrl: './volume-content.component.html',
  styleUrls: ['./volume-content.component.css']
})
export class VolumeContentComponent implements OnInit {

  volume : Volume;

  constructor(
    private volumeService: VolumeService,
  ) { }

  ngOnInit() {
    this.volume = this.volumeService.getVolumes();
  }

}
