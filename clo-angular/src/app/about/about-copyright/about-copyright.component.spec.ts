import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCopyrightComponent } from './about-copyright.component';

describe('AboutCopyrightComponent', () => {
  let component: AboutCopyrightComponent;
  let fixture: ComponentFixture<AboutCopyrightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutCopyrightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCopyrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
