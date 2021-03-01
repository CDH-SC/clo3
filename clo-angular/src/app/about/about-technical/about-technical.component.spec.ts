import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTechnicalComponent } from './about-technical.component';

describe('AboutTechnicalComponent', () => {
  let component: AboutTechnicalComponent;
  let fixture: ComponentFixture<AboutTechnicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutTechnicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutTechnicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
