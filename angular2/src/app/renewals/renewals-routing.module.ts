import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RenewaldisplayComponent } from './renewaldisplay/renewaldisplay.component';

const routes: Routes = [
  { path: '', component: RenewaldisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RenewalsRoutingModule { }
