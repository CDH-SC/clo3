import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseByHandComponent } from './browse-by-hand.component';

describe('BrowseByHandComponent', () => {
  let component: BrowseByHandComponent;
  let fixture: ComponentFixture<BrowseByHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseByHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseByHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
