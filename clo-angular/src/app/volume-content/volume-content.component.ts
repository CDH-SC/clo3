import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { Volume } from '../_shared/models/volume';
import { VolumeService } from '../_shared/_services/volumes.service';

@Component({
  selector: 'app-volume-content',
  templateUrl: './volume-content.component.html',
  styleUrls: ['./volume-content.component.css']
})
export class VolumeContentComponent implements OnInit {

  volume: [Volume];
  volumeId: string;

  objectKeys = Object.keys;
  tocKeys: string[] = [];
  prevId: string = null;
  nextId: string = null;

  constructor(
    private volumeService: VolumeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.volumeId = id;

    this.volumeService.getVolumeById<Volume[]>(id)
      .subscribe(data => {
        this.volume = data['data'];
        this.setKeys();
        this.prevId = this.setVolumeId(this.volumeId, 'prev');
        this.nextId = this.setVolumeId(this.volumeId, 'next');
        console.log(this.prevId);
        console.log(this.nextId);
      });
  }

  setKeys() {
    for (const k in this.volume) {
      if (this.volume.hasOwnProperty(k)) {
        switch (k) {
          case '_id': {
            break;
          }
          case 'volume_dates': {
            break;
          }
          case 'letters_to_carlyles': {
            this.tocKeys.push('Letters to the Carlyles');
            break;
          }
          case 'key_to_references': {
            this.tocKeys.push('Key to References');
            break;
          }
          case 'rival_brothers': {
            this.tocKeys.push('The Rival Brothers: Fragment of a Play by Jane Baillie Welsh');
            break;
          }
          case 'biographicalNote': {
            this.tocKeys.push('Biographical Notes');
            break;
          }
          case 'inMemoriam': {
            this.tocKeys.push('In Memoriam');
            break;
          }
          case 'JWCbyTait': {
            this.tocKeys.push('JWC by Robert Scott Tait');
            break;
          }
          case 'janeNotebook': {
            this.tocKeys.push('Jane Carlyle Notebook');
            break;
          }
          case 'simpleStory': {
            this.tocKeys.push('Simple Story of My Own First Love');
            break;
          }
          case 'janeJournal': {
            this.tocKeys.push('Jane Welsh Carlyle Journal');
            break;
          }
          case 'geraldineJewsbury': {
            this.tocKeys.push('Geraldine Jewsbury to Froude');
            break;
          }
          case 'ellenTwisleton': {
            this.tocKeys.push('Ellen Twisleton Account of Life at Craigenputtoch');
            break;
          }
          case 'auroraComments': {
            this.tocKeys.push('Comments on Aurora Leigh');
            break;
          }
          case 'athanaeumAdvertisements': {
            this.tocKeys.push('Athanaeum Advertisements');
            break;
          }
          case 'accounts': {
            if (this.volume['accounts'].length > 0) {
              this.tocKeys.push('Account\'s of JWC\'s Death');
            }
            break;
          }
          default: {
            this.tocKeys.push(k);
            break;
          }
        }
      }
    }
  }

  setVolumeId(volId: string, nextOrPrev: string) {
    if (nextOrPrev.toLowerCase() === 'prev') {
      if (parseInt(volId, 10) <= 1) {
        return null;
      } else {
        if (parseInt(volId, 10) < 10) {
          return '0' + (parseInt(volId, 10) - 1);
        } else {
          return (parseInt(volId, 10) - 1).toString();
        }
      }
    } else if (nextOrPrev.toLowerCase() === 'next') {
      if (parseInt(volId, 10) >= 44) {
        return null;
      } else {
        if (parseInt(volId, 10) < 9) {
          return '0' + (parseInt(volId, 10) + 1);
        } else {
          return (parseInt(volId, 10) + 1).toString();
        }
      }
    }
  }

  goToVolume(volId: string) {
    console.log(volId);
  }
}
