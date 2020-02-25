import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subject-letters',
  templateUrl: './subject-letters.component.html',
  styleUrls: ['./subject-letters.component.css']
})
export class SubjectLettersComponent implements OnInit {

  @Input() subjectTerm: any;

  constructor() { }

  ngOnInit() {
  }

}
