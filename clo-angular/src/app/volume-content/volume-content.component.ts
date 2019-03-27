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
  volume: [Volume];
  volumeId: string;
  volumeDates: string;
  currentKey: string;

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
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // Getting data information from url
    const id = this.route.snapshot.paramMap.get('id'); // volume Id
    this.currentKey = this.route.snapshot.paramMap.get('content'); // page content section
    this.volumeId = id;
    // Setting the page content to null
    this.viewContent = null;
    this.fronticePiece = null;
    // Fetching volume data
    this.volumeService.getVolumeById<Volume[]>(id).subscribe(data => {
      this.volume = data['data'];
      this.volumeDates = this.volume['volume_dates'];
      // Set the keys for the current volume
      this.setKeys();
      // Setting next and previous volume ids for navigation between volumes
      this.prevId = this.setVolumeId(this.volumeId, 'prev');
      this.nextId = this.setVolumeId(this.volumeId, 'next');
      // Set the frontice piece object if the page content section is
      // 'frontice_piece'
      if (this.currentKey === 'frontice_piece') {
        this.fronticePiece = this.volume['frontice_piece'];
      }
      // Set the page to the current content section if it is contained
      // within the keys for the volume
      this.tocKeys.forEach((object) => {
        if (object['key'] === this.currentKey) {
          this.setPage(this.currentKey);
        }
      });
      // If content is still null after the above checks, we must have a letter
      // xml id, so we should get that letter
      if (this.fronticePiece === null && this.viewContent === null) {
        this.getLetter(this.currentKey);
      }
      // Get letters object
      this.letters = this.sortLetters(this.volume['letters']);
    });
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
    // Update url to reflect current section
    this.router.navigateByUrl('/volume/' + this.volumeId + '/' + key);
    this.fronticePiece = null;
    if (key === 'introduction') {
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(this.volume[key].introText);
    } else {
      this.viewContent = this.sanitizer.bypassSecurityTrustHtml(this.volume[key]);
    }
  }

  goToVolume(volId: string) {
    // Update url to reflect we are at the frontice piece of the volume
    this.router.navigateByUrl('/volume/' + volId + '/frontice_piece');
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
      this.letters = this.sortLetters(this.volume['letters']);
    });
  }

  getLetter(xml_id: string) {
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

  goToFront(clicked: boolean) {
    // Update the url to show we are at the frontice piece of the volume
    if (clicked) {
      this.router.navigateByUrl('/volume/' + this.volumeId + '/frontice_piece');
      this.fronticePiece = this.volume['frontice_piece'];
      this.viewContent = null;
    }
  }

  /**
   * This function will parse through the letters attribute "docDate" and sort
   * first by year and then by month.
   * It will then return a list of months and years with the certain letters
   * contained in those months and dates.
   * @param letters
   */
  sortLetters(letters) {
    // Sort by month
    letters.sort((a, b) => {
      const x = a.docDate;
      const y = b.docDate;
      return parseInt(y.substring(y.indexOf('-'), y.lastIndexOf('-')), 10) - parseInt(x.substring(x.indexOf('-'), x.lastIndexOf('-')), 10);
    });

    // Sort by year
    letters.sort((a, b) => {
      const x = a.docDate;
      const y = b.docDate;
      return parseInt(x.substring(0, x.indexOf('-')), 10) - parseInt(y.substring(0, y.indexOf('-')), 10);
    });

    let year = '';
    let month = '';
    let dateString = '';

    const reformattedLetters = {};
    for (let i = 0; i < letters.length; i++) {
      const date = letters[i].docDate.split('-');

      year = date[0];
      month = this.getMonth(date[1]);
      // Creating and setting our own unique dateString to the docDate of the current letter
      dateString = date[2] + ' ' + month + ' ' + year;
      letters[i].docDate = dateString;

      if (reformattedLetters[month + ' ' + year] == null) {
        reformattedLetters[month + ' ' + year] = [];
        reformattedLetters[month + ' ' + year].push(letters[i]);
      } else {
        reformattedLetters[month + ' ' + year].push(letters[i]);
      }
    }

    const keys = Object.keys(reformattedLetters);
    for (let i = 0; i < keys.length; i++) {
      // Sort by day
      reformattedLetters[keys[i]].sort((a, b) => {
        const x = a.docDate;
        const y = b.docDate;
        return parseInt(x.substring(0, x.indexOf(' ')), 10) - parseInt(y.substring(0, y.indexOf(' ')), 10);
      });
    }

    return reformattedLetters;
  }

  /**
   * HELPER Method for sortLetters()
   * This method returns the month as a string value
   *
   * Ex: 01 --> January
   * INPUT: Month as string (01-12)
   * OUTPUT: Month as string
   */
  getMonth(month: string) {
    switch (month) {
      case '01':
        return 'January';
      case '02':
        return 'February';
      case '03':
        return 'March';
      case '04':
        return 'April';
      case '05':
        return 'May';
      case '06':
        return 'June';
      case '07':
        return 'July';
      case '08':
        return 'August';
      case '09':
        return 'September';
      case '10':
        return 'October';
      case '11':
        return 'November';
      case '12':
        return 'December';
      default:
        return 'Unknown';
    }
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
          case 'introduction':
            if (this.volume['introduction'].introText !== '') {
              this.tocKeys.push({
                key: k,
                title: k
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
}
