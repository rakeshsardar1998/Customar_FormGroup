import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProposalFormComponent } from './proposal-form/proposal-form.component';


const routes: Routes = [
  { path: '', component: ProposalFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }
