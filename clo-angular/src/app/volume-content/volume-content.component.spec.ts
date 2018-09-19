import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeContentComponent } from './volume-content.component';

describe('VolumeContentComponent', () => {
  let component: VolumeContentComponent;
  let fixture: ComponentFixture<VolumeContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
