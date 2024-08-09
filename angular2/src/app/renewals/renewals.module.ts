import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RenewalsRoutingModule } from './renewals-routing.module';
import { RenewaldisplayComponent } from './renewaldisplay/renewaldisplay.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatMenuModule,
   MatButtonModule,
   MatIconModule, 
   MatSidenavModule,
   MatCheckboxModule, 
   MatRadioModule, 
   MatFormFieldModule,
   MatOptionModule, 
   MatStepperModule, 
   MatToolbarModule, 
   MatListModule,} from '@angular/material';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ShareModule } from '../share/share.module';

@NgModule({
  declarations: [RenewaldisplayComponent],
  imports: [
    ShareModule,
    CommonModule,
    RenewalsRoutingModule,
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
    MatStepperModule, 
    MatToolbarModule, 
    MatListModule,
    NgxMatSelectSearchModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  exports:[MatNativeDateModule,MatRippleModule],
})
export class RenewalsModule { }
