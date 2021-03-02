import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSupportersComponent } from './about-supporters.component';

describe('AboutSupportersComponent', () => {
  let component: AboutSupportersComponent;
  let fixture: ComponentFixture<AboutSupportersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSupportersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSupportersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
