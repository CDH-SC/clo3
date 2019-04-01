import { Component, Input, OnInit, AfterViewInit, OnChanges, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-volume-viewer',
  templateUrl: './volume-viewer.component.html',
  styleUrls: ['./volume-viewer.component.css']
})
export class VolumeViewerComponent implements AfterViewChecked {
  @Input() viewContent;
  @Input() isFrontice;
  @Input() sourceNote;
  @Input() footnotes;

  footnoteReferences: any;

  constructor() {}

  ngAfterViewChecked() {
    const container = document.querySelector('.viewerContainer');
    try {
      this.footnoteReferences = container.querySelectorAll('[id$=REF]');
      this.footnoteReferences.forEach(footnote => {
        footnote.onclick = this.scrollToFootnotes;
      });
    } catch {}
  }

  scrollToFootnotes() {
    const footnotesContent = document.getElementById('footnotesContent');
    footnotesContent.classList.add('show');
    document.getElementById('footnotesCollapse').scrollIntoView({behavior: 'smooth', block: 'center'});
  }

}
