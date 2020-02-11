import { Component, OnInit } from '@angular/core';

import { SubjectTerm } from '../_shared/models/subject-term';
import { SubjectTermService } from '../_shared/_services/subject-terms.service';

@Component({
  selector: 'app-subject-terms',
  templateUrl: './subject-terms.component.html',
  styleUrls: ['./subject-terms.component.css']
})
export class SubjectTermsComponent implements OnInit {

  subjectTerm = [SubjectTerm];

  constructor(
    private subjectTermService: SubjectTermService,
  ) { }

  ngOnInit() {
    this.subjectTermService.getSubjectTerms<SubjectTerm[]>().subscribe(data => {
      console.log(data['data']);
    })
  }

}
