import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../_shared/_services/volumes.service';
import { Volume } from '../_shared/models/volume';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-volume-content',
  templateUrl: './volume-content.component.html',
  styleUrls: ['./volume-content.component.css']
})
export class VolumeContentComponent implements OnInit {

  volumes: [Volume];

  constructor(
    private volumeService: VolumeService,
  ) { }

  ngOnInit() {
    this.volumeService.getAllVolumes<Volume[]>()
    .subscribe(data => {
      this.volumes = data['data'];

      console.log(data);
    });
  }

  filterBy(prop: string) {
    return this.volumes.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }

}
