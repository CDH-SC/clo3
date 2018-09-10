import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutCarlylesComponent } from './about-carlyles.component';

describe('AboutCarlylesComponent', () => {
  let component: AboutCarlylesComponent;
  let fixture: ComponentFixture<AboutCarlylesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutCarlylesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCarlylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
