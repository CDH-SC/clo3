import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/map';

import { Volume } from '../_shared/models/volume';
import { VolumeService } from '../_shared/_services/volumes.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-volume-content',
  templateUrl: './volume-content.component.html',
  styleUrls: ['./volume-content.component.css']
})
export class VolumeContentComponent implements OnInit {

  private TOTAL_VOLUMES = 45;

  objectKeys = Object.keys;

  volume: [Volume];

  volumeId: string;
  prevVolumeId: string = null;
  nextVolumeId: string = null;
  volumeDates: string;
  volumeKeys: Object[] = [];
  currentKey: string;

  isFrontice = false;
  viewContent: SafeHtml;

  letters: any;

  sourceNote: SafeHtml;
  footnotes: any = [];

  hasManuscript = false;
  manuscriptUrl: Object[] = [];

  prevLetterId: string = null;
  nextLetterId: string = null;

  constructor(
    private volumeService: VolumeService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.volumeId = this.route.snapshot.paramMap.get('id');
    this.currentKey = this.route.snapshot.paramMap.get('content');
    this.volumeService.getVolumeById<Volume[]>(this.volumeId)
      .subscribe(data => {
        // Getting the volume returned from our http request
        this.volume = data['data'];
        this.volumeDates = this.volume['volume_dates'];
        // Set the keys for the current volume
        this.setKeys();
        // Set the previous and next volume ids
        this.prevVolumeId = this.setVolumeId(this.volumeId, 'prev');
        this.nextVolumeId = this.setVolumeId(this.volumeId, 'next');
        // Set the previous and next letter ids to null
        this.prevLetterId = null;
        this.nextLetterId = null;
        // Set the letters
        this.letters = this.volumeService.sortLetters(this.volume['letters']);
        // Set the viewContent to be null initially
        this.viewContent = null;
        // If the current key is a frontice piece, we need to create that object
        if (this.currentKey === 'frontice_piece') {
          this.isFrontice = true;
          this.viewContent = this.createFronticePiece(this.volume['frontice_piece']);
        }
        this.volumeKeys.forEach(key => {
          if (this.currentKey === key['key']) {
            this.isFrontice = false;
            this.setPage(this.currentKey);
          }
        });
        // If the viewContent is still null at this step, we have a xml_id as a key
        if (this.viewContent === null) {
          this.isFrontice = false;
          this.getLetter(this.currentKey);
        }
      });
  }

  private createFronticePiece(fronticeObject: Object) {
    const fronticeImage = fronticeObject['imageUrl'];
    const fronticeCaption = fronticeObject['imageCaption'];
    const fronticeHtml = '\
    <img src="assets' + fronticeImage + '" style="max-width: 100%; max-height: 500px;">\n\
    <br>\n\
    <br>\n\
    <p style="margin: 0;">' + fronticeCaption + '</p>\n';
    return this.sanitizer.bypassSecurityTrustHtml(fronticeHtml);
  }

  private setPage(key: string) {
    this.sourceNote = null;
    this.footnotes = [];
    // Set next and prev letter ids to null
    this.prevLetterId = null;
    this.nextLetterId = null;
    // Update url to reflect current section
    this.router.navigateByUrl('/volume/' + this.volumeId + '/' + key);
    this.isFrontice = false;
    if (key === 'introduction') {
      this.volume[key].introFootnotes.forEach(footnote => {
        this.footnotes.push(footnote);
      });
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(
        this.volume[key].introText
      );
    } else {
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(
        this.volume[key]
      );
    }
  }

  goToVolume(volId: string) {
    this.sourceNote = null;
    this.footnotes = [];
    // Update url to reflect we are at the frontice piece of the volume
    this.router.navigateByUrl('/volume/' + volId + '/frontice_piece');
    this.viewContent = null;
    this.volumeId = volId;
    this.volumeKeys = [];
    this.volumeService.getVolumeById<Volume[]>(volId).subscribe(data => {
      this.volume = data['data'];
      this.volumeDates = this.volume['volume_dates'];
      this.setKeys();
      // Setting next and previous volume ids for navigation between volumes
      this.prevVolumeId = this.setVolumeId(this.volumeId, 'prev');
      this.nextVolumeId = this.setVolumeId(this.volumeId, 'next');
      // Setting next and previous letter ids to null
      this.prevLetterId = null;
      this.nextLetterId = null;
      // Get frontice piece object
      this.isFrontice = true;
      try {
        this.viewContent = this.createFronticePiece(this.volume['frontice_piece']);
      } catch (e) {
        console.error(e);
      }
      // Get letters object
      this.letters = this.volumeService.sortLetters(this.volume['letters']);
    });
  }

  getLetter(xml_id: string) {
    this.sourceNote = null;
    this.footnotes = [];
    // scroll to the top of the page when clicked
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 2);
    // Update the url to display the current xml id of the letter
    this.router.navigateByUrl('/volume/' + this.volumeId + '/' + xml_id);
    this.viewContent = null;
    this.volumeService.getLetterById(this.volumeId, xml_id).subscribe(data => {
      const letter = data['data']['letters'][0];
      this.objectKeys(this.letters).forEach((key) => {
        for (const v in this.letters[key]) {
          if (letter.xml_id === this.letters[key][v].xml_id) {
            this.prevLetterId = this.letters[key][v].prevLetter;
            this.nextLetterId = this.letters[key][v].nextLetter;
            break;
          }
        }
      });
      this.isFrontice = false;
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(letter.docBody);
      this.sourceNote = this.sanitizer.bypassSecurityTrustHtml(letter.sourceNote);
      letter.footnotes.forEach(footnote => {
        footnote = this.sanitizer.bypassSecurityTrustHtml(footnote);
        this.footnotes.push(footnote);
        // console.log(footnote);
      });
      // console.log(letter);
      // Check if the letter has a manuscript
      if (letter.hasOwnProperty('manuscript')) {
        this.hasManuscript = true;
        for (let i = 0; i < letter.manuscript.length; i++) {
          this.manuscriptUrl[i] = `assets/manuscripts/${letter.xml_id}/${letter.manuscript[i]}`;
        }
        console.log(this.manuscriptUrl);
      } else {
        this.hasManuscript = false;
      }
    });
  }

  goToFront(clicked: boolean) {
    this.sourceNote = null;
    this.footnotes = [];
    // Set next and previous letter ids to null
    this.prevLetterId = null;
    this.nextLetterId = null;
    // Update the url to show we are at the frontice piece of the volume
    if (clicked) {
      this.router.navigateByUrl('/volume/' + this.volumeId + '/frontice_piece');
      this.isFrontice = true;
      this.viewContent = this.createFronticePiece(this.volume['frontice_piece']);
    }
  }

  private setVolumeId(volId: string, nextOrPrev: string) {
    if (nextOrPrev.toLowerCase() === 'prev') {
      if (parseInt(volId, 10) <= 1) {
        return null;
      } else {
        if (parseInt(volId, 10) <= 10) {
          return '0' + (parseInt(volId, 10) - 1);
        } else {
          return (parseInt(volId, 10) - 1).toString();
        }
      }
    } else if (nextOrPrev.toLowerCase() === 'next') {
      if (parseInt(volId, 10) >= this.TOTAL_VOLUMES) {
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

  private setKeys() {
    for (const k in this.volume) {
      if (this.volume.hasOwnProperty(k)) {
        switch (k) {
          case '_id':
            break;
          case 'volume_dates':
            break;
          // The frontice piece and letters are objects that will be handled separately
          case 'frontice_piece':
            break;
          case 'letters':
            break;
          case 'letters_to_carlyles':
            this.volumeKeys.push({
              key: k,
              title: 'Letters to the Carlyles'
            });
            break;
          case 'key_to_references':
            this.volumeKeys.push({
              key: k,
              title: 'Key to References'
            });
            break;
          case 'rival_brothers':
            this.volumeKeys.push({
              key: k,
              title: 'The Rival Brothers: Fragment of a Play by Jane Baillie Welsh'
            });
            break;
          case 'biographicalNotes':
            this.volumeKeys.push({
              key: k,
              title: 'Biographical Notes'
            });
            break;
          case 'inMemoriam':
            this.volumeKeys.push({
              key: k,
              title: 'In Memoriam'
            });
            break;
          case 'JWCbyTait':
            this.volumeKeys.push({
              key: k,
              title: 'JWC by Robert Scott Tait'
            });
            break;
          case 'janeNotebook':
            this.volumeKeys.push({
              key: k,
              title: 'Jane Carlyle Notebook'
            });
            break;
          case 'simpleStory':
            this.volumeKeys.push({
              key: k,
              title: 'Simple Story of My Own First Love'
            });
            break;
          case 'janeJournal':
            this.volumeKeys.push({
              key: k,
              title: 'Jane Welsh Carlyle Journal'
            });
            break;
          case 'geraldineJewsbury':
            this.volumeKeys.push({
              key: k,
              title: 'Geraldine Jewsbury to Froude'
            });
            break;
          case 'ellenTwisleton':
            this.volumeKeys.push({
              key: k,
              title: 'Ellen Twisleton Account of Life at Craigenputtoch'
            });
            break;
          case 'auroraComments':
            this.volumeKeys.push({
              key: k,
              title: 'Comments on Aurora Leigh'
            });
            break;
          case 'athanaeumAdvertisements':
            this.volumeKeys.push({
              key: k,
              title: 'Athanaeum Advertisements'
            });
            break;
          case 'accounts':
            if (this.volume['accounts'].length > 0) {
              this.volumeKeys.push({
                key: k,
                title: 'Account\'s of JWC\'s Death'
              });
            }
            break;
          case 'introduction':
            if (this.volume['introduction'].introText !== '') {
              this.volumeKeys.push({
                key: k,
                title: k
              });
            }
            break;
          default:
            this.volumeKeys.push({
              key: k,
              title: k
            });
            break;
        }
      }
    }
  }
}
