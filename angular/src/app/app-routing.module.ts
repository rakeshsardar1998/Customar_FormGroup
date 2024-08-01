import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuoteComponent } from './quote/quote.component';
import { NotFoundComponent } from './not-found/not-found.component';
// import { LoaderComponent } from './loader/loader.component';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: QuoteComponent
	},
	{
		path: 'listing',
		pathMatch: 'full',
		loadChildren: () => import('./premiumlisting/premiumlisting.module').then(m => m.PremiumlistingModule),
	},
	{ path: 'proposal',pathMatch:'full', loadChildren: () => import('./proposal/proposal.module').then(m => m.ProposalModule) },
	{ path: 'proposal-form',pathMatch:'full', loadChildren: () => import('./proposal/proposal.module').then(m => m.ProposalModule) },
	{
		path: 'payment',
		loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
	},
	{ path: '404', pathMatch: 'full', component: NotFoundComponent },
	{ path: '**', pathMatch: 'full', redirectTo: '/404' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
