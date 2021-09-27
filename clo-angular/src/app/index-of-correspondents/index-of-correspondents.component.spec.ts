import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexOfCorrespondentsComponent } from './index-of-correspondents.component';

describe('IndexOfCorrespondentsComponent', () => {
  let component: IndexOfCorrespondentsComponent;
  let fixture: ComponentFixture<IndexOfCorrespondentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexOfCorrespondentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexOfCorrespondentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
