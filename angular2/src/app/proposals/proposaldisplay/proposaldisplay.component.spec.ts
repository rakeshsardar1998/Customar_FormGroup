import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposaldisplayComponent } from './proposaldisplay.component';

describe('ProposaldisplayComponent', () => {
  let component: ProposaldisplayComponent;
  let fixture: ComponentFixture<ProposaldisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposaldisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposaldisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
