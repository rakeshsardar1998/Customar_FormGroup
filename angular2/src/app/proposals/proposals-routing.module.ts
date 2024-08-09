import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProposaldisplayComponent } from './proposaldisplay/proposaldisplay.component';

const routes: Routes = [
  { path: '', component: ProposaldisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalsRoutingModule { }
