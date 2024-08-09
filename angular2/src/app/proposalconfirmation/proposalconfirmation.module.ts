import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalconfirmationRoutingModule } from './proposalconfirmation-routing.module';
import { ProposalconfirmationdisplayComponent } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { AmountConfirmDialog } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { BreakinConfirmDialog } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { BreakinProceedConfirmDialog } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { IIBConfirmDialog } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { MAGMAConfirmDialog } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { MAGMAekycDialog } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { MAGMAekycDialogotp } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// DONE BY RUTH //
import {MatChipsModule} from '@angular/material/chips';
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
} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ShareModule } from '../share/share.module';
import { CommonDialogComponent } from '../share/common-dialog/common-dialog.component';

@NgModule({
  declarations: [ProposalconfirmationdisplayComponent,AmountConfirmDialog,BreakinConfirmDialog,BreakinProceedConfirmDialog,IIBConfirmDialog,MAGMAConfirmDialog,MAGMAekycDialog,MAGMAekycDialogotp],
  imports: [
    ShareModule,
    CommonModule,
    ProposalconfirmationRoutingModule,
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
    MatTooltipModule,
    MatExpansionModule,
    MatSnackBarModule,
	MatChipsModule,
    MatAutocompleteModule
  ],
  exports:[MatNativeDateModule,MatRippleModule],
  entryComponents : [AmountConfirmDialog,BreakinConfirmDialog,BreakinProceedConfirmDialog,IIBConfirmDialog,MAGMAConfirmDialog,MAGMAekycDialog,MAGMAekycDialogotp,CommonDialogComponent]
})
export class ProposalconfirmationModule { }
