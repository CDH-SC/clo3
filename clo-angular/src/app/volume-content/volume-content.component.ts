import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';

import { Volume } from '../_shared/models/volume';
import { VolumeService } from '../_shared/_services/volumes.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FooterService } from '../_shared/_services/footer.service';

@Component({
  selector: 'app-volume-content',
  templateUrl: './volume-content.component.html',
  styleUrls: ['./volume-content.component.css']
})
export class VolumeContentComponent implements OnInit {
  volume: [Volume];
  volumeId: string;

  objectKeys = Object.keys;
  tocKeys: Object[] = [];
  prevId: string = null;
  nextId: string = null;

  viewContent: SafeHtml;
  fronticePiece: Object;
  letters: any;

  hasManuscript = false;
  manuscriptUrl: Object[] = [];

  constructor(
    private volumeService: VolumeService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    document.getElementById('footer').style.position = 'relative';

    const id = this.route.snapshot.paramMap.get('id');
    this.volumeId = id;

    this.volumeService.getVolumeById<Volume[]>(id).subscribe(data => {
      this.volume = data['data'];
      this.setKeys();
      // Setting next and previous volume ids for navigation between volumes
      this.prevId = this.setVolumeId(this.volumeId, 'prev');
      this.nextId = this.setVolumeId(this.volumeId, 'next');
      // Get frontice piece object
      this.fronticePiece = this.volume['frontice_piece'];
      // Get letters object
      this.letters = this.sortLetters(this.volume['letters']);
    });
  }

  setKeys() {
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
            this.tocKeys.push({
              key: k,
              title: 'Letters to the Carlyles'
            });
            break;
          case 'key_to_references':
            this.tocKeys.push({
              key: k,
              title: 'Key to References'
            });
            break;
          case 'rival_brothers':
            this.tocKeys.push({
              key: k,
              title: 'The Rival Brothers: Fragment of a Play by Jane Baillie Welsh'
            });
            break;
          case 'biographicalNote':
            this.tocKeys.push({
              key: k,
              title: 'Biographical Notes'
            });
            break;
          case 'inMemoriam':
            this.tocKeys.push({
              key: k,
              title: 'In Memoriam'
            });
            break;
          case 'JWCbyTait':
            this.tocKeys.push({
              key: k,
              title: 'JWC by Robert Scott Tait'
            });
            break;
          case 'janeNotebook':
            this.tocKeys.push({
              key: k,
              title: 'Jane Carlyle Notebook'
            });
            break;
          case 'simpleStory':
            this.tocKeys.push({
              key: k,
              title: 'Simple Story of My Own First Love'
            });
            break;
          case 'janeJournal':
            this.tocKeys.push({
              key: k,
              title: 'Jane Welsh Carlyle Journal'
            });
            break;
          case 'geraldineJewsbury':
            this.tocKeys.push({
              key: k,
              title: 'Geraldine Jewsbury to Froude'
            });
            break;
          case 'ellenTwisleton':
            this.tocKeys.push({
              key: k,
              title: 'Ellen Twisleton Account of Life at Craigenputtoch'
            });
            break;
          case 'auroraComments':
            this.tocKeys.push({
              key: k,
              title: 'Comments on Aurora Leigh'
            });
            break;
          case 'athanaeumAdvertisements':
            this.tocKeys.push({
              key: k,
              title: 'Athanaeum Advertisements'
            });
            break;
          case 'accounts':
            if (this.volume['accounts'].length > 0) {
              this.tocKeys.push({
                key: k,
                title: 'Account\'s of JWC\'s Death'
              });
            }
            break;
          default:
            this.tocKeys.push({
              key: k,
              title: k
            });
            break;
        }
      }
    }
  }

  setVolumeId(volId: string, nextOrPrev: string) {
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

  setPage(key: string) {
    this.fronticePiece = null;
    if (key === 'introduction') {
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(this.volume[key].introText);
    } else {
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(this.volume[key]);
    }
  }

  goToVolume(volId: string) {
    this.fronticePiece = null;
    this.viewContent = null;
    this.volumeId = volId;
    this.tocKeys = [];
    this.volumeService.getVolumeById<Volume[]>(volId).subscribe(data => {
      this.volume = data['data'];
      this.setKeys();
      // Setting next and previous volume ids for navigation between volumes
      this.prevId = this.setVolumeId(this.volumeId, 'prev');
      this.nextId = this.setVolumeId(this.volumeId, 'next');
      // Get frontice piece object
      this.fronticePiece = this.volume['frontice_piece'];
      // Get letters object
      this.letters = this.volume['letters'];
    });
  }

  getLetter(xml_id: string) {
    this.fronticePiece = null;
    this.viewContent = null;
    this.volumeService.getLetterById(this.volumeId, xml_id).subscribe(data => {
      const letter = data['data']['letters'][0];
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(letter.docBody);
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

  goToFront() {
    this.fronticePiece = this.volume['frontice_piece'];
    this.viewContent = null;
  }

  /**
   * This function will parse through the letters attribute "docDate" and sort
   * first by year and then by month.
   * It will then return a list of months and years with the certain letters
   * contained in those months and dates.
   * @param letters
   */
  sortLetters(letters) {
    letters.sort((a, b) => {
      const x = a.docDate;
      const y = b.docDate;
      return parseInt(x.substring(x.lastIndexOf(' ')), 10) - parseInt(y.substring(y.lastIndexOf(' ')), 10);
    });

    let date = '';
    let year = '';
    let month = '';
    const reformattedLetters = {};
    for (let i = 0; i < letters.length; i++) {
      date = letters[i].docDate;
      year = date.substring(date.lastIndexOf(' ')).trim();
      month = date.substring(
        (date.indexOf(' ') > 2) ? 0 : date.indexOf(' '),
        date.lastIndexOf(' ')
      ).trim();
      if (reformattedLetters[month + ' ' + year] == null) {
        reformattedLetters[month + ' ' + year] = [];
        reformattedLetters[month + ' ' + year].push(letters[i]);
      } else {
        reformattedLetters[month + ' ' + year].push(letters[i]);
      }
    }
    console.log(reformattedLetters);
    return reformattedLetters;
  }
}
