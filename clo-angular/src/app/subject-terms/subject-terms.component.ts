import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { SubjectTerm } from '../_shared/models/subject-term';
import { SubjectTermService } from '../_shared/_services/subject-terms.service';

@Component({
  selector: 'app-subject-terms',
  templateUrl: './subject-terms.component.html',
  styleUrls: ['./subject-terms.component.css']
})
export class SubjectTermsComponent implements OnInit {

  subjectTerm = [SubjectTerm];
  volNum: string;

  constructor(
    private subjectTermService: SubjectTermService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit() {
    this.subjectTermService.getSubjectTerms<SubjectTerm[]>().subscribe(data => {
      this.subjectTerm = data['data'];
      console.log(this.subjectTerm)
    })
  }

  private letterLink(xml_id) {
    this.subjectTermService.getLetterVolByXML(xml_id).subscribe(data => {
      this.volNum = data['data'][0]['_id'];
      console.log(this.volNum);
      this.document.location.href = `/volume/${this.volNum}/${xml_id}`
    });
  }

}
