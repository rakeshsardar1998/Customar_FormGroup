import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuoteCompareRoutingModule } from './quote-compare-routing.module';
import { QuoteListComponent, DialogOverviewExampleDialog} from './quote-list/quote-list.component';

import { MatSelectModule } from '@angular/material/select';
import {HttpClientModule} from '@angular/common/http';
import {MatMenuModule, MatButtonModule, MatIconModule, MatSidenavModule,MatCheckboxModule, MatRadioModule, MatFormFieldModule,MatOptionModule,  MatInputModule, MatStepperModule, MatToolbarModule, MatListModule,} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatSliderModule} from '@angular/material/slider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ShareModule } from '../share/share.module';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatTableModule} from '@angular/material/table';
import { LoaderModule } from '../loader/loader.module';

@NgModule({
  declarations: [QuoteListComponent,DialogOverviewExampleDialog],
  imports: [
    LoaderModule,
    CommonModule,
    QuoteCompareRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatRadioModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatListModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatDialogModule,MatDatepickerModule,
    MatChipsModule,
    MatSliderModule,
    MatBadgeModule,
    MatTooltipModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatTableModule
  ],
  exports:[MatNativeDateModule,MatRippleModule],
  entryComponents: [DialogOverviewExampleDialog]
})
export class QuoteCompareModule { }
