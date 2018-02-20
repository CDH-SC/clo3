import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByDateComponent } from './browse-by-date.component';

describe('BrowseByDateComponent', () => {
  let component: BrowseByDateComponent;
  let fixture: ComponentFixture<BrowseByDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseByDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
