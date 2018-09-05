import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseVolumeComponent } from './browse-volume.component';

describe('BrowseVolumeComponent', () => {
  let component: BrowseVolumeComponent;
  let fixture: ComponentFixture<BrowseVolumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseVolumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
