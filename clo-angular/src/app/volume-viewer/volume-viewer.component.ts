import { Component, Input, OnInit, AfterViewInit, OnChanges, AfterViewChecked, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-volume-viewer',
  templateUrl: './volume-viewer.component.html',
  styleUrls: ['./volume-viewer.component.css']
})
export class VolumeViewerComponent implements AfterViewChecked {
  @Input() viewContent;
  @Input() volId;
  @Input() prevLetter;
  @Input() nextLetter;
  @Input() isFrontice;
  @Input() sourceNote;
  @Input() footnotes;

  @Output() letterCycle = new EventEmitter<string>();

  prevLetterUrl: string;
  nextLetterUrl: string;

  footnoteReferences: any;

  constructor(private router: Router) {}

  ngAfterViewChecked() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      if (document.getElementById('volumeViewer')) {
          document.getElementById('volumeViewer').scrollTop = 0;
      }
      // scrolls to footnote in letter
      if (evt instanceof NavigationEnd) {
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) { element.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        }
      }
    });
    const container = document.querySelector('.viewerContainer');
    try {
      this.footnoteReferences = container.querySelectorAll('[id$=REF]');
      for (let i = 0; i < this.footnoteReferences.length; i++) {
        this.footnoteReferences[i].onclick = () => {
          const footnote = document.getElementById('FN' + (i + 1));
          const footnotesContent = document.getElementById('footnotesContent');
          footnotesContent.classList.add('show');
          footnote.scrollIntoView({behavior: 'smooth', block: 'center'});
        };
      }
    } catch {}
    this.prevLetterUrl = '/volume/' + this.volId + '/' + this.prevLetter;
    this.nextLetterUrl = '/volume/' + this.volId + '/' + this.nextLetter;
  }

  letterCycled(id: string) {
    this.letterCycle.emit(id);
  }

}
