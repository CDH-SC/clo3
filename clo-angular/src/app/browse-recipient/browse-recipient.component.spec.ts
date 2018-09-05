import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseRecipientComponent } from './browse-recipient.component';

describe('BrowseRecipientComponent', () => {
  let component: BrowseRecipientComponent;
  let fixture: ComponentFixture<BrowseRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
