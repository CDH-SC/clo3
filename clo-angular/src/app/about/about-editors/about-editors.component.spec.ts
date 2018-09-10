import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutEditorsComponent } from './about-editors.component';

describe('AboutEditorsComponent', () => {
  let component: AboutEditorsComponent;
  let fixture: ComponentFixture<AboutEditorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutEditorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEditorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
