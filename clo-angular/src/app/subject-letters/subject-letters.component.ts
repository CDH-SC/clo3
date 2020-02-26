import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { SubjectTermService } from '../_shared/_services/subject-terms.service';

import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subject-letters',
  templateUrl: './subject-letters.component.html',
  styleUrls: ['./subject-letters.component.css']
})
export class SubjectLettersComponent implements OnInit {

  subjectTerm: any;
  subjectSearch: string;
  volNum: number;
  letters = [];
  viewContent: SafeHtml;

  page = 1;
  pageSize = 10;

  start = 1;
  end = 10;

  faPlusSquare = faPlusSquare;

  constructor(
    private subjectTermService: SubjectTermService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.subjectSearch = this.route.snapshot.paramMap.get('subjectSearch');

    this.subjectTermService.getSingleSubjectTerm(this.subjectSearch).subscribe(data => {
      this.subjectTerm = data['data'][0];
      this.getLetters(this.subjectTerm);
    });
  }

  getLetters(subjectTerm) {
    subjectTerm.xml_ids.forEach(xml_id => {
      this.subjectTermService.getLetter(xml_id).subscribe(data => {
        const letter = data['data'][0]['letters'][0];
        const volNum = data['data'][0]['_id'];
        this.letters.push({_id: volNum, letters: letter});
      });
    });
  }

  setPage(page: number) {
    this.page = page;
    this.end = this.page * this.pageSize;
    this.start = this.end - (this.pageSize - 1);
  }

  safeHTML(content: string) {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
