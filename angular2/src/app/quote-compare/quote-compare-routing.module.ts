import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuoteListComponent} from './quote-list/quote-list.component';

const routes: Routes = [
  { path: '', component: QuoteListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuoteCompareRoutingModule { }
