import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectLettersComponent } from './subject-letters.component';

describe('SubjectLettersComponent', () => {
  let component: SubjectLettersComponent;
  let fixture: ComponentFixture<SubjectLettersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectLettersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectLettersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
