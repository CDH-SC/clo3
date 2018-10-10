import { Component, OnInit } from '@angular/core';
import { VolumeService } from '../_shared/_services/volumes.service';
import { Volume } from '../_shared/models/volume';
import 'rxjs/add/operator/map';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-volume-toc',
  templateUrl: './volume-toc.component.html',
  styleUrls: ['./volume-toc.component.css']
})
export class VolumeTocComponent implements OnInit {

  objectKeys = Object.keys;
  volume: [Volume];
  tocKeys: string[] = [];
  prevId: string = null;
  nextId: string = null;
  volumeId: string;

  constructor(
    private volumeService: VolumeService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    this.volumeService.getVolumeById<Volume[]>(id)
      .subscribe(data => {
        this.volume = data['data'];
        this.setKeys();
        this.volumeId = this.volume._id;
        // Setting prevId
        if (parseInt(this.volumeId, 10) <= 1) {
          this.prevId = null;
        } else {
          if (parseInt(this.volumeId, 10) < 10) {
            this.prevId = '0' + (parseInt(this.volumeId, 10) - 1);
          } else {
            this.prevId = (parseInt(this.volumeId, 10) - 1).toString();
          }
        }
        // Setting nextId
        if (parseInt(this.volumeId, 10) >= 44) {
          this.nextId = null;
        } else {
          if (parseInt(this.volumeId, 10) < 9) {
            this.nextId = '0' + (parseInt(this.volumeId, 10) + 1);
          } else {
            this.nextId = (parseInt(this.volumeId, 10) + 1).toString();
          }
        }

        console.log(this.prevId);
        console.log(this.nextId);
      });
  }

  /**
   * Sets the Keys to the proper full text string for the denoted key
   *
   * In future volumes, if a key is added that is not already included, simply
   * add it to the list of the switch statement if it is more than one word.
   */
  setKeys() {
    for (let k in this.volume) {
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
  /**
   * Essentially Pagination for entire volumes
   */
  goToNextVolume(volId: String) {
    console.log(volId);
  }

  goToPrevVolume(volId: String) {
    console.log(volId);
  }

}
