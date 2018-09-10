import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutAckComponent } from './about-ack.component';

describe('AboutAckComponent', () => {
  let component: AboutAckComponent;
  let fixture: ComponentFixture<AboutAckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutAckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
