import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { InsurersPlanComponent } from './insurers-plan.component';
// import { FeaturesModule } from 'src/app/modules/health-insurance/dialogs/features/features.module';
import { ReactiveFormsModule } from '@angular/forms'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    InsurersPlanComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    // FeaturesModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  exports: [
    InsurersPlanComponent
  ]
})
export class InsurersPlanModule { }
