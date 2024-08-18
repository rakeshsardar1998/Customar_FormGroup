import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurersPlanComponent } from './insurers-plan.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { StoreModule } from '@ngrx/store';

describe('InsurersPlanComponent', () => {
  let component: InsurersPlanComponent;
  let fixture: ComponentFixture<InsurersPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // StoreModule.forRoot({})
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
      ],
      declarations: [InsurersPlanComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InsurersPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
