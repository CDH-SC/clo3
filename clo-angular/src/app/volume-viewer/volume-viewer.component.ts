import { Component, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-volume-viewer',
  templateUrl: './volume-viewer.component.html',
  styleUrls: ['./volume-viewer.component.css']
})
export class VolumeViewerComponent implements OnChanges {
  @Input() viewContent;
  @Input() isFrontice;
  @Input() sourceNote;
  @Input() footnotes;

  footnoteReferences: any;

  constructor() { }

  ngOnChanges() {
    this.footnoteReferences = document.querySelectorAll('[id^=FN]');
    this.footnoteReferences.forEach(footnote => {
      footnote.onclick = null; // removing previous onclick event
    });
  }

}
