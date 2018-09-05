import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSubjectComponent } from './browse-subject.component';

describe('BrowseSubjectComponent', () => {
  let component: BrowseSubjectComponent;
  let fixture: ComponentFixture<BrowseSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
