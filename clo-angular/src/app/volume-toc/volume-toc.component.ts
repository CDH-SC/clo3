import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-volume-toc',
  templateUrl: './volume-toc.component.html',
  styleUrls: ['./volume-toc.component.css']
})
export class VolumeTocComponent {
  objectKeys = Object.keys;

  @Input() volId: string;
  @Input() prevId: string;
  @Input() nextId: string;
  @Input() volumeDates: string;
  @Input() keys: any;
  @Input() letters: any;

  @Output() fronticeClicked = new EventEmitter<boolean>();
  @Output() idChanged = new EventEmitter<string>();
  @Output() contentChanged = new EventEmitter<string>();
  @Output() letterChanged = new EventEmitter<string>();

  frontice(clicked: boolean) {
    this.fronticeClicked.emit(clicked);
  }

  prev(id: string) {
    this.idChanged.emit(id);
  }

  next(id: string) {
    this.idChanged.emit(id);
  }

  sectionClicked(key: string) {
    this.contentChanged.emit(key);
  }

  letterClicked(id: string) {
    this.letterChanged.emit(id);
  }

}
