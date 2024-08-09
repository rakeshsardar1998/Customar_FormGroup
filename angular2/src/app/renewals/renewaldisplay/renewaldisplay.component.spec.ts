import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RenewaldisplayComponent } from './renewaldisplay.component';

describe('RenewaldisplayComponent', () => {
  let component: RenewaldisplayComponent;
  let fixture: ComponentFixture<RenewaldisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewaldisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewaldisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
