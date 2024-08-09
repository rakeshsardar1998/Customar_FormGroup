import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPageCanActivateGuard } from './guards/search-page-can-activate.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuoteComponent } from './quote/quote/quote.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./search/search.module').then(m => m.SearchModule) },
  { path: 'search', component: QuoteComponent },
  { path: 'new', component: QuoteComponent, data: { policyType: 'new' } },
  { path: 'quote-compare', loadChildren: () => import('./quote-compare/quote-compare.module').then(m => m.QuoteCompareModule) },
  { path: 'proposal', loadChildren: () => import('./proposals/proposals.module').then(m => m.ProposalsModule) },
  { path: 'renewal', loadChildren: () => import('./renewals/renewals.module').then(m => m.RenewalsModule) },
  { path: 'proposal-confirmation', loadChildren: () => import('./proposalconfirmation/proposalconfirmation.module').then(m => m.ProposalconfirmationModule) },
  { path: 'payment', loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule) },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [SearchPageCanActivateGuard]
})
export class AppRoutingModule { }
