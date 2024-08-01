import { Component, OnInit, ViewChild, ElementRef, Injectable, OnDestroy, Inject } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HostListener } from '@angular/core';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { SeoService } from '../../services/seo.service';
import { Resolve } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

import { Observable, interval, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Title, Meta } from '@angular/platform-browser';
import { TooltipPosition, MAT_TOOLTIP_DEFAULT_OPTIONS, SCROLL_THROTTLE_MS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { VERSION } from '@angular/material';

import { SubSink } from 'subsink'; // FOR UNSUBSCRIBE ALL SUBSCRIPTION ON PAGE DESTROY


export interface Payout {
  value: string;
  viewValue: string;
}

export interface Cover {
  value: string;
  viewValue: string;
}

export interface Pay {
  value: string;
  viewValue: string;
}

export interface IciciState {
  label: string;
  item_value: number;
}

/** Custom options the configure the tooltip's default show/hide delays. */
export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 10,
  hideDelay: 100,
  touchendHideDelay: 100,
};

export const scc: number = 30;

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss', '../../../assets/listing/css/main.css', './quote.component.scss'],
  providers: [
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
  ],
})

@Injectable()

export class ListingComponent implements OnInit, OnDestroy {
  premiumData: any[] = [];
  premiumForm: FormGroup;
  paymentFrequencies: any[] = [
    {option:"Annual", value:"annual"},
    {option:"Half Annual", value:"semi-annual"},
    {option:"Monthly", value:"monthly"},
  ]; 
  


  // ASSIGN SUBSINK
  private subscribeList = new SubSink();

  version = VERSION;
  aegonProposalFormGroupFirst: FormGroup;
  aegonProposalFormGroupSecond: FormGroup;
  aegonProposalFormGroupThird: FormGroup;

  pnbProposalFormGroupFirst: FormGroup;
  pnbProposalFormGroupSecond: FormGroup;
  pnbProposalFormGroupThird: FormGroup;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  iciciPremiumTypeForm: FormGroup;
  eddelPremiumTypeForm: FormGroup;
  maxFormGroup: FormGroup;
  iciciFormGroup: FormGroup;

  public focusState: boolean = true;
  public groupItemShow: boolean = false;
  public showGroup: number = 0;
  // TERM AGE RANGE ARRAY DETAILS
  termRange: any[] = [];

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  payouts: Payout[] = [
    { value: '19900000', viewValue: '19900000' },
  ];

  covers: Cover[] = [
    { value: '70Yrs-0', viewValue: '65Yrs' },
    { value: '10Yrs-1', viewValue: '76Yrs' },
    { value: '50Yrs-2', viewValue: '80Yrs' }
  ];

  pays: Pay[] = [
    { value: 'Regular', viewValue: 'Regular Pay' },
    { value: 'Limited', viewValue: 'Limited Pay' }
  ];

  premFrequency: any[] = [
    { type: 'annual_premium', label: 'Annual Premium', item_value: '01', icici_value: 'Yearly', edelweiss_value: 'Yearly' },
    // tslint:disable-next-line: max-line-length
    { type: 'half_yearly_premium', label: 'Half-Yearly Premium', item_value: '02', icici_value: 'Half-Yearly', edelweiss_value: 'Half-Yearly' },
    { type: 'quarterly_premium', label: 'Quarterly Premium', item_value: '04', icici_value: 'Quaterly', edelweiss_value: 'Quaterly' },
    { type: 'monthly_premium', label: 'Monthly Premium', item_value: '03', icici_value: 'Monthly', edelweiss_value: 'Monthly' }
  ];

  iciciPremFrequency: any[] = [
    { type: 'annual_premium', label: 'Annual Premium', item_value: '01', icici_value: 'Yearly' },
    { type: 'half_yearly_premium', label: 'Half-Yearly Premium', item_value: '02', icici_value: 'Half-Yearly' },
    { type: 'quarterly_premium', label: 'Quarterly Premium', item_value: '04', icici_value: 'Quaterly' },
    { type: 'monthly_premium', label: 'Monthly Premium', item_value: '03', icici_value: 'Monthly' }
  ];

  iciciShowPlanItem: string = 'Regular Pay';

  iciciPremiumOptions: any[] = [
    // {type: 'Regular Pay', label: 'Regular Pay', item_value: '1'},
    { type: 'Limited Pay', label: 'Limited Pay 5 Yrs', item_value: 2, ppt_value: 5 },
    { type: 'Limited Pay', label: 'Limited Pay 7 Yrs', item_value: 2, ppt_value: 7 },
    { type: 'Limited Pay', label: 'Limited Pay 10 Yrs', item_value: 2, ppt_value: 10 },
    { type: 'Limited Pay 60', label: 'Limited Pay &  60-age', item_value: 3, ppt_value: 0 },
    { type: 'Limited Pay Term', label: 'Limited Pay & Term - 5', item_value: 4, ppt_value: 0 },
    { type: 'Limited Whole life', label: 'Whole life & 60 - age', item_value: 5, ppt_value: 0 },
    { type: 'Regular Whole life', label: 'Regular Pay & Whole life', item_value: 6, ppt_value: 0 },
    { type: 'Limited Whole life 10', label: 'Whole life & Ten Pay', item_value: 7, ppt_value: 0 },
    // {type: 'Single Pay', label: 'Single Pay', item_value: 8, ppt_value: 0},
  ];

  eddelPremiumOptions: any[] = [
    { type: 'Life Cover with Inbuilt', label: 'Life Cover with Inbuilt Accidental Death Benefit', item_value: 2, ppt_value: 5 },
    { type: 'Life Cover with Inbuilt Waiver', label: 'Life Cover with Inbuilt Waiver of Future Premium Payable on Accidental Total & Permanent Disability', item_value: 5, ppt_value: 7 },
    { type: 'Limited Pay', label: 'Life Cover with Inbuilt Waiver of Future Premium Payable on Critical Illness', item_value: 6, ppt_value: 10 }
  ];

  iciciStateOptions: IciciState[] = [
    { label: 'ANDAMAN AND NICOBAR', item_value: 1 },
    { label: 'ANDHRA PRADESH', item_value: 2 },
    { label: 'ARUNACHAL PRADESH', item_value: 3 },
    { label: 'ASSAM', item_value: 4 },
    { label: 'BIHAR', item_value: 5 },
    { label: 'CHANDIGARH', item_value: 6 },
    { label: 'DADRA AND NAGAR', item_value: 7 },
    { label: 'DAMAN AND DIU', item_value: 8 },
    { label: 'DELHI', item_value: 9 },
    { label: 'GOA', item_value: 10 },
    { label: 'GUJARAT', item_value: 11 },
    { label: 'HIMACHAL PRADESH', item_value: 21 },
    { label: 'JAMMU AND KASHMIR', item_value: 22 },
    { label: 'KERALA', item_value: 24 },
    { label: 'LAKSHADWEEP', item_value: 25 },
    { label: 'MAHARASHTRA', item_value: 27 },
    { label: 'MANIPUR', item_value: 28 },
    { label: 'MEGHALAYA', item_value: 29 },
    { label: 'NAGALAND', item_value: 31 },
    { label: 'ORISSA', item_value: 32 },
    { label: 'PUNJAB', item_value: 34 },
    { label: 'RAJASTHAN', item_value: 35 },
    { label: 'SIKKIM', item_value: 36 },
    { label: 'TRIPURA', item_value: 38 },
    { label: 'UTTAR PRADESH', item_value: 39 },
    { label: 'JHARKHAND', item_value: 42 },
    { label: 'UTTARAKHAND', item_value: 43 },
    { label: 'TELANGANA', item_value: 45 },
    { label: 'NOST', item_value: 0 },
    { label: 'HARAYANA', item_value: 12 },
    { label: 'KARNATAKA', item_value: 23 },
    { label: 'MADHYA PRADESH', item_value: 26 },
    { label: 'MIZORAM', item_value: 30 },
    { label: 'PONDICHERRY', item_value: 33 },
    { label: 'TAMIL NADU', item_value: 37 },
    { label: 'WEST BENGAL', item_value: 40 },
    { label: 'CHHATTISGARH', item_value: 44 }
  ];
  iciciStateCtrl = new FormControl();
  filteredStates: Observable<IciciState[]>;

  public show: boolean = false;
  public show1: boolean = false;
  public show2: boolean = true;

  public panelOpenState: boolean = false;
  public theCheckbox3: boolean = false;
  public browserName: string = '';

  public buttonName: any = 'Show';
  public popupshow: any = 'View all';
  public panelshow: any = '';
  public screenWidth: any;
  public dialogRef: any;
  quoteJson: any;
  selTermAge: any = 70;
  selSumAssured: any;
  public premiumItemArr: any[] = [];
  public progressBarValue: number = 0;
  public curSec: number = 0;
  public maxLoadingTime: number = 30;
  public progressIterateLImit: number = 20;
  loaderComplete: boolean = false;
  spinnerComplete: boolean = true;
  public progressBarSegmentValue: number = 1;
  public proposalFormSubmitBtn: boolean = false;
  loadingStatus: boolean;
  deepLoadingStatus: boolean;
  allRidersStatus: boolean;

  @ViewChild('progressLoader', { static: false }) progressLoader: ElementRef;
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild('pnbStepper', { static: false }) pnbStepper: MatStepper;
  @ViewChild('aegonStepper', { static: false }) aegonStepper: MatStepper;

  // MAX NEW YORK QUOTE FORM FIELDS
  // tslint:disable-next-line: ban-types
  public maxNyQuoteFormAction = 'https://www.maxlifeinsurance.com/bin/action/route?method=routeMethod';
  maxNyproductName: any;
  maxNyproductType: any;
  maxNyFirstName: any;
  maxNyLastName: any;
  maxNyMiddleName: any;
  maxNyDob: any;
  maxNyGender: any;
  maxNyMobile: any;
  maxNyIsSmoker: any;
  maxNyEmailID: any;
  maxNyTerm: any;
  maxNyPPT: any;
  maxNySumAssured: any;
  maxNyPremium: any;
  maxNyMODE: any;
  maxNyUtmCode: any;
  maxNyCity: any;
  maxNyAnnualIncomeRange: any;
  maxNyproductCode: any;
  maxNyvariantCode: any;
  maxNyAnnualIncome: any;
  maxNyisNri: any;
  maxNyCountryCode: any;

  maxNyrider1_id: any;
  maxNyrider1_sumAssured: any;
  maxNyrider1_pt: any;

  maxNyrider2_id: any;
  maxNyrider2_sumAssured: any;
  maxNyrider2_pt: any;

  maxNyrider3_id: any;
  maxNyrider3_sumAssured: any;
  maxNyrider3_pt: any;

  // EDELWEISS TOKIO REDIRECT FORM FIELD VALUES
  public edLQuoteFormAction = 'http://gogo.edelweisstokio.in/zindagi-plus/buy?src=';
  edLhdnZindagiPlusdata: any;
  edLhdneId: any;
  edLhdnpno: any;
  edLsrc: any;
  edLhdntabindexL: any;

  formTarget: any = '_self'; // _self _blank
  buyNowLoaderIndex: number;
  displayBuyNowLoader = false;
  buyNowItemBtn = false;

  // GIBL OFFLINE PAYMENT FORM
  offlineAmount: any;
  offlineQuoteid: any;
  offlineProvider: any;
  offlinePlanname: any;
  offlineOrderid: any;
  public offlinePaymentFormAction: any;
  public offlinePaymentUrl: any;
  offlinePaymentFormObj: any = {};
  showOfflinePaymentdata: boolean = false;

  @ViewChild('maxNySubmitBtn', { static: false }) maxNySubmitBtn: ElementRef;
  @ViewChild('listingPanel', { static: false }) private listingPanel: ElementRef;
  @ViewChild('edLSubmitBtn', { static: false }) private edLSubmitBtn: ElementRef;
  @ViewChild('offLineSubmitBtn', { static: false }) private offLineSubmitBtn: ElementRef;

  loaderList: any[] = [];

  public intervalCounter: any = 0;
  public myVar: any;

  public spinnerColor: any = 'primary';
  public spinnerMode: any = 'indeterminate';
  public shareProviders: any[] = [];
  pageTitle: string = 'Term Insurance Quote Compare';

  genderArr: any = { M: 'Male', F: 'Female', O: 'Other' };
  smokerArr: any = { Y: 'Yes', N: 'No' };

  uiStyle: any;
  isSponsored: boolean = false;
  logo: string = 'assets/quote/img/logo.png';
  hdrColor: string = '#ffffff';

  public pnbAddonsFormGroup: FormGroup;
  public tataAiaAddonsFormGroup: FormGroup;
  public aegonAddonsFormGroup: FormGroup;
	userStatusApiStatus: boolean = true;
  fb: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    protected localStorage: LocalStorage,
    private apiService: ApiService,
    private seoService: SeoService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder,
    private titleService: Title,
    private metaService: Meta
  ) {

    this.pnbAddonsFormGroup = this._formBuilder.group({
      cover_upto: ['80', [Validators.required]],
      premium_payment_term: ['15', [Validators.required]],
      payment_mode: ['monthly', [Validators.required]],
      riders: this._formBuilder.array([]),
    });

    this.riders.push(
      this._formBuilder.group({
        rider_code: [1],
        // rider_term: [null, [Validators.min(5)]],
        status: [false],
        amount: [null, [Validators.min(500000), Validators.pattern(/^[0-9]*$/)]],
        label: ["Accidental Death Benefit"]
      })
    );
    this.riders.push(
      this._formBuilder.group({
        rider_code: [1],
        // rider_term: [null, [Validators.min(5)]],
        status: [false],
        amount: [null, [Validators.min(500000), Validators.pattern(/^[0-9]*$/)]],
        label: ["Serious Illness"]
      })
    );

    this.tataAiaAddonsFormGroup = this._formBuilder.group({
      premium_plane: ["life", [Validators.required]],
      payment_type: ["rp", [Validators.required]],
      payment_mode: ['monthly', [Validators.required]]
    });

    this.aegonAddonsFormGroup = this._formBuilder.group({
      // payment_type: ["WHOLE_LIFE", [Validators.required]],
      payment_mode: ['monthly', [Validators.required]]
    });
    this.apiService.premiumLoaderCounter.subscribe(count => { 
			this.loaderList = new Array(count);
		// console.log("🚀 ~ count:", count, this.loaderList)
		});
  }

  generateUi() {
    this.apiService.getUi().subscribe((d) => { });
    this.apiService.getUiColors$.subscribe((data) => {
      this.uiStyle = data;
      this.hdrColor = `${this.uiStyle.hdrColor}`;
      this.isSponsored = this.uiStyle.isSponsored;
      this.logo = this.uiStyle.logoUrl;

    })

  }

  // FUNCTIONALITY NEEDS TO TAKE PLACE DURING INITIALIZATION
  ngOnInit() {
   
    this.generateUi();
    this.getScreenSize();
    // SET SEO META DATA
    this.setSeoTagsData();
    // SET ICICI STATE LIST DROP DOWN
    this.filteredStates = this.iciciStateCtrl.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.label),
      map(name => name ? this._filterStates(name) : this.iciciStateOptions.slice())
    );
    this.browserName = this.checkBrowser();
    this.checkQuoteValue();
    const curObj = this;
    setTimeout(() => {
      curObj.loaderComplete = true;
      curObj.progressBarValue = 100;
    }, 30000);
    // SET TERM AGE RANGE ARRAY
    this.termRange = [];
    this.termRange = [...Array(85).keys()].filter((counter) => counter > 4).map(i => i);
    this.termRange.push(99);

    this.firstFormGroup = this._formBuilder.group({
      custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)]],
      custEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      custMob: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      custCuntryCode: ['', [Validators.required, Validators.pattern(/^[0-9]\d{1}$/)]],
    });
    this.secondFormGroup = this._formBuilder.group({
      // tslint:disable-next-line: max-line-length
      custAddress: ['', [Validators.required, Validators.minLength(6)]],
      custCity: ['', [Validators.required]],
      custCountry: ['India', [Validators.required]],
      custStateCode: ['', [Validators.required]],
      // custPanNo: ['', [ Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      custPinCode: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[1-9]\d{5}$/)]],
    });

    this.pnbProposalFormGroupFirst = this._formBuilder.group({
      custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)]],
      custEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      custMob: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      custCuntryCode: ['', [Validators.required, Validators.pattern(/^[0-9]\d{1}$/)]],
    });
    this.pnbProposalFormGroupSecond = this._formBuilder.group({
      custAddress: ['', [Validators.required, Validators.minLength(6)]],
      custCity: ['', [Validators.required]],
      custCountry: ['India', [Validators.required]],
      custStateCode: ['', [Validators.required]],
      // custPanNo: ['', [ Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      custPinCode: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[1-9]\d{5}$/)]],
    });
    this.pnbProposalFormGroupThird = this._formBuilder.group({
      annualIncome: ['', [Validators.required]],
      educationalQualification: ['', [Validators.required]],
      // occupation: ['', [ Validators.required]]
    });

    this.aegonProposalFormGroupFirst = this._formBuilder.group({
      custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)]],
      custEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      custMob: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      custCuntryCode: ['', [Validators.required, Validators.pattern(/^[0-9]\d{1}$/)]],
    });
    this.aegonProposalFormGroupSecond = this._formBuilder.group({
      // custAddress: ['', [Validators.required, Validators.minLength(6)]],
      // custCity: ['', [Validators.required]],
      // custCountry: ['India', [Validators.required]],
      // custStateCode: ['', [Validators.required]],
      // custPanNo: ['', [ Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      custPinCode: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[1-9]\d{5}$/)]],

      educationalQualification: ['Graduate', [Validators.required]],
      occupation: ['Salaried', [Validators.required]]
    });
    this.aegonProposalFormGroupThird = this._formBuilder.group({
      annualIncome: ['', [Validators.required]],
      educationalQualification: ['', [Validators.required]],
      occupation: ['', [Validators.required]]
    });

    this.iciciPremiumTypeForm = this._formBuilder.group({
      iciciPPT: ['', [Validators.required]],
    });
    this.eddelPremiumTypeForm = this._formBuilder.group({
      eddelPPT: ['', [Validators.required]],
    });
    this.maxFormGroup = this._formBuilder.group({
      maxPremiumItem: ['', [Validators.required]],
      maxPremiumMode: ['', [Validators.required]],
    });
    this.iciciFormGroup = this._formBuilder.group({
      iciciPremiumItem: ['', [Validators.required]],
      iciciPremiumMode: ['', [Validators.required]],
    });
  }

  

  // CHECK QUOTE LOCAL STORAGE VALUES
  checkQuoteValue() {
    this.subscribeList.add(
      this.localStorage.getItem('quoteJson').subscribe((data) => {
        if (data !== '') {
          this.quoteJson = data;
          let custAge = Number(this.quoteJson.custAge);
          let custTerm = Number(this.quoteJson.custTerm);
          // this.selTermAge = 70;
          this.quoteJson.custTerm = this.selTermAge - custAge;
          this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
          this.selSumAssured = this.quoteJson.custSumAssured;
          this.premiumItemArr = [];
          // CALL QUOTE DATA SAVE FUNCTION
          this.saveTermQuote();
        } else {
          this.router.navigate(['/']);
        }
      })
    );
  }

  // SAVE REQUEST QUOTE TERM TO DATABASE
  saveTermQuote() {
    this.subscribeList.add(
      this.apiService.submitQuoteTerm(this.quoteJson).subscribe((quoteId: number | object) => {
        if (typeof quoteId == "number" && quoteId > 0) {
          this.quoteJson.quote_id = quoteId;
          this.localStorage.removeItem('quoteJson');
          this.subscribeList.add(
            this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
              this.callPremiumServices();
            })
          );
        } else {
          this.subscribeList.add(
            this.localStorage.getItem('quoteJson').subscribe((data) => {
              if (data !== '') {
                this.quoteJson = data;
                if (this.quoteJson.quote_id > 0) {
                  this.callPremiumServices();
                }
              }
            })
          );
        }
      })
    );
  }

  // CALL ALL PREMIUM SERVICES
  callPremiumServices() {
    //this.setProgreesValue(10);
    this.maxLoadingTime = 10;
    this.startLoaderTimer(this.maxLoadingTime);
    
    // GET AEGON LIFE PREMIUM
    this.getAegonPrrmium();

    /*
    // GET MAXNY REGULAR PREMIUM
    this.getMaxNyRegularPrem();

    // GET ICICI PRU REGULAR PREMIUM
    this.getICICIPremium(1, 0);

    // GET EDELWEISS TOKIO LIFE PREMIUM
    this.getEdelweissTokioLifePremium();

    // GET BHARTI AXA LIFE PREMIUM
    //this.getBhartiAxaLifePremium();

    // GET HDFC LIFE PREMIUM
    this.getHDFCLifePremium();

    // GET TATA AIA LIFE PREMIUM
    this.getTataAiaPrrmium();
    */
  }

  /**
   * Premium functions
   */

  // FUNCTION FOR GETTING MAX PREMIUM
  getMaxNyRegularPrem() {
    this.subscribeList.add(
      this.apiService.getMaxNyRegularPremium(this.quoteJson)
        .subscribe((premiumRes) => {
          if (premiumRes !== null) {
            const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
            const itemArr = this.premiumItemArr;
            const curObj = this;

            itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
              if (premiumItem.provider_id
                && premiumItem.provider_id === 30) {
                itemObj.splice(itemIndex, 1);
              }
            });

            premiumResArr.forEach((premiumItem: any) => {
              premiumItem.value.mode = '01';
              if (curObj.browserName === 'chrome') {
                premiumItem.value.company_logo_n = premiumItem.value.company_logo;
              } else {
                premiumItem.value.company_logo_n = premiumItem.value.company_logo;
              }
              itemArr.push(premiumItem.value);
            });
          }
          this.setProgreesValue(this.progressIterateLImit);
          this.sortPremiumObj();
          this.scrollToBottom();
        })
    );
  }
  // FUNCTION FOR GETTING ICICI PRUDENTIAL PREMIUM
  getICICIPremium(premiumType: number, iciciPPT: number) {
    this.quoteJson.icic_premium_type = premiumType;
    this.quoteJson.icic_ppt = iciciPPT;
    this.subscribeList.add(
      this.apiService.getICICIPruRegularPremium(this.quoteJson).subscribe((premiumRes) => {
        const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
        const itemArr = this.premiumItemArr;
        const classObj = this;
        itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
          if (premiumItem.icic_addons
            && premiumItem.icic_addons === 1) {
            itemObj.splice(itemIndex, 1);
          }
        });
        this.setProgreesValue(this.progressIterateLImit);
        premiumResArr.forEach((premiumItem: any) => {
          premiumItem.value.mode = 'Yearly';
          if (premiumType === 1) {
            premiumItem.value.icic_addons = 0;
          } else {
            premiumItem.value.icic_addons = 1;
          }
          if (premiumItem.value.error_code === 'E00') {
            itemArr.push(premiumItem.value);
            //classObj.iciciShowPlanItem	= premiumItem.value.product_name;
          }
          classObj.scrollToBottom();
        });
        this.sortPremiumObj();
      })
    );
  }
  // FUNCTION FOR GETTING ICICI PRUDENTIAL PREMIUM FOR OTHER OPTIONS
  getDiffICICIPremium(premiumType: number, iciciPPT: number) {
    this.quoteJson.icic_premium_type = premiumType;
    this.quoteJson.icic_ppt = iciciPPT;
    this.subscribeList.add(
      this.apiService.getICICIPruRegularPremium(this.quoteJson).subscribe((premiumRes) => {
        const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
        const itemArr = this.premiumItemArr;
        const classObj = this;

        itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
          if (premiumItem.icic_addons
            && premiumItem.icic_addons === 1) {
            itemObj.splice(itemIndex, 1);
          }
        });

        premiumResArr.forEach((premiumItem: any) => {
          premiumItem.value.mode = '00';
          if (premiumType === 1) {
            premiumItem.value.icic_addons = 0;
          } else {
            premiumItem.value.icic_addons = 1;
          }
          if (premiumItem.value.error_code === 'E00') {
            itemArr.push(premiumItem.value);
          }
          if (premiumItem.value.error_code !== 'E00') {
            classObj.openErrorMessage(premiumItem.value.error_message, 'Close');
          }
          classObj.scrollToBottom();
        });
        this.sortPremiumObj(); // CALL PREMIUM LISTING OBJECT SORT

        this.progressBarValue = 100;
        this.loaderComplete = true;
      })
    );
  }

  // FUNCTION FOR GETTING EDELEWISS-TOKIO PREMIUM
  getEdelweissTokioLifePremium() {
    this.quoteJson.life_cover_option = 1;
    this.subscribeList.add(
      this.apiService.getEdelweissTokioTermPremium(this.quoteJson).subscribe((premiumRes) => {
        console.error('Eddelwies response', premiumRes);
        if (premiumRes !== null) {
          const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
          const itemArr = this.premiumItemArr;
          const classObj = this;
          this.setProgreesValue(this.progressIterateLImit);

          itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
            if (premiumItem.provider_id
              && premiumItem.provider_id === 34) {
              itemObj.splice(itemIndex, 1);
            }
          });

          premiumResArr.forEach((premiumItem: any) => {
            premiumItem.value.mode = 'Yearly';
            if (premiumItem.value.error_code === 'E00') {
              itemArr.push(premiumItem.value);
            }
            classObj.scrollToBottom();
          });
        }
        this.sortPremiumObj(); // CALL PREMIUM LISTING OBJECT SORT
        this.scrollToBottom();
      })
    );
  }

  // FUNCTION FOR GETTING EDDELWIESS TOKIO PREMIUM FOR OTHER OPTIONS
  getDiffEdelweissTokioLifePremium(planOption: number) {
    this.quoteJson.life_cover_option = planOption;

    this.subscribeList.add(
      this.apiService.getEdelweissTokioTermPremium(this.quoteJson).subscribe((premiumRes) => {
        console.error('Eddelwies response', premiumRes);
        if (premiumRes !== null) {
          const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
          const itemArr = this.premiumItemArr;
          const classObj = this;
          this.setProgreesValue(this.progressIterateLImit);

          itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
            if (premiumItem.provider_id
              && premiumItem.provider_id === 34
              && premiumItem.eddl_addons == 1) {
              itemObj.splice(itemIndex, 1);
            }
          });

          premiumResArr.forEach((premiumItem: any) => {
            premiumItem.value.mode = 'Yearly';
            if (premiumItem.value.error_code === 'E00') {
              itemArr.push(premiumItem.value);
            }
            classObj.scrollToBottom();
          });
        }
        this.sortPremiumObj(); // CALL PREMIUM LISTING OBJECT SORT
        this.scrollToBottom();
      })
    );
  }

  // FUNCTION FOR GETTING BHARTI-AXA PREMIUM
  getBhartiAxaLifePremium() {
    this.subscribeList.add(
      this.apiService.getBhartiAxaTermPremium(this.quoteJson).subscribe((premiumRes) => {
        if (premiumRes !== null) {
          const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
          const itemArr = this.premiumItemArr;
          const curObj = this;

          itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
            if (premiumItem.provider_id
              && premiumItem.provider_id === 35) {
              itemObj.splice(itemIndex, 1);
            }
          });

          premiumResArr.forEach((premiumItem: any) => {
            premiumItem.value.mode = '00';
            if (curObj.browserName === 'chrome') {
              premiumItem.value.company_logo_n = premiumItem.value.company_logo;
            } else {
              premiumItem.value.company_logo_n = premiumItem.value.company_logo;
            }
            itemArr.push(premiumItem.value);
          });
        }
        this.setProgreesValue(this.progressIterateLImit);
        this.sortPremiumObj();
        this.scrollToBottom();
      })
    );
  }

  // FUNCTION FOR GETTING HDFC LIFE QUOTE LIST
  getHDFCLifePremium() {
    this.subscribeList.add(
      this.apiService.getHDFCTermPremium(this.quoteJson).subscribe((premiumRes) => {
        if (premiumRes !== null) {
          const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
          const itemArr = this.premiumItemArr;
          const curObj = this;

          itemArr.forEach((premiumItem: any, itemIndex: any, itemObj: any) => {
            if (premiumItem.provider_id
              && premiumItem.provider_id === 33) {
              itemObj.splice(itemIndex, 1);
            }
          });

          premiumResArr.forEach((premiumItem: any) => {
            premiumItem.value.mode = '00';
            itemArr.push(premiumItem.value);
          });
        }
        this.sortPremiumObj(); // CALL PREMIUM LISTING OBJECT SORT
        this.scrollToBottom();
      })
    );
  }

  // FUNCTION FOR GETTING KOTAK LIFE QUOTE LIST
  getKotakLifePremium() {
    this.subscribeList.add(
      this.apiService.getKotakermPremium(this.quoteJson).subscribe((premiumRes) => {
        if (premiumRes !== null) {
          const premiumResArr = Object.keys(premiumRes).map(key => ({ value: premiumRes[key] }));
          const itemArr = this.premiumItemArr;
          const curObj = this;

          premiumResArr.forEach((premiumItem: any) => {
            premiumItem.value.mode = '00';
            itemArr.push(premiumItem.value);
          });
        }
        this.sortPremiumObj(); // CALL PREMIUM LISTING OBJECT SORT
        this.scrollToBottom();
      })
    );
  }

  // FUNCTION FOR GETTING PNB QUOTE LIST
  getPnbInvestmentPremium() {
    this.quoteJson.premiumPaymentFrequency = this.pnbAddonsFormGroup.value.payment_mode;
    this.quoteJson.policyTermType = this.pnbAddonsFormGroup.value.cover_upto;
    this.quoteJson.policyPaymentTerm = this.pnbAddonsFormGroup.value.premium_payment_term;
    this.quoteJson.providerId = 40;
    this.quoteJson.serviceUrl = "";

    this.subscribeList.add(
      this.apiService.getPnbPremium(this.quoteJson).subscribe((premiumRes) => {
        premiumRes.forEach((premiumItem: any) => {
          if (premiumItem.error_code === 'E00') {
            this.premiumItemArr = this.premiumItemArr.filter(data => data.provider_id != 40);
            this.premiumItemArr.push(premiumItem);
          }
          this.scrollToBottom();
        });

        this.sortPremiumObj();
      })
    );
  }

  // FUNCTION FOR GETTING Aegon QUOTE LIST
  getAegonPrrmium() {
    this.quoteJson.premiumPaymentFrequency = this.aegonAddonsFormGroup.value.payment_mode;
    this.quoteJson.providerId = 32;
    this.quoteJson.serviceUrl = "";
    this.loaderComplete = false;
    this.progressBarValue = 0;
    this.maxLoadingTime = 10;
    this.startLoaderTimer(this.maxLoadingTime);
    this.subscribeList.add(
      this.apiService.getAegonPremium(this.quoteJson).subscribe(
        (premiumRes) => {
          if (premiumRes.data && Array.isArray(premiumRes.data)) {
            premiumRes.data.forEach((premiumItem: any) => {
              if (premiumItem.error_code === 'E00') {
                this.premiumItemArr = this.premiumItemArr.filter(data => data.provider_id !== 32);
                this.premiumItemArr.push(premiumItem);
                console.log("??????????",premiumItem)
                this.loaderComplete = true;
              }
            });
          } else {
            console.error('premiumRes.data is not an array or is undefined.', premiumRes);
          }
          this.scrollToBottom();
          this.sortPremiumObj();
        },
        (error) => {
          console.error('Error fetching premium:', error);
          this.loaderComplete = true;
        }
      )
    );
  }
  
  frequencyDropdown() {
    this.quoteJson.premiumPaymentFrequency = this.aegonAddonsFormGroup.value.payment_mode;
    console.log(this.aegonAddonsFormGroup.value.payment_mode)
    // this.quoteJson.policyPaymentType = this.aegonAddonsFormGroup.value.premium_plane;
    this.quoteJson.providerId = 32;
    this.quoteJson.serviceUrl = "";

    this.loaderComplete = false;
    this.progressBarValue = 0;
    this.maxLoadingTime = 10;
    this.startLoaderTimer(this.maxLoadingTime);
    this.subscribeList.add(
      this.apiService.getAegonPremium(this.quoteJson).subscribe((premiumRes) => {
        premiumRes.data.forEach((premiumItem: any) => {
          if (premiumItem.error_code === 'E00') {
            this.premiumItemArr = this.premiumItemArr.filter(data => data.provider_id != 32);
            this.premiumItemArr.push(premiumItem);
            this.loaderComplete = true;
          }
          // this.scrollToBottom();
        });
        this.sortPremiumObj();
      })
    );
  }

  // FUNCTION FOR GETTING TATA AIA LIFE QUOTE LIST
  getTataAiaPrrmium() {
    this.quoteJson.premiumPaymentFrequency = this.tataAiaAddonsFormGroup.value.payment_mode;
    this.quoteJson.policyPlaneType = this.tataAiaAddonsFormGroup.value.premium_plane;
    this.quoteJson.policyPaymentType = this.tataAiaAddonsFormGroup.value.payment_type;
    this.quoteJson.providerId = 41;
    this.quoteJson.serviceUrl = "";

    this.subscribeList.add(
      this.apiService.getTataAiaPremium(this.quoteJson).subscribe((premiumRes) => {
        premiumRes.forEach((premiumItem: any) => {
          if (premiumItem.error_code === 'E00') {
            this.premiumItemArr = this.premiumItemArr.filter(data => data.provider_id != 32);
            this.premiumItemArr.push(premiumItem);
          }
          this.scrollToBottom();
        });

        this.sortPremiumObj();
      })
    );
  }

  /**
   * Premium function end
   * =========================== End ================================
   */

  /**
   *------------------------------------------------------------------
   * Addon manupulat functions
   */

  // CHANGE PREMIUM OPTION VALUE POPUP
  openDialogChangePremium(content): void {
    this.dialogRef = this.dialog.open(content, {
      width: '550px'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.stopBuyNowLoader();
    });
  }
  // OPEN DIALOG FOR MAX PREMIUM MODE
  openMaxDialogChangePremium(content, pIndex: number): void {
    this.maxFormGroup.get('maxPremiumItem').setValue(pIndex);
    this.dialogRef = this.dialog.open(content, {
      width: '550px'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.stopBuyNowLoader();
    });
  }
  // OPEN DIALOG FOR ICICI PREMIUM MODE
  openICICIDialogChangePremium(content, pIndex: number): void {
    this.iciciFormGroup.get('iciciPremiumItem').setValue(pIndex);
    this.dialogRef = this.dialog.open(content, {
      width: '550px'
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.stopBuyNowLoader();
    });
  }

  // CHANGE ICICI PRU PREMIUM OPTION
  icicipremPlanChange(event) {
    if (this.iciciPremiumTypeForm.invalid) {
      return;
    } else {
      event.target.disabled = true;
      let selItem = this.iciciPremiumTypeForm.get('iciciPPT').value;
      let iciciPPT: number = 0;
      if (this.iciciPremiumOptions[selItem] !== undefined) {
        iciciPPT = this.iciciPremiumOptions[selItem].ppt_value;
        selItem = this.iciciPremiumOptions[selItem].item_value;
        this.scrollToBottom();
        this.progressBarValue = 0;
        this.loaderComplete = false;
        this.startLoaderTimer(this.maxLoadingTime);
        this.getDiffICICIPremium(selItem, iciciPPT);
      } else {
        this.openErrorMessage('Invalid option selected.', 'Close');
      }
      this.dialogRef.close();
    }
  }

  // CHANGE EDDELWIESS TOKIO PREMIUM OPTION
  eddelpremPlanChange(event) {
    if (this.eddelPremiumTypeForm.invalid) {
      return;
    } else {
      event.target.disabled = true;
      let selItem = this.eddelPremiumTypeForm.get('eddelPPT').value;
      let iciciPPT: number = 0;
      if (this.eddelPremiumOptions[selItem] !== undefined) {
        selItem = this.eddelPremiumOptions[selItem].item_value;
        this.scrollToBottom();
        console.error('Itemmm', selItem);
        this.progressBarValue = 0;
        this.loaderComplete = false;
        this.startLoaderTimer(this.maxLoadingTime);
        this.getDiffEdelweissTokioLifePremium(selItem);
      } else {
        this.openErrorMessage('Invalid option selected.', 'Close');
      }
      this.dialogRef.close();
    }
  }

  // On add PNB Riders
  onPNBAddonsAdd(event, ref, index) {
    let rider = this.pnbAddonsFormGroup.get("riders");
    if (rider["controls"]) {
      // rider["controls"][index].controls.status = event;
      if (event) {
        rider["controls"][index].controls.amount.setValidators([
          Validators.required,
          Validators.min(500000),
          Validators.pattern(/^[0-9]*$/)
        ]);
        rider["controls"][index].controls.amount.updateValueAndValidity();
      } else {
        rider["controls"][index].controls.amount.setValidators([
          Validators.min(500000),
          Validators.pattern(/^[0-9]*$/)
        ]);
        rider["controls"][index].controls.amount.updateValueAndValidity();
      }
    }
  }

  // On PNB Addons Form Submit
  onPNBAddonsFormSubmit(): void {
    this.getPnbInvestmentPremium();
  }

  onTataAddonsFormSubmit(): void {
    this.getTataAiaPrrmium();
  }

  onAegonAddonsFormSubmit(): void {
    this.getAegonPrrmium();
  }
  /**
   * Addon manupulat functions end
   * =========================== End ================================
   */

  get riders(): FormArray {
    return this.pnbAddonsFormGroup.controls["riders"] as FormArray;
  }

  @HostListener('window:resize', ['$event'])
  // FUNCTIONS TO DETECT SCREEN SIZE
  getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 961) {
      this.show2 = false;
    }
  }
  // FUNCTIONS TO SET SEO META DATA
  setSeoTagsData() {
    const metaKeyWords = 'term life insurance, term insurance, life insurance, term insurance uote compare';
    const metaDescription = 'Buy the best term life insurance plan online in India for lowest price. Compare.';
    this.seoService.setpageTitle(this.pageTitle);
    // this.seoService.createLinkForCanonicalURL('https://www.gibl.in/term-life-insurance/');
    this.seoService.setMetaData(metaKeyWords, metaDescription);
  }

  // RECALCULATE QUOTE
  recalculateQuote(sumAssured: number, coverUpto: number) {
    if (sumAssured < 2500000 || sumAssured > 1000000000) {
      this.openErrorMessage(`Payout must be between 2500000 and 1000000000`, `Close`);
    } else {
      this.subscribeList.add(
        this.localStorage.getItem('quoteJson').subscribe((data) => {
          if (data !== '') {
            this.quoteJson = data;
            this.selTermAge = coverUpto;
            this.quoteJson.custSumAssured = this.selSumAssured = sumAssured;
            this.quoteJson.custTerm = coverUpto - this.quoteJson.custAge;

            this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
              this.progressBarValue = 0;
              this.loaderComplete = false;
              this.checkQuoteValue();
            });
          }
        })
      );
    }
  }

  // OPEN DIALOG BY PASSING DIALOG OPBJECT
  openDialog(content): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(content, {
      disableClose: true,
      width: '80%',
      height: '80%',
      panelClass: ['proposal_container_dialog']
    });

    this.dialogRef.afterClosed().subscribe(result => {
      this.stopBuyNowLoader();
    });
  }

  openDialogConfirm(premiumItem: any, itemIndex: number, content, pospStatusContent) {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
    this.dialogRef = this.dialog.open(content, {
      disableClose: true,
      width: '40%',
      panelClass: ['proposal_container_dialog_confirm']
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (result == 'Y') {
          this.selectPremiumItem(premiumItem, itemIndex, content, pospStatusContent);
          console.log(premiumItem)
        }
      }
    });
  }

  // THIS IS TO CLOSE ANY OPEN DIALOG
  closeDialog(): void {
    this.dialogRef.close();
  }
  // THIS FUNCTIJN ADD LEADING ZERO TO GIVEN VALUE
  addLeadingZero(numberVal: any) {
    return ('0' + numberVal).slice(-2);
  }
  onNoClick() {
  }
  // FUNCTION IS FOR DETECTING BROWSER
  checkBrowser() {
    const test = (regexp) => regexp.test(window.navigator.userAgent);
    switch (true) {
      case test(/edge/i): return 'edge';
      case test(/opr/i): return 'opera';
      case test(/chrome/i): return 'chrome';
      case test(/trident/i): return 'ie';
      case test(/firefox/i): return 'firefox';
      case test(/safari/i): return 'safari';
      default: return 'other';
    }
  }
  // THIS FUNCTION IS FOR WHICH PROPERTY SHOULD SHOW IN ICICI STATE LIST
  displayIciciStateFn(state?: IciciState): string | undefined {
    return state ? state.label : undefined;
  }
  // THIS FUNCTION IS FOR ICICI STATE SERACH FILTER PROCESS
  private _filterStates(value: string): IciciState[] {
    const filterValue = value.toLowerCase();
    return this.iciciStateOptions.filter(state => state.label.toLowerCase().indexOf(filterValue) === 0);
  }
  // THIS FUNCTION UPDATE FORM FILED VALUE
  updateForm(ev: any, idd: any, componentid: any) {
    if (ev.isUserInput) {
      if (componentid === 'custStateCode') {
        this.secondFormGroup.get('custStateCode').setValue(ev.source.value);
      } else {
        console.log('INVALID DATA');
      }
    }
  }

  // PNB
  updatePnbForm(ev: any, idd: any, componentid: any) {
    if (ev.isUserInput) {
      if (componentid === 'custStateCode') {
        this.pnbProposalFormGroupSecond.get('custStateCode').setValue(ev.source.value);
      } else {
        console.log('INVALID DATA');
      }
    }
  }

  // Aegon
  updateAegonForm(ev: any, idd: any, componentid: any) {
    if (ev.isUserInput) {
      if (componentid === 'custStateCode') {
        this.aegonProposalFormGroupSecond.get('custStateCode').setValue(ev.source.value);
      } else {
        console.log('INVALID DATA');
      }
    }
  }

  // SHOW LOADING DURING EACH SERVICE CALL
  startLoaderTimer(seconds: number) {
    const timer$ = interval(1000);
    const sub = timer$.subscribe((sec) => {
      if (!this.loaderComplete) {
        this.progressBarValue = sec * 100 / seconds;
        this.curSec = sec;
      } else {
        // clearInterval();
        sub.unsubscribe();
        this.apiService.premiumLoaderCounterReset()
      }

      if (this.curSec === seconds) {
        this.loaderComplete = true;
        // clearInterval();
        sub.unsubscribe();
        this.apiService.premiumLoaderCounterReset()
      }
    });
  }

  setProgreesValue(progressUpto: number) {
    if (this.progressBarValue < 100) {
      this.progressBarValue = this.progressBarValue + progressUpto;
    }

    if (this.progressBarValue >= 100) {
      this.loaderComplete = true;
    }
  }

  // FUNCTION FOR GETTING ICICI PRUDENTIAL PROPOSAL CONFIRMATION
  setIciciProposalFormValue() {
    this.firstFormGroup.get('custName').setValue(this.quoteJson.custName);
    this.firstFormGroup.get('custEmail').setValue(this.quoteJson.custEmail);
    this.firstFormGroup.get('custCuntryCode').setValue(this.quoteJson.custCuntryCode);
    this.firstFormGroup.get('custMob').setValue(this.quoteJson.custMob);

    if (this.quoteJson.proposalJson) {
      this.secondFormGroup.get('custAddress').setValue(this.quoteJson.proposalJson.custAddress);
      this.secondFormGroup.get('custCity').setValue(this.quoteJson.proposalJson.custCity);
      this.secondFormGroup.get('custStateCode').setValue(this.quoteJson.proposalJson.custStateCode);
      this.secondFormGroup.get('custPinCode').setValue(this.quoteJson.proposalJson.custPinCode);
      // this.secondFormGroup.get('custPanNo').setValue(this.quoteJson.proposalJson.custPanNo);
    }
  }

  setPnbProposalFormValue() {
    this.pnbProposalFormGroupFirst.get('custName').setValue(this.quoteJson.custName);
    this.pnbProposalFormGroupFirst.get('custEmail').setValue(this.quoteJson.custEmail);
    this.pnbProposalFormGroupFirst.get('custCuntryCode').setValue(this.quoteJson.custCuntryCode);
    this.pnbProposalFormGroupFirst.get('custMob').setValue(this.quoteJson.custMob);

    if (this.quoteJson.proposalJson) {
      this.pnbProposalFormGroupSecond.get('custAddress').setValue(this.quoteJson.proposalJson.custAddress);
      this.pnbProposalFormGroupSecond.get('custCity').setValue(this.quoteJson.proposalJson.custCity);
      // this.pnbProposalFormGroupSecond.get('custStateCode').setValue(this.quoteJson.proposalJson.custStateCode);
      this.pnbProposalFormGroupSecond.get('custPinCode').setValue(this.quoteJson.proposalJson.custPinCode);
      // this.pnbProposalFormGroupSecond.get('custPanNo').setValue(this.quoteJson.proposalJson.custPanNo);
      this.updatePnbForm({
        isUserInput: true,
        source: { value: this.quoteJson.proposalJson.custStateCode }
      }, this.quoteJson.proposalJson.custStateCode.item_value, 'custStateCode')
    }
  }

  setAegonProposalFormValue() {
    this.aegonProposalFormGroupFirst.get('custName').setValue(this.quoteJson.custName);
    this.aegonProposalFormGroupFirst.get('custEmail').setValue(this.quoteJson.custEmail);
    this.aegonProposalFormGroupFirst.get('custCuntryCode').setValue(this.quoteJson.custCuntryCode);
    this.aegonProposalFormGroupFirst.get('custMob').setValue(this.quoteJson.custMob);

    if (this.quoteJson.proposalJson) {
      // this.aegonProposalFormGroupSecond.get('custAddress').setValue(this.quoteJson.proposalJson.custAddress);
      // this.aegonProposalFormGroupSecond.get('custCity').setValue(this.quoteJson.proposalJson.custCity);
      // this.aegonProposalFormGroupSecond.get('custStateCode').setValue(this.quoteJson.proposalJson.custStateCode);
      // this.aegonProposalFormGroupSecond.get('custPanNo').setValue(this.quoteJson.proposalJson.custPanNo);
      this.aegonProposalFormGroupSecond.get('custPinCode').setValue(this.quoteJson.proposalJson.custPinCode);
      // this.updateAegonForm({
      //   isUserInput: true,
      //   source: { value: this.quoteJson.proposalJson.custStateCode }
      // }, this.quoteJson.proposalJson.custStateCode.item_value, 'custStateCode')
    }
  }

  // STOP GENERIC BUY NOW BUTTON LOADER
  stopBuyNowLoader() {
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;
  }
  // GET RANDOM NUMBER
  getRandomArbitrary(min: any, max: any) {
    return Math.random() * (max - min) + min;
  }
  // QUOTE FORM SUBMIT
  quoteFormSubmit(form: any, e: any): void {
    e.target.submit();
  }
  // GENERIC URL REDIRECT
  redirectTo(url: string) {
    this.router.navigate([url]);
  }
  // SHOW ANY PDF FROM URL
  showPdfFromUrl(url: string) {
    //const	fullUrl	= `https://docs.google.com/viewer?url=${url}`;
    window.open(url, '_blank');
  }
  // GET SELECTED PREMIUM ITEM
  selectPremiumItemPost(premiumItem: any, itemIndex: number, content) {
    console.log('premiumJson', premiumItem);
    this.subscribeList.add(
      this.localStorage.setItem('premiumJson', premiumItem).subscribe(() => {
        const providerId: number = parseInt(premiumItem.provider_id);
        switch (providerId) {
          // case 30:
          //   this.submitMaxNyRegularForm(premiumItem, itemIndex);
          //   break;
          // case 31:
          //   this.buyNowIciciPru(premiumItem, 31, content, itemIndex);
          //   break;
          case 32:
            this.buyNowAegon(itemIndex, content);
            break;
          // case 33:
          //   this.buyNowHdfcLife(premiumItem, 33, itemIndex);
          //   break;
          // case 34:
          //   this.buyNowEdelweiss(premiumItem, 34, itemIndex);
          //   break;
          // case 35:
          //   this.buyNowBhartiAxa(premiumItem, 35, itemIndex);
          //   break;
          // case 39:
          //   this.buyNowKotakLife(premiumItem, 39, itemIndex);
          //   break;
          // case 40:
          //   this.buyNowPnb(itemIndex, content);
          //   break;
          default:
            console.log('No such provider exists!');
        }
      })
    );
  }
  selectPremiumItem(premiumItem: any, itemIndex: number, content, pospStatusContent) {
    // this.selectPremiumItemPost(premiumItem, itemIndex, content);
    // return;
		if(this.userStatusApiStatus) {
			this.localStorage.getItem("userJson").subscribe((userDetails: any) => {
				if(!userDetails) {
					this.selectPremiumItemPost(premiumItem, itemIndex, content);
					return;
				}

				this.userStatusApiStatus = false;
				this.apiService.getPospCertificationStatus(userDetails.user_code).subscribe((res) => {
					this.userStatusApiStatus = true;
					if(res.status) {
						this.selectPremiumItemPost(premiumItem, itemIndex, content);
					} else {
						this.dialogRef = this.dialog.open(pospStatusContent, {
              panelClass: ['posp_dialog']
            });
						this.dialogRef.afterClosed().subscribe(result => {
						});
					}
				});
			});
		}
  }
  // SUBMIT MAX LIFE PREMIUM TO MAX LIVE DOMAIN
  submitMaxNyRegularForm(premiumItem: any, itemIndex: number) {
    // CONTROL BUY NOW BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    const randomNo = Math.floor((Math.random() * 100) + 1);
    const selDOB = new Date(this.quoteJson.customerDOB);
    const dobFormatVal = `${this.addLeadingZero(selDOB.getDate())}/${this.addLeadingZero(selDOB.getMonth())}/${selDOB.getFullYear()}`;
    this.maxNyIsSmoker = 'No';
    if (this.quoteJson.customerSmoker === 'Y') {
      this.maxNyIsSmoker = 'Yes';
    }
    this.maxNyproductName = premiumItem.product_type;
    this.maxNyproductType = premiumItem.product_type;
    this.maxNyFirstName = 'Sample';
    this.maxNyLastName = 'User';
    this.maxNyMiddleName = '';
    this.maxNyDob = dobFormatVal;
    this.maxNyGender = this.quoteJson.customerGender;
    this.maxNyMobile = this.quoteJson.custMob;
    this.maxNyEmailID = 'test_' + randomNo + '@gibl.in';
    // this.maxNyEmailID = this.quoteJson.custEmail.substring(0, 52);
    this.maxNyTerm = premiumItem.term_age;
    this.maxNyPPT = '';
    this.maxNySumAssured = premiumItem.sum_assured;
    this.maxNyPremium = '';
    this.maxNyMODE = premiumItem.mode;
    this.maxNyUtmCode = 392212;
    this.maxNyCity = '';
    this.maxNyAnnualIncomeRange = this.quoteJson.customerIncome;
    this.maxNyproductCode = 'TNPTPR';
    // this.maxNyvariantCode = premiumItem.variant_code;
    this.maxNyvariantCode = '';
    this.maxNyAnnualIncome = '';
    this.maxNyisNri = '';
    this.maxNyCountryCode = this.quoteJson.custCuntryCode;

    this.maxNyrider1_id = '';
    this.maxNyrider1_sumAssured = '';
    this.maxNyrider1_pt = '';

    this.maxNyrider2_id = '';
    this.maxNyrider2_sumAssured = '';
    this.maxNyrider2_pt = '';

    this.maxNyrider3_id = '';
    this.maxNyrider3_sumAssured = '';
    this.maxNyrider3_pt = '';

    const curObj = this;
    setTimeout(() => {
      curObj.stopBuyNowLoader();
      //curObj.maxNySubmitBtn.nativeElement.click();
    }, 4000);
  }

  // CHANGE SELECTED PREMIUM FREQUENCY
  premFreqChange(event, premiumItem: any, item_index: number) {
    const selItem = event.value;
    this.premiumItemArr[item_index].net_premium = premiumItem[selItem];
    const pitemObj = this;
    this.premFrequency.forEach((pf_item: any) => {
      if (pf_item.type === selItem) {
        pitemObj.premiumItemArr[item_index].mode = pf_item.item_value;
      }
    });
    this.dialogRef.close();
  }


  // FUNCTION FOR BUY ICICI PRU PREMIUM OPTION
  buyNowIciciPru(premiumItem: any, providerId: number, content, itemIndex: number) {
    this.localStorage.removeItem('quoteJson');

    // START BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', '').subscribe(() => {
        this.subscribeList.add(
          this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
            this.quoteJson.premiumJson = premiumItem;
            this.setIciciProposalFormValue();

            // ICICI CALL SERVICE FOR ONLINE PURCHASE
            this.openDialog(content);

            // ICICI CALL SERVICE FOR OFFLINE PURCHASE
            //this.buyOfflinePayment(this.quoteJson);
          })
        );
      })
    );
  }


  // FUNCTION FOR BUY PNB PREMIUM
  buyNowPnb(itemIndex: number, content: any) {
    this.localStorage.removeItem('quoteJson');

    // START BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', '').subscribe(() => {
        this.subscribeList.add(
          this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
            this.quoteJson.premiumJson = this.premiumItemArr[itemIndex];

            this.setPnbProposalFormValue();
            if (this.dialogRef) {
              this.dialogRef.close();
            }
            this.dialogRef = this.dialog.open(content, {
              disableClose: true,
              width: '80%',
              height: '80%',
              panelClass: ['proposal_container_dialog']
            });

            this.dialogRef.afterClosed().subscribe(result => {
              this.stopBuyNowLoader();
            });
          })
        );
      })
    );

    return 0;
  }

  // FUNCTION FOR BUY AEGON PREMIUM
  buyNowAegon(itemIndex: number, content: any) {
    this.localStorage.removeItem('quoteJson');
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', '').subscribe(() => {
        this.subscribeList.add(
          this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
            this.quoteJson.premiumJson = this.premiumItemArr[itemIndex];

            this.setAegonProposalFormValue();
            if (this.dialogRef) {
              this.dialogRef.close();
            }
            this.dialogRef = this.dialog.open(content, {
              disableClose: true,
              width: '80%',
              height: '80%',
              panelClass: ['proposal_container_dialog']
            });

            this.dialogRef.afterClosed().subscribe(result => {
              this.stopBuyNowLoader();
            });
          })
        );
      })
    );

    return 0;
  }

  setOfflinePaymentFormData(quoteData) {
    const paymentBaseUrl = this.apiService.getOfflinePaymentBaseUrl();
    this.offlinePaymentFormObj.order_id = quoteData.order_id;
    this.offlinePaymentFormObj.amount = quoteData.premiumJson.annual_premium;
    this.offlinePaymentUrl = paymentBaseUrl + this.apiService.offlinePaymentUrl;
    this.offlinePaymentFormObj.redirect_url = paymentBaseUrl + this.apiService.offlinePaymentReturnUrl;
    this.offlinePaymentFormObj.cancel_url = paymentBaseUrl + this.apiService.offlinePaymentCancelUrl;
    this.offlinePaymentFormObj.billing_name = quoteData.custName;
    this.offlinePaymentFormObj.billing_address = 'Saltlake';
    this.offlinePaymentFormObj.billing_city = 'Kolkata';
    this.offlinePaymentFormObj.billing_state = 'West Bengal';
    this.offlinePaymentFormObj.billing_zip = '700156';
    this.offlinePaymentFormObj.billing_tel = quoteData.custMob;
    this.offlinePaymentFormObj.billing_email = quoteData.custEmail;
    this.offlinePaymentFormObj.delivery_name = quoteData.custName;
    this.offlinePaymentFormObj.delivery_address = 'Saltlake';
    this.offlinePaymentFormObj.delivery_city = 'Kolkata';
    this.offlinePaymentFormObj.delivery_state = 'West Bengal';
    this.offlinePaymentFormObj.delivery_zip = '700156';
    this.offlinePaymentFormObj.delivery_tel = quoteData.custMob;
    this.offlinePaymentFormObj.transaction_id = new Date().getTime();
    this.offlinePaymentFormObj.merchant_param1 = quoteData.providerId;
  }

  // BUY OFFLINE PAYMENT FORM GENERATE
  buyOfflinePayment(quoteData) {
    quoteData.serviceUrl = this.apiService.getOfflineServiceURL();

    this.subscribeList.add(
      this.apiService.savePaymentTerm(quoteData).subscribe((insertResponse) => {
        let payment_update_response: any = JSON.parse(insertResponse.toString());
        quoteData.order_id = payment_update_response.order_id;
        this.setOfflinePaymentFormData(quoteData);
        if (payment_update_response.order_id != ''
          && payment_update_response.pay_ststus == 1) {
          this.showOfflinePaymentdata = !this.showOfflinePaymentdata;
          const curObj = this;
          setTimeout(() => {
            curObj.stopBuyNowLoader();
            curObj.offLineSubmitBtn.nativeElement.click();
          }, 4000);
        } else {
          this.stopBuyNowLoader();
          this.openErrorMessage('Something went wrong. Please try again!', 'Close');
        }
      })
    );
  }

  // FUNCTION AFTER SUBMIT ICICI PRU PROPOSAL FORM
  submitIciciProposalForm(stepper: MatStepper) {
    if (this.secondFormGroup.invalid) {
      return;
    } else {
      this.proposalFormSubmitBtn = !this.proposalFormSubmitBtn;
      this.quoteJson.custName = this.firstFormGroup.get('custName').value;
      this.quoteJson.custEmail = this.firstFormGroup.get('custEmail').value;
      this.quoteJson.custCuntryCode = this.firstFormGroup.get('custCuntryCode').value;
      this.quoteJson.custMob = this.firstFormGroup.get('custMob').value;
      // let iciciStateObj: any = this.secondFormGroup.get('custStateCode').value;
      const proposalJson = {
        custName: this.quoteJson.custName,
        custEmail: this.quoteJson.custEmail,
        custCuntryCode: this.quoteJson.custCuntryCode,
        custMob: this.quoteJson.custMob,
        custAddress: this.secondFormGroup.get('custAddress').value,
        custCity: this.secondFormGroup.get('custCity').value,
        custCountry: this.secondFormGroup.get('custCountry').value,
        custStateCode: this.secondFormGroup.get('custStateCode').value,
        customerFormatDOB: this.quoteJson.customerFormatDOB,
        customerGender: this.quoteJson.customerGender,
        customerEmpStatus: this.quoteJson.customerEmpStatus,
        custPinCode: this.secondFormGroup.get('custPinCode').value,
        // custPanNo: this.secondFormGroup.get('custPanNo').value,
        custPremiumAmount: this.quoteJson.premiumJson.annual_premium,
      };
      this.quoteJson.proposalJson = proposalJson;
      this.subscribeList.add(
        this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
          const classObj = this;
          this.subscribeList.add(
            this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
              if (typeof insertResponse == "number" && insertResponse > 0) {
                this.subscribeList.add(
                  this.apiService.getICICIPruProposal(this.quoteJson).subscribe((proposalRes) => {
                    const proposalResponse = Object.keys(proposalRes).map(key => ({ value: proposalRes[key] }));
                    proposalResponse.forEach((proposalItem: any) => {
                      if (proposalItem.value.responseCode === 'E00'
                        && proposalItem.value.URL !== '') {
                        window.location.href = proposalItem.value.URL;
                      } else {
                        classObj.openErrorMessage(proposalItem.value.responseRemarks, 'Close');
                      }
                      classObj.proposalFormSubmitBtn = !classObj.proposalFormSubmitBtn;
                    });
                  })
                );
              }
            })
          );
        })
      );
    }
  }

  // FUNCTION AFTER SUBMIT PNB PROPOSAL FORM
  submitPnbProposalForm() {
    if (this.pnbProposalFormGroupFirst.invalid && this.pnbProposalFormGroupSecond.invalid && this.pnbProposalFormGroupThird.invalid) {
      return;
    } else {
      this.proposalFormSubmitBtn = !this.proposalFormSubmitBtn;
      this.quoteJson.custName = this.pnbProposalFormGroupFirst.get('custName').value;
      this.quoteJson.custEmail = this.pnbProposalFormGroupFirst.get('custEmail').value;
      this.quoteJson.custCuntryCode = this.pnbProposalFormGroupFirst.get('custCuntryCode').value;
      this.quoteJson.custMob = this.pnbProposalFormGroupFirst.get('custMob').value;
      // let iciciStateObj: any = this.secondFormGroup.get('custStateCode').value;

      const proposalJson = {
        custName: this.quoteJson.custName,
        custEmail: this.quoteJson.custEmail,
        custCuntryCode: this.quoteJson.custCuntryCode,
        custMob: this.quoteJson.custMob,
        custAddress: this.pnbProposalFormGroupSecond.get('custAddress').value,
        custCity: this.pnbProposalFormGroupSecond.get('custCity').value,
        custCountry: this.pnbProposalFormGroupSecond.get('custCountry').value,
        custStateCode: this.pnbProposalFormGroupSecond.get('custStateCode').value,
        customerFormatDOB: this.quoteJson.customerFormatDOB,
        customerGender: this.quoteJson.customerGender,
        customerEmpStatus: this.quoteJson.customerEmpStatus,
        custPinCode: this.pnbProposalFormGroupSecond.get('custPinCode').value,

        annualIncome: this.pnbProposalFormGroupThird.get('annualIncome').value,
        educationalQualification: this.pnbProposalFormGroupThird.get('educationalQualification').value,
        // custPanNo: this.secondFormGroup.get('custPanNo').value,
        custPremiumAmount: this.quoteJson.premiumJson.net_premium,
      };
      this.quoteJson.proposalJson = proposalJson;
      this.subscribeList.add(
        this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
          this.subscribeList.add(
            this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
              if (typeof insertResponse == "number" && insertResponse > 0) {
                this.subscribeList.add(
                  this.apiService.getPnbProposal(this.quoteJson).subscribe((proposalRes) => {
                    if (proposalRes.responseCode === 'E00' && proposalRes.URL !== '') {
                      window.location.href = proposalRes.URL;
                    } else {
                      this.openErrorMessage(proposalRes.responseRemarks, 'Close');
                    }
                    this.proposalFormSubmitBtn = !this.proposalFormSubmitBtn;
                  })
                );
              }
            })
          );
        })
      );
    }
  }

  // FUNCTION AFTER SUBMIT AEGON PROPOSAL FORM
  submitAegonProposalForm() {
    if (this.aegonProposalFormGroupFirst.invalid && this.aegonProposalFormGroupSecond.invalid) {
      //  && this.aegonProposalFormGroupThird.invalid
      return;
    } else {
      this.proposalFormSubmitBtn = !this.proposalFormSubmitBtn;
      this.quoteJson.custName = this.aegonProposalFormGroupFirst.get('custName').value;
      this.quoteJson.custEmail = this.aegonProposalFormGroupFirst.get('custEmail').value;
      this.quoteJson.custCuntryCode = this.aegonProposalFormGroupFirst.get('custCuntryCode').value;
      this.quoteJson.custMob = this.aegonProposalFormGroupFirst.get('custMob').value;
      // let iciciStateObj: any = this.secondFormGroup.get('custStateCode').value;

      const proposalJson = {
        custName: this.quoteJson.custName,
        custEmail: this.quoteJson.custEmail,
        custCuntryCode: this.quoteJson.custCuntryCode,
        custMob: this.quoteJson.custMob,
        // custAddress: this.aegonProposalFormGroupSecond.get('custAddress').value,
        // custCity: this.aegonProposalFormGroupSecond.get('custCity').value,
        // custCountry: this.aegonProposalFormGroupSecond.get('custCountry').value,
        // custStateCode: this.aegonProposalFormGroupSecond.get('custStateCode').value,
        customerFormatDOB: this.quoteJson.customerFormatDOB,
        customerGender: this.quoteJson.customerGender,
        customerEmpStatus: this.quoteJson.customerEmpStatus,
        custPinCode: this.aegonProposalFormGroupSecond.get('custPinCode').value,

        // annualIncome: this.aegonProposalFormGroupThird.get('annualIncome').value,
        educationalQualification: this.aegonProposalFormGroupSecond.get('educationalQualification').value,
        occupation: this.aegonProposalFormGroupSecond.get('occupation').value,

        // custPanNo: this.secondFormGroup.get('custPanNo').value,
        custPremiumAmount: this.quoteJson.premiumJson.net_premium,
      };
      console.log('pppppppp',proposalJson)
      return;
      

      this.quoteJson.proposalJson = proposalJson;
      
      return;
      this.subscribeList.add(
        this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
          this.subscribeList.add(
            this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
              if (typeof insertResponse == "number" && insertResponse > 0) {
                this.subscribeList.add(
                  this.apiService.getAegonProposal(this.quoteJson).subscribe((proposalRes) => {
                    if (proposalRes.status === 'success' && proposalRes.redirect_url !== '') {
                      window.location.href = proposalRes.redirect_url;
                    } else {
                      this.openErrorMessage(proposalRes.messages, 'Close');
                    }
                    this.proposalFormSubmitBtn = !this.proposalFormSubmitBtn;
                  })
                );
              }
            })
          );
        })
      );
    }
  }

  // FUNCTION FOR BUY AEGON PREMIUM
  // buyNowAegon(premiumItem: any, providerId: number, itemIndex: number) {
  // 	// CONTROL BUY NOW BUTTON LOADER
  // 	this.buyNowLoaderIndex = itemIndex;
  // 	this.displayBuyNowLoader = !this.displayBuyNowLoader;
  // 	this.buyNowItemBtn  = !this.buyNowItemBtn;

  // 	this.localStorage.removeItem('quoteJson');
  // 	this.subscribeList.add(
  // 		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
  // 			this.quoteJson.premiumJson = premiumItem;
  // 			this.subscribeList.add(
  // 				this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
  // 					if ( insertResponse > 0 ) {
  // 						this.displayBuyNowLoader = !this.displayBuyNowLoader;
  // 						this.buyNowItemBtn  = !this.buyNowItemBtn;
  // 						window.open(this.apiService.aegonRedirectUrl, '_blank');
  // 					}
  // 				})
  // 			);
  // 		})
  // 	);
  // }


  // FUNCTION FOR BUY HDFC LIFE
  buyNowHdfcLife(premiumItem: any, providerId: number, itemIndex: number) {
    // CONTROL BUY NOW BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.localStorage.removeItem('quoteJson');
    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
        this.quoteJson.premiumJson = premiumItem;
        this.subscribeList.add(
          this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
            if (typeof insertResponse == "number" && insertResponse > 0) {
              this.stopBuyNowLoader();
              window.open(premiumItem.redirect_link, '_blank');
            }
          })
        );
      })
    );
  }

  // FUNCTION FOR BUY KOTAK LIFE
  buyNowKotakLife(premiumItem: any, providerId: number, itemIndex: number) {
    // CONTROL BUY NOW BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.localStorage.removeItem('quoteJson');
    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
        this.quoteJson.premiumJson = premiumItem;
        this.subscribeList.add(
          this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
            if (typeof insertResponse == "number" && insertResponse > 0) {
              this.stopBuyNowLoader();
              window.open(premiumItem.redirect_link, '_blank');
            }
          })
        );
      })
    );
  }

  // FUNCTION FOR BUY EDELWEISS PREMIUM OPTION
  buyNowEdelweiss(premiumItem: any, providerId: number, itemIndex: number) {
    // CONTROL BUY NOW BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.localStorage.removeItem('quoteJson');
    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', '').subscribe(() => {
        this.subscribeList.add(
          this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
            this.quoteJson.premiumJson = premiumItem;
            console.error('Full Response JSON ::', this.quoteJson);
            this.subscribeList.add(
              this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
                if (typeof insertResponse == "number" && insertResponse > 0) {
                  this.subscribeList.add(
                    this.apiService.getEdelweissTokioTermLink(this.quoteJson).subscribe((responseData) => {
                      let link_response = JSON.parse(JSON.stringify(responseData));
                      console.error('Full Response JSON PRSE::', link_response);
                      if (link_response.error_code == 'E00') {
                        this.showPdfFromUrl(link_response.redirect_link);
                      } else {
                        this.openErrorMessage(link_response.error_message, 'Close');
                      }
                      this.stopBuyNowLoader();
                    })
                  );


                  //this.buyOfflinePayment(this.quoteJson);
                  /*const selDOB  = new Date(this.quoteJson.customerFormatDOB);
                  const dobMonth: number  = selDOB.getMonth() + 1;
                  const dobFormatVal  = `${this.addLeadingZero(selDOB.getDate())}/${this.addLeadingZero(dobMonth)}/${selDOB.getFullYear()}`;

                  const incomeRange: any[]	= this.apiService.annualIncomeList.filter(range => range.id === this.quoteJson.customerIncome);
                  // SET EDELWEISS TOKIO REDIRECT FORM VALUES
                  const hdnZindagiPlusdata: any[]	= [];
                  const ZPModel: any	= {};
                  ZPModel.FullName	= this.quoteJson.custName;
                  ZPModel.Gender	= this.genderArr[this.quoteJson.customerGender];
                  ZPModel.Age	= this.quoteJson.custAge;
                  ZPModel.DOB	= dobFormatVal;
                  ZPModel.Smoke	= this.smokerArr[this.quoteJson.customerSmoker];
                  ZPModel.Earning	= incomeRange[0].edel_text;
                  ZPModel.MaritialStatus	= 'Single';
                  ZPModel.Phone	= this.quoteJson.custMob.toString();
                  ZPModel.Email	= this.quoteJson.custEmail;
                  ZPModel.SumAssured	= this.quoteJson.custSumAssured.toString();
                  ZPModel.PolicyTerm	= this.quoteJson.premiumJson.premium_payment_term;
                  ZPModel.PPT	= this.quoteJson.premiumJson.premium_payment_term;
                  ZPModel.Frequency	= this.quoteJson.premiumJson.mode;
                  ZPModel.BHB_Ind	= 'No';
                  ZPModel.TUB_Ind	= 'No';
                  ZPModel.PWB_Ind	= 'No';
                  ZPModel.ADB_Ind	= 'No';
                  ZPModel.CI_Ind	= 'No';
                  ZPModel.PD_Ind	= 'No';
                  ZPModel.HCB_Ind	= 'No';
                  ZPModel.DSA_Ind	= 'No';
                  ZPModel.ADB	= 0;
                  ZPModel.ATPD	= 0;
                  ZPModel.CI	= 0;
                  ZPModel.HCB	= 0;
                  ZPModel.CIC_Ind	= 'No';
                  ZPModel.CIC_SumAssured	= 0;
                  ZPModel.CIC_ClaimOption	= '';
                  ZPModel.CIC_PolicyTerm	= 0;
                  ZPModel.TopupRate	= 0;
                  ZPModel.TotalBenefit	= 0;
                  ZPModel.PolicyOption	= 'Life Cover with Level Sum Assured';
                  ZPModel.SpouseFirstName	= '';
                  ZPModel.SpouseLastName	= '';
                  ZPModel.SpouseDOB	= '';
                  ZPModel.SpouseGender	= '';
                  ZPModel.SpouseAge	= 0;
                  ZPModel.SpouseTobbacoUser	= 'No';
                  ZPModel.AdditionalBenefit	= '';
                  ZPModel.TopUpBenefitPercentage	= '5';
                  ZPModel.PayoutOption	= 'LumpSum';
                  ZPModel.PayoutMonths	= '';
                  ZPModel.PayoutPercentageLumpsum	= '100%';
                  ZPModel.PayoutPercentageLevelIncome	= '';
                  ZPModel.PayoutPercentageIncreasingIncome	= '';

                  const obj: any = {};
                  obj.ZPModel = ZPModel;

                  hdnZindagiPlusdata.push(obj);
                  this.edLhdnZindagiPlusdata	= JSON.stringify(hdnZindagiPlusdata);
                  this.edLhdneId	= this.quoteJson.custEmail;
                  this.edLhdnpno	= this.quoteJson.custMob;
                  this.edLsrc	= this.apiService.edelweissSrc;
                  this.edLhdntabindexL	= 1;
                  this.edLQuoteFormAction = this.apiService.edelweissRedirectUrl;

                  const curObj  = this;
                  setTimeout(() => {
                    curObj.displayBuyNowLoader = !curObj.displayBuyNowLoader;
                      curObj.buyNowItemBtn  = !curObj.buyNowItemBtn;
                    curObj.edLSubmitBtn.nativeElement.click();
                  }, 4000);*/
                }
              })
            );
          })
        );
      })
    );
  }

  // FUNCTION FOR BUY BHARTI AXA PREMIUM
  buyNowBhartiAxa(premiumItem: any, providerId: number, itemIndex: number) {
    // CONTROL BUY NOW BUTTON LOADER
    this.buyNowLoaderIndex = itemIndex;
    this.displayBuyNowLoader = !this.displayBuyNowLoader;
    this.buyNowItemBtn = !this.buyNowItemBtn;

    this.localStorage.removeItem('quoteJson');
    this.subscribeList.add(
      this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
        this.quoteJson.premiumJson = premiumItem;
        this.subscribeList.add(
          this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
            if (typeof insertResponse == "number" && insertResponse > 0) {
              this.displayBuyNowLoader = !this.displayBuyNowLoader;
              this.buyNowItemBtn = !this.buyNowItemBtn;
              window.open(this.apiService.bhartiAxaRedirectUrl, '_blank');
            }
          })
        );
      })
    );
  }


  // COMMON FUNCTIONS
  // SORT ARRAY OBJECT BY PROPERTY NAME
  sortPremiumObj() {
    this.premiumItemArr.sort((a, b) => a.provider_id - b.provider_id);
  }

  checkGenPremiumFreqForm() {
    if (this.maxFormGroup.invalid) {
      return;
    } else {
      const genPremiumItem = this.maxFormGroup.get('maxPremiumItem').value;
      const genPremiumMode = this.maxFormGroup.get('maxPremiumMode').value;

      if (this.premiumItemArr[genPremiumItem][genPremiumMode] !== '') {
        this.premiumItemArr[genPremiumItem].net_premium = this.premiumItemArr[genPremiumItem][genPremiumMode];
        const pitemObj = this;
        if (this.premiumItemArr[genPremiumItem].provider_id === 30) {
          this.premFrequency.forEach((pfItem: any) => {
            if (pfItem.type === genPremiumMode) {
              pitemObj.premiumItemArr[genPremiumItem].mode = pfItem.item_value;
            }
          });
        }

        if (this.premiumItemArr[genPremiumItem].provider_id === 31) {
          this.premFrequency.forEach((pfItem: any) => {
            if (pfItem.type === genPremiumMode) {
              pitemObj.premiumItemArr[genPremiumItem].mode = pfItem.icici_value;
            }
          });
        }

        if (this.premiumItemArr[genPremiumItem].provider_id === 34) {
          this.premFrequency.forEach((pfItem: any) => {
            if (pfItem.type === genPremiumMode) {
              pitemObj.premiumItemArr[genPremiumItem].mode = pfItem.edelweiss_value;
            }
          });
        }
      } else {
        this.openErrorMessage('Not Available', 'Close');
      }
      this.dialogRef.close();
    }
  }

  checkIciciPremiumFreqForm() {
    if (this.iciciFormGroup.invalid) {
      return;
    } else {
      const iciciPremiumItem = this.iciciFormGroup.get('iciciPremiumItem').value;
      const iciciPremiumMode = this.iciciFormGroup.get('iciciPremiumMode').value;

      if (this.premiumItemArr[iciciPremiumItem][iciciPremiumMode] !== '') {
        this.premiumItemArr[iciciPremiumItem].net_premium = this.premiumItemArr[iciciPremiumItem][iciciPremiumMode];

        const pitemObj = this;
        this.premFrequency.forEach((pfItem: any) => {
          if (pfItem.type === iciciPremiumMode) {
            pitemObj.premiumItemArr[iciciPremiumItem].mode = pfItem.icici_value;
          }
        });
      } else {
        this.openErrorMessage('Not Available', 'Close');
      }
      this.dialogRef.close();
    }
  }

  openErrorMessage(message: string, action: string) {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      duration: 5000
    });
  }

  checkFirstForm(stepper: MatStepper) {
    if (this.firstFormGroup.invalid) {
      return;
    } else {
      this.stepper.next();
    }
  }

  checkSecondForm(stepper: MatStepper) {
    if (this.secondFormGroup.invalid) {
      return;
    } else {
      this.stepper.next();
    }
  }

  checkPnbProposalFormGroupFirst() {
    if (this.pnbProposalFormGroupFirst.invalid)
      return;
    else
      this.pnbStepper.next();
  }

  checkPnbProposalFormGroupSecond() {
    if (this.pnbProposalFormGroupSecond.invalid)
      return;
    else
      // this.submitPnbProposalForm();
      this.pnbStepper.next();
  }


  checkPnbProposalFormGroupThird() {
    if (this.pnbProposalFormGroupThird.invalid)
      return;
    else
      this.submitPnbProposalForm();
    // this.pnbStepper.next();
  }

  checkAegonProposalFormGroupFirst() {
    if (this.aegonProposalFormGroupFirst.invalid)
      return;
    else
      this.aegonStepper.next();
  }

  checkAegonProposalFormGroupSecond() {
    if (this.aegonProposalFormGroupSecond.invalid)
      return;
    else
      this.aegonStepper.next();
  }

  checkAegonProposalFormGroupThird() {
    if (this.aegonProposalFormGroupSecond.invalid)
      // if (this.aegonProposalFormGroupThird.invalid)
      return;
    else
      this.submitAegonProposalForm();
  }

  checkLength(value, len: number, fldName: any) {
    if (value.length > len) {
      // tslint:disable-next-line: radix
      this.firstFormGroup.get(fldName).setValue(parseInt(value.substring(0, len)));
    }
  }

  calculateAge($event) {
    const selDOB = new Date($event.value);
    const timeDiff = Math.abs(Date.now() - selDOB.getTime());
    const custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.firstFormGroup.get('custAge').setValue(custAge);
  }

  private scrollToBottom(): void {
    if(this.listingPanel.nativeElement){
      const scrollToElem = this.listingPanel.nativeElement;
      setTimeout(() => {
        scrollToElem.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
      }, 300);

    }
  }

  toggle() {
    this.show = !this.show;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.show) {
      this.buttonName = 'Hide';
    } else {
      this.buttonName = 'Show';
    }
  }

  toggle1() {
    this.show1 = !this.show1;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.show1) {
      this.popupshow = 'Hide all';
    } else {
      this.popupshow = 'View all';
    }
  }

  toggle2() {
    this.show2 = !this.show2;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.show2) {
      this.panelshow = 'Hide all';
    } else {
      this.panelshow = 'View all';
    }
  }
  // SHOW HIDE MULTIPLE GROUP PREMIUM OPTIONS
  toggleGroup(providerId: number) {
    this.spinnerComplete = false;
    if (providerId > 0) {
      if (this.showGroup == providerId) {
        this.showGroup = 0;
      } else {
        this.showGroup = providerId;
      }
    }
    // this.scrollToBottom();
    const curObj = this;
    setTimeout(() => {
      curObj.spinnerComplete = true;
    }, 1000);
  }

  chooseForShare(event): void {
    if (event.checked) {
      this.shareProviders.push(event.source.value);
    } else {
      const providerIndex: number = this.shareProviders.indexOf(event.source.value);
      if (providerIndex !== -1) {
        this.shareProviders.splice(providerIndex, 1);
      }
    }
  }

  public checkLengthPinCode() {
    if (this.aegonProposalFormGroupSecond.value.custPinCode.toString().length > 6) {
      this.aegonProposalFormGroupSecond.controls['custPinCode'].setValue(parseInt(this.aegonProposalFormGroupSecond.value.custPinCode.toString().substring(0, 6)));
    }
  }


  ngOnDestroy() {
    this.subscribeList.unsubscribe();
  }
}
