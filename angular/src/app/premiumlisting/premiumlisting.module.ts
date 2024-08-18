import { CommonModule } from "@angular/common";
import { NgModule } from '@angular/core';
import { PremiumlistingRoutingModule } from './premiumlisting-routing.module';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenuModule, MatButtonModule, MatIconModule, MatSidenavModule,MatCheckboxModule, MatRadioModule, MatOptionModule,  MatInputModule,  MatToolbarModule, MatListModule, MatAutocompleteModule, MatTooltipModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSliderModule} from '@angular/material/slider';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatBadgeModule} from '@angular/material/badge';
import { ListingComponent} from './component/listing.component';
import { InsurersPlanModule } from "../common/insurers-plan/insurers-plan.module";
import { LoaderModule } from "../common/loader/loader.module";

@NgModule({
  declarations: [
    ListingComponent
  ],
  imports: [
    CommonModule,
    PremiumlistingRoutingModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatRadioModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatStepperModule,
    MatToolbarModule,
    MatListModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatChipsModule,
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
    InsurersPlanModule,
    LoaderModule
  ]
})
export class PremiumlistingModule { }
