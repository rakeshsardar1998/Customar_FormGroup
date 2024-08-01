import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { ProposalComponent } from './proposal/proposal.component';
import { ApiService } from '../services/api.service';
import { ProposalFormComponent } from './proposal-form/proposal-form.component';


const routes: Routes = [
  {
    path: '', component: ProposalComponent,
    resolve: {
      movie: ApiService
    }
  },
  {path:'proposal-form',component:ProposalFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProposalRoutingModule { }
