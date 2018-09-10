import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCitingComponent } from './about-citing.component';

describe('AboutCitingComponent', () => {
  let component: AboutCitingComponent;
  let fixture: ComponentFixture<AboutCitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutCitingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
