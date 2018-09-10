import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPrintedComponent } from './about-printed.component';

describe('AboutPrintedComponent', () => {
  let component: AboutPrintedComponent;
  let fixture: ComponentFixture<AboutPrintedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutPrintedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPrintedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
