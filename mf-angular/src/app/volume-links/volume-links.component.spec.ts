import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeLinksComponent } from './volume-links.component';

describe('VolumeLinksComponent', () => {
  let component: VolumeLinksComponent;
  let fixture: ComponentFixture<VolumeLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
