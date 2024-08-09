import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UppercaseDirective } from './uppercase.directive';
import { CommaSeperatorPipe } from './comman-seperator';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { MatButtonModule, MatDialogModule, MatRadioModule } from '@angular/material';


@NgModule({
  declarations: [UppercaseDirective,CommaSeperatorPipe, CommonDialogComponent],
  imports: [ CommonModule,MatRadioModule,MatDialogModule,MatButtonModule],
  exports: [UppercaseDirective,CommaSeperatorPipe]
})
export class ShareModule { }
