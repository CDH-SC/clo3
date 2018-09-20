import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../_shared/_services/volumes.service';
import { Volume } from '../_shared/models/volume';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.css']
})
export class LetterComponent implements OnInit {

  volume : Volume;

  constructor(
    private volumeService: VolumeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.volumeService.getVolumeById<Volume[]>(id)
    .subscribe(data => {
      this.volume = data["data"];

      console.log(data);
    });
  }

}
