import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeViewerComponent } from './volume-viewer.component';

describe('VolumeViewerComponent', () => {
  let component: VolumeViewerComponent;
  let fixture: ComponentFixture<VolumeViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
