import { Component, Input, OnInit, AfterViewInit, OnChanges, AfterViewChecked, Output, EventEmitter } from '@angular/core';

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

  @Output() letterChanged = new EventEmitter<string>();

  prevLetterUrl: string;
  nextLetterUrl: string;

  footnoteReferences: any;

  constructor() {}

  ngAfterViewChecked() {
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

  letterClicked(id: string) {
    this.letterChanged.emit(id);
  }

}
