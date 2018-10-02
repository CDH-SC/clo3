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

  volume : Volume;

  constructor(
    private volumeService: VolumeService,
  ) { }

  ngOnInit() {
    this.volumeService.getVolumeById<Volume[]>("01")
    .subscribe(data => {
      this.volume = data["data"];

      console.log(data);
    });
  }
}
