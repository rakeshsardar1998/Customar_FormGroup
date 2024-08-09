import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProposalconfirmationdisplayComponent } from '../proposalconfirmation/proposalconfirmationdisplay/proposalconfirmationdisplay.component';

const routes: Routes = [
  { path: '', component: ProposalconfirmationdisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class ProposalconfirmationRoutingModule { }
