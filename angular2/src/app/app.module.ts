import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatMenuModule, MatButtonModule, MatIconModule, MatSidenavModule,MatCheckboxModule, MatRadioModule, MatFormFieldModule,MatOptionModule, MatStepperModule, MatToolbarModule, MatListModule,} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import { NavComponent } from './nav/nav.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FlexLayoutModule } from '@angular/flex-layout';
//import { QuoteComponent } from './quote/quote.component';
import {DialogContentExampleDialog } from './quote/quote/quote.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {ScrollDispatchModule,ScrollingModule} from '@angular/cdk/scrolling';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HttpClient, HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { Globals } from './globals';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatAccordion } from "@angular/material";

import {MatExpansionModule} from '@angular/material/expansion';
// import { FooterComponent } from './footer/footer.component';
//import { HeaderComponent } from './header/header.component';
import { SelectAutocompleteModule } from 'mat-select-autocomplete';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ShareModule } from './share/share.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuoteComponent } from './quote/quote/quote.component';
import {MatChipsModule} from '@angular/material/chips';
import { SearchModule } from './search/search.module';
import { authInterceptorProviders } from './helpers/token.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    QuoteComponent,
    DialogContentExampleDialog,
    // FooterComponent,
    //HeaderComponent,
    PageNotFoundComponent,
  ],
  exports:[MatNativeDateModule, MatRippleModule],
  imports: [
    ShareModule,
    SelectAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule.withServerTransition({ appId: 'car' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatSidenavModule,
    MatRadioModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatGridListModule,
    MatCardModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatListModule,
    NgxMatSelectSearchModule,
    MatTabsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatTooltipModule,
    ScrollDispatchModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    NgSelectModule,
    MatProgressBarModule,
    HttpClientModule,
    MatExpansionModule,
    MatSidenavModule,
    MatSnackBarModule,
	  MatChipsModule,
    DeviceDetectorModule.forRoot(),
    SearchModule
  ],
  entryComponents : [DialogContentExampleDialog],

  providers: [Globals, authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {}
