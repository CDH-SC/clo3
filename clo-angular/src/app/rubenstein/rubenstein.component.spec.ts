import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RubensteinComponent } from './rubenstein.component';

describe('RubensteinComponent', () => {
  let component: RubensteinComponent;
  let fixture: ComponentFixture<RubensteinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RubensteinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubensteinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
