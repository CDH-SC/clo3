import { Component, Input, Output, OnChanges } from '@angular/core';

@Component({
  selector: 'app-volume-viewer',
  templateUrl: './volume-viewer.component.html',
  styleUrls: ['./volume-viewer.component.css']
})
export class VolumeViewerComponent implements OnChanges {
  @Input() viewContent;
  @Input() sourceNote;
  @Input() footnotes;

  footnoteReferences: any;

  constructor() { }

  ngOnChanges() {
    this.footnoteReferences = document.querySelectorAll('[id^=FN]');
    this.footnoteReferences.forEach(footnote => {
      footnote.onclick = null; // removing previous onclick event
    });

    console.log(this.viewContent);
    console.log(this.sourceNote);
    console.log(this.footnotes);
  }

}
