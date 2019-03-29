import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-volume-viewer',
  templateUrl: './volume-viewer.component.html',
  styleUrls: ['./volume-viewer.component.css']
})
export class VolumeViewerComponent {
  @Input() viewContent;
  @Input() isFrontice;
  @Input() sourceNote;
  @Input() footnotes;

  footnoteReferences: any;

  constructor() {}

}
