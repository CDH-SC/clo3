import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeTocComponent } from './volume-toc.component';

describe('VolumeTocComponent', () => {
  let component: VolumeTocComponent;
  let fixture: ComponentFixture<VolumeTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumeTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumeTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
