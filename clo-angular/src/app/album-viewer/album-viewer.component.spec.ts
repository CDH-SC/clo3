import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumViewerComponent } from './album-viewer.component';

describe('AlbumViewerComponent', () => {
  let component: AlbumViewerComponent;
  let fixture: ComponentFixture<AlbumViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
