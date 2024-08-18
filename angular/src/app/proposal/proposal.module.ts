import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProposalRoutingModule } from './proposal-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule, MatButtonModule, MatIconModule, MatSidenavModule, MatCheckboxModule, MatRadioModule, MatOptionModule, MatInputModule, MatToolbarModule, MatListModule, MatAutocompleteModule, MatTooltipModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatStepperModule } from '@angular/material/stepper';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { ProposalFormComponent } from './proposal-form/proposal-form.component'; 
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    ProposalFormComponent
  ],
  imports: [
    CommonModule,
    ProposalRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatToolbarModule,
    MatListModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatExpansionModule,
    MatSliderModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule,
    MatTooltipModule,
    MatStepperModule,
    CdkStepperModule,
    MatCardModule]
})
export class ProposalModule { }
