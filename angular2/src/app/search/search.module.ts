import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchVehicleComponent } from './search-vehicle/search-vehicle.component';
import { SearchRoutingModule } from './search-routing.module';
import {
  MatMenuModule,
  MatButtonModule,
  MatIconModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatRadioModule,
  MatFormFieldModule,
  MatOptionModule,
  MatStepperModule,
  MatToolbarModule,
  MatListModule,
  MatSelectModule,
  MatInputModule,
  MatCardModule,
  MatGridListModule,
  MatTabsModule,
  MatDialogModule,
  MatDatepickerModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatProgressBarModule,
  MatExpansionModule,
  MatSnackBarModule,
  MatChipsModule,
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [SearchVehicleComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,

    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatDatepickerModule,

    MatSidenavModule,
    MatStepperModule,
    MatGridListModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    MatTabsModule,
    MatDialogModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatSidenavModule,
    MatSnackBarModule,
	  MatChipsModule,

    FlexLayoutModule,

    NgxMatSelectSearchModule,
    NgSelectModule,

    FormsModule,
    ReactiveFormsModule
  ]
})
export class SearchModule { }
