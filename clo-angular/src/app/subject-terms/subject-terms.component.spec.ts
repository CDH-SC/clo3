import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectTermsComponent } from './subject-terms.component';

describe('SubjectTermsComponent', () => {
  let component: SubjectTermsComponent;
  let fixture: ComponentFixture<SubjectTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
