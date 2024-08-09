import { Component, OnInit, HostListener, ViewChild, HostBinding, AfterViewInit, ViewEncapsulation, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../share/date.adapter';
import { AppService } from '../../service/app.service';
import { Observable } from 'rxjs';
import { interval, Subscription } from 'rxjs';
import { MatSliderChange } from '@angular/material/slider';
import { map, startWith } from 'rxjs/operators';
import { debounceTime, filter } from "rxjs/operators";
import { DOCUMENT } from '@angular/common';
import { SubSink } from 'subsink';
import { PayoutResponse } from '../../service/payout-response.model';
declare const dht: any;

//activity point dummy data by annubhuti
// export interface activityPointsinterface {
// 	insurerName: string,
// 		odp: number,
// 		tpp: number,
// 		netAmount: number,
// 		od_activity_point: number,
// 		tp_activity_point: number,
// 		activityPoint: number
// }

// const activityPointsArray: activityPointsinterface[] = [
// 	{
// 		insurerName: "ICICI Lombard",
// 		odp: 4,
// 		tpp: 3,
// 		netAmount: 714,
// 		od_activity_point: 0,
// 		tp_activity_point: 21,
// 		activityPoint: 21
// 	},{
// 		insurerName: "Reliance General",
// 		odp: 4,
// 		tpp: 3,
// 		netAmount: 584,
// 		od_activity_point: 0,
// 		tp_activity_point: 21,
// 		activityPoint: 14
// 	}
// ];

@Component({
	selector: 'app-quote-list',
	templateUrl: './quote-list.component.html',
	styleUrls: ['./quote-list.component.scss', '../../../assets/listing/css/main.css'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	]
})
export class QuoteListComponent implements OnInit, AfterViewInit {
	POSP_name: string="";POSPshortname: string="";
	isRollType8: boolean = false;
  	POSP_URL:string = "";
	isPremiumTypeNew: boolean = false;
	displayedColumns: string[] = ['insurerName', 'netAmount','activityPoint'];
	// DONE BY ARIT FOR LIVE CHAT
	localWindow:any;
	chatItem: any	={};

	quoteModifyLeftForm: FormGroup;
	quoteModifyForm: FormGroup;
	Vdiscount: FormGroup;
	addressDetailForm: FormGroup;
	shareFormEmail: FormGroup;
	shareFormSMS: FormGroup;
	shareFormWhatsappSMS:FormGroup;
	stateJson: any;
	cityJson: any;
	filtercityJson: any;
	garargelist: any;
	garargelistfilter: any;
	garargelistString: string;
	lpg_cngkit = new FormControl(10000, [Validators.required, Validators.min(10000), Validators.max(50000)]);
	public displayAllAddon: boolean = false;
	public show1: boolean = false;
	public show2: boolean = true;
	public garargelistbool: boolean = false;
	public garageLoader: boolean = false;
	public idvRangeError: boolean = false;
	shareFormEmailSubmitted: boolean = false;
	shareFormEmailMsg: boolean = false;
	shareFormSMSMsg: boolean = false;
	shareFormWhatsAppSMSMsg: boolean = false;
	customDiscount: boolean = false;
	ISRENEWAL_Q: boolean = false;
	showCompareList: boolean = false;
	public edit_field: any = 'regDate';
	public buttonName: any = 'Show';
	public popupshow: any = 'View all';
	public panelshow: any = '';
	public screenWidth: any;
	public dialogRef: any;
	selectIDV = '2';
	quoteJson: any;
	userJson: any;

	totalBrandList: any;
	car_fullname: any;

	APIURL:any = '';
	brand_name = '';
	model_name = '';
	variant_name = '';
	fuel_name: any ="";

	brand_name_modal = '';
	model_name_modal = '';
	variant_name_modal = '';
	fuel_name_modal: any ="";

	car_cc = '';
	registration_date_text: any;
	expireMinDate: any;
	pre_policy_expiry_date: any;
	compareList:any[] = [];
	maufacYear: any[] = [];
	selectedArr: any[] = [];
	getselectedArr: any[] = [];
	carJson: any[] = [];
	B2B_AND_B2C_USER_TYPE	=[];
	filter_car_list: any;
	currDate: any;
	minmemberShipDate: any;
	last_claim: any;
	same_provider: any = 0;
	totalFuelList: any;
	same_provider_bool: boolean = false;
	fuel_type_text = '';
	fuel_type: any = '';
	rtoText = '';
	new_ncb: any = '';
	prev_ncb: any = '';
	ncb_array :any;
	claim_Previous_Policy = '';
	prev_policy_type = '';
	callMeBack: FormGroup;
	callMeBackSubmit = true;
	premiumJson: any[] = [];
	premiumJsonTemp: any[] = [];
	lastClaimYears: any[] = [];
	savequotedata: any;
	showPremiumData: any;
	countCompare: number = 0;
	countGarage: number = 0;
	countResultPremium: any;
	form_premium_type: any;
	premiumBreakupJson = [];
	public showErrorModifyModalMsg: boolean = false;
	comprehensive: boolean = true;
	// getquoteJson:object;
	minIDV: any = 0;
	maxIDV: any = 0;
	minElec: any = 0;
	maxElec	: any = 0;
	finalIDV: any = 0;
	quoteresponse: any;
	quoteID: any;
	maxRelianceIDV: any = 0;
	minRelianceIDV: any = 0;
	maxBajajIDV: any = 0;
	minBajajIDV: any = 0;
	minOfflineIDV: any = 0;
	maxOfflineIDV: any = 0;
	maxTataIDV: any = 0;
	minTataIDV: any = 0;
	maxHdfcIDV: any = 0;
	minHdfcIDV: any = 0;
	maxSompoIDV: any = 0;
	maxNationalIDV: any = 0;
	maxDigitIDV: any = 0;
	maxCholaIDV: any =0;
	minSompoIDV: any = 0;
	minFutureIDV: any = 0;
	maxFutureIDV: any = 0;
	minCholaIDV: any = 0;
	minNationalIDV: any = 0;
	minDigitIDV: any = 0;
	minKotakIDV: any = 0;
	maxKotakIDV: any = 0;
	minNewindiaIDV: any = 0;
	maxNewindiaIDV: any = 0;
	minMagmaIDV: any = 0;
	maxMagmaIDV: any = 0;
	minOrientalIDV: any = 0;
	maxOrientalIDV: any = 0;
	minIffcoIDV: any = 0;
	maxIffcoIDV: any = 0;
	cDiscount: any = "";

	modifyIDV: any = 0;
	modifyCount: any = 0;
	addonCount: any = 0;
	months: any;
	isRenewal: any;
	showquoteData: any;
	pre_policy_expiry_date_text = '';
	showCustomIDV = true;
	lpg_below_condition = false;
	progressbarValue = 10;
	curSec: number = 0;
	loader = true;
	show_recal_addon = true;
	globalPremAddonArray = [];
	callServiceSub: Subscription;
	callServiceSub2: Subscription;
	priorityData:any	={
		show_com_all:false,
		priority_arr:[],
		show_com_after_loader:false,
		show_com_counter:0,
		show_tp_all:false,
		tp_priority_arr:[],
		show_tp_after_loader:false,
		show_tp_counter:0,
	};

	globalDisCountArray = [{ isChecked: false },{ isChecked: false },{ isChecked: false },{ isChecked: false },{ isChecked: false },{ isChecked: false },{ isChecked: false },{ isChecked: false },{ isChecked: false }];

	globalAddonArray = [{ isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }];

	globalAdditionalCover = [{ isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }, { isChecked: false }];

	thirdPartyCover = [{ name: "PA to Paid Driver", isDisplay: true, isChecked: false }, { name: "Owner Driver Cover", isDisplay: true, isChecked: false }, { name: "Unnamed Passenger Cover", isDisplay: true, isChecked: false },{ name: "NA", isDisplay: true, isChecked: false }, { name: "Legal Liability To Paid Driver", isDisplay: true, isChecked: false }, { name: "NA", isDisplay: true, isChecked: false }, { name: "NA", isDisplay: true, isChecked: false }, { name: "NA", isDisplay: true, isChecked: false }, { name: "NA", isDisplay: true, isChecked: false }];

	globalAccessories = [{ isChecked: false, name: "Electrical Accessories" }, { isChecked: false, name: "Non Electrical Accessories" }, { isChecked: false, name: "CNG/LPG-Kit" }];

	isThirdParty = false;
	pa_cover = 100000;
	paid_cover = 100000;
	pa_cover_checked = false;
	pa_paid_checked = false;
	paid_driver = 10000;
	paid_driver_list: number[] = [];
	occupationDiscount = false;
	ageDiscount = false;
	AntiTheftDeviceDiscount = false;
	HandicappedDiscount = false;
	recalculateBtnShowHide = false;
	SELECT_PREMIUM_YEAR = 1;
	SELECT_PREMIUM_TYPE = 1;
	garage_pid = 0;

	//fuel_name: any ="";

	panelOpenState = false;
	occupationType = '';
	is_voluntary_deduct = false;
	motorAssociationDiscountFlag = false;
	premiumIndex: any;
	IS_LIVE: any;
	BASEURL:any;
	countResultPremium_use: any;
	isLoggedIn = false;
	white_label = 0;
	premiumJsonShow = false;
	isModifyFormChange = false;
	premiumListKey: any = "";
	elec_below_condition = false;
	non_elec_below_condition = false;
	cIDV: any;
	myStateControl = new FormControl('', [Validators.required]);
	brandControl = new FormControl('', [Validators.required]);
	modelControl = new FormControl('', [Validators.required]);
	variantControl = new FormControl('', [Validators.required]);
	rtoControl = new FormControl('', [Validators.required]);
	myCityControl = new FormControl('', [Validators.required]);
	filteredOptionsState: Observable<any>;
	filteredOptionsCity: Observable<any>;

	filteredOptionsBrand: Observable<any>;
	filteredOptionsModel: Observable<any>;
	filteredOptionsVariant: Observable<any>;
	filteredOptionsRto: Observable<any>;

	setStateErr = false;
	setCityErr = false;
	prev_policy_type_reg_popup = 'C';
	showHideAddCover = false;
	totalModelList: any;
	saveValueChanges = true;
	changes: Array<{ changedAt: Date, changes: any }>;
	comfromBuyBtn = false;
	buyTempPremiumitem:any;
	buyTempIndex:any;
	company_name:any;
	provider_id:any;
	form_rto_id: any = 0;
	NUM_NCB_PREM:any;
	rtoDetail: any;
	prev_insurerID:any;
	is_tppd_deduct = false;
	providerIDCheck =0;
	kotakAddonflag = false;
	recalculateBool = false;
	car_id: any = 0;
	rtoJson: any;
	totalRTOList: any;
	form_rto_code: string = "0";
	quoteUrl: string;
	totalVariantList: any;
	activeTab: string = "TPOD";
	sort_type: string = "ASC";
	sort_value: string = "";
	shareFormCopyMsg: boolean = false;
	providerFeatureCount:any;
	special_zero_dep_type='C';
	special_rsa_type='C';
	special_engine_type='C';
	special_ncb_type='C';
	special_keylock_type='C';
	special_consumable_type='C';
	special_invoice_type='C';
	zeroDepAmt:any = "";
	zeroDepPerc:any = "";
	rsaAmt:any = "";
	rsaPerc:any = "";
	engineAmt:any = "";
	enginePerc:any = "";
	defaultRtoText: string = '';

	ncbAmt:any = "";
	ncbPerc:any = "";

	keylockAmt:any = "";
	keylockPerc:any = "";

	consumableAmt:any = "";
	consumablePerc:any = "";

	invoiceAmt:any = "";
	invoicePerc:any = "";
	cpaCover:any;
	affiliateParam:string	='';
	callNewIndia:number	=	0;
	showOnlyRoyal:number = 0;
	isNewRetailer:number=0;
	dontHavePreviousYearPolicy: boolean = false;

	comShowMoreHide=false; // kyccode

	uiStyle:any;
	isSponsored:boolean=false;
	logo:string='assets/quote/img/logo.png';

	private subscribeList = new SubSink();
	compareJson: any;
	isPayoutButtonActive: boolean;
	payOutStatus: boolean=false;
	posPayoutAmountDetails: any[];
	payOutAmountMsg: string;
	isPospImg: boolean;
	POSP_img: any;
	showHideAdd(v) {
		if (v)
			this.showHideAddCover = true;
		else
			this.showHideAddCover = false;
	}

	onInputChange(event: MatSliderChange) {

		this.quoteModifyLeftForm.get('modifyIDV').setValue(event.value);
		this.quoteModifyLeftForm.get('customIDV').setValue('2');
		this.cIDV = event.value;
		this.selectIDV = '2';
		this.modifyIDV = event.value;
		if (this.modifyIDV == this.minIDV) {
			this.quoteJson.idv = 0;
			this.quoteJson.modifyIDV = 0;
			this.modifyIDV = 0;
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		this.quoteModifyLeftForm.get('modifyIDV').setValue(event.value);
	}

	changeB2B(e)
	{
		/* if(e.target.checked){
			this.quoteJson.b2b=1;
		}
		else
		{
			this.quoteJson.b2b=0;
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.beforeCallService();
		}); */

		if(e.target.checked){
			this.quoteJson.b2b=1;
			this.userJson.optionB2B	=1;
		}
		else
		{
			this.quoteJson.b2b=0;
			this.userJson.optionB2B	=0;
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.localStorage.setItem('userJson', this.userJson).subscribe(() => {
				this.beforeCallService();
			});
		});
	}

	checkIDV()
	{
		this.kotakAddonflag=false;

		if (!this.quoteJson.showCustomIDV)
		{
			this.selectIDV = '2';
			this.cIDV = this.quoteJson.modifyIDV;
			if(this.cIDV==0)
			{
				this.cIDV = this.minIDV;
			}
		}
		else {
			this.selectIDV = '1';
			this.cIDV = '';
		}
	}
	onInputChange2(event) {
		var value = event.target.value;

		this.quoteModifyLeftForm.get('customIDV').setValue('2');

		this.modifyIDV =value;
		this.quoteJson.modifyIDV = value;
		this.quoteModifyLeftForm.get('modifyIDV').setValue(value);
	}
	onInputChangeDiscount(event)
	{
		var value = event.target.value;
		this.cDiscount = value;
	}

	startTimer(seconds: number) {
		const time = seconds;
		const timer$ = interval(1000);
		const sub = timer$.subscribe((sec) => {
			this.progressbarValue += sec * 100 / seconds;
			this.curSec = sec;
			if (this.curSec === seconds || this.countResultPremium == this.countResultPremium_use) {
				this.progressbarValue = 100;
				setTimeout(() =>
				{
					sub.unsubscribe();
					this.apiService.premiumLoaderCounterReset()
					this.loader = false;
					this.progressbarValue = 0;
				}, 1000);
			}
		});
	}

	@ViewChild('zeroDept', {static: false}) zeroDept;
	@ViewChild('roadSide', {static: false}) roadSide;
	@ViewChild('ncbProtect', {static: false}) ncbProtect;
	@ViewChild('engineProtect', {static: false}) engineProtect;
	@ViewChild('keyReplace', {static: false}) keyReplace;
	@ViewChild('consuCover', {static: false}) consuCover;
	@ViewChild('invoicePrice', {static: false}) invoicePrice;
	@ViewChild('personalcover', {static: false}) personalcover;
	@ViewChild('travelhotel', {static: false}) travelhotel;
	@ViewChild('tyreCover', {static: false}) tyreCover;
	@ViewChild('medicalCover', {static: false}) medicalCover;
	@ViewChild('timeoutcontent', {static: false}) timeoutcontent:ElementRef;
	@ViewChild('navBar', {static: false}) navBar:ElementRef;
	userStatusApiStatus: boolean = true;
	loaderList: any[] = [];
	constructor(private apiService: AppService, public fb: FormBuilder, public dialog: MatDialog, private localStorage: LocalStorage, private router: Router, private route: ActivatedRoute,@Inject( DOCUMENT ) public document: Document,
	@Inject( DOCUMENT ) public htmlDocument: HTMLDocument ) {
		this.localWindow = this.document.defaultView;
		this.getScreenSize();
		this.APIURL = this.apiService.getUserServiceURL()
		this.apiService.premiumLoaderCounter.subscribe(count => { 
			this.loaderList = new Array(count);
		// console.log("🚀 ~ count:", count, this.loaderList)
		});
	}
	@HostListener('window:resize', ['$event'])
	getScreenSize(event?) {
		this.screenWidth = window.innerWidth;

		if (this.screenWidth < 961) {
			this.show2 = false;
		}
	}
	navigateURL(router_link)
	{
		this.route.queryParams.subscribe(params => {
			if(params.utm_source!=null && params.utm_source=='dailyhunt')
			{
				this.affiliateParam	="dailyhunt";
			}
			if( this.affiliateParam!='' )
			{
				this.router.navigate(['/'+router_link],{ queryParams: {utm_source:this.affiliateParam}});
			}
			else
			{
				this.router.navigate(['/'+router_link]);
			}
		});
		//this.router.navigate(['/'+router_link]);
	}
	generateLink()
	{
		if(this.quoteJson.isThirdParty)
		{
			this.activeTab ='TP';
		}
		else {
			this.activeTab ='TPOD';
		}
		let extra ="";
		if(this.selectedArr.length >0)
		{
			extra = "&PROVIDER="+this.selectedArr.join(",");
		}
		this.quoteUrl="";
		this.quoteUrl = window.location.href.split('?')[0];
		this.quoteUrl=this.quoteUrl+"?QID="+this.quoteJson.quoteID+"&TYPE="+this.activeTab+extra;
	}
	copyToClipboard(refferalLink)
	{
		refferalLink.select();
		document.execCommand('copy');
		refferalLink.setSelectionRange(0, 0);
		this.shareFormCopyMsg=true;
	}
	generateshareFormEmail()
	{
		this.shareFormEmail = this.fb.group({
			refEmailAddress: ['',[Validators.required,Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
			//refMobileNo: ['',[Validators.pattern(/^\d{10}$/)]],
			QuoteUrl: [''],
		});
	}
	generateshareFormSMS()
	{
		this.shareFormSMS = this.fb.group({
			refMobileNo: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
			QuoteUrl: [''],
		});
	}
	generateshareFormWhatSappSMS()
	{
		this.shareFormWhatsappSMS = this.fb.group({
			refMobileNo: ['',[Validators.required,Validators.pattern(/^\d{10}$/)]],
			QuoteUrl: [''],
		});
	}
	shareEmailFormSubmit()
	{
		this.shareFormEmail.patchValue({ "QuoteUrl": this.quoteUrl });

		this.shareFormEmailSubmitted = true;
		if (this.shareFormEmail.invalid) {
			return;
		}
		else
		{
			let shareFormEmailData = this.shareFormEmail.value;
			this.sendSmsEmailApiService(shareFormEmailData);
			this.shareFormEmailMsg=true;
		}
	}
	getcarJson()
	{
		this.apiService.getcarJson().subscribe(data => {
			let resData=JSON.parse(JSON.stringify(data));
			this.carJson = resData;
			this.get_brand("Y");
		});
	}
	getrtoJson()
	{
		this.apiService.getrtoJson().subscribe(data => {
			let resData=JSON.parse(JSON.stringify(data));
			this.rtoJson = resData;
			var totalRTOListFilter = [];
			var output: any;

			output = { "id": 0, "name": "Select RTO (e.g. MH02)" };
			totalRTOListFilter.push(output);
			resData.forEach(el => {
				output = { "id": el.id, "name": el.rto_code + " " + el.city_name + ", " + el.sname };
				totalRTOListFilter.push(output);
			});
			this.totalRTOList = totalRTOListFilter;
		});
	}
	rtoTapped(event, rto_id) {
		this.form_rto_id = rto_id;
		this.rtoJson.forEach(el => {
			if (el.id == rto_id) {
				this.form_rto_code = el.rto_code;
				this.rtoDetail = el;
				this.rtoText = el.rto_code + " " + el.city_name + ", " + el.sname;
			}
		});
	}
	get_brand(change="N") {
		var filter_brand = [];
		this.carJson.forEach(el => {
			filter_brand[el.brand_code] = el;
		});

		var finalBrandList = [];
		var output: any;
		output = { "id": 0, "name": "Select Brand" };
		finalBrandList.push(output);
		Object.keys(filter_brand).forEach(function (key) {
			var el = filter_brand[key];
			output = { "id": el.brand_code, "name": el.brand_name };
			finalBrandList.push(output);
		});
		this.totalBrandList = finalBrandList;
		this.totalModelList = [];
		this.totalFuelList = [];
		this.totalVariantList = [];
		this.car_id = 0;

		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson=data;
			this.brand_name=this.quoteJson.brand_name;
			this.model_name=this.quoteJson.model_name;
			this.fuel_name=this.quoteJson.fuel_type_text;
			this.variant_name=this.quoteJson.variant_name;
			/* this.brand_name_modal=this.quoteJson.brand_name;
			this.model_name_modal=this.quoteJson.model_name;
			this.fuel_name_modal=this.quoteJson.fuel_type_text;
			this.variant_name_modal=this.quoteJson.variant_name; */


			this.get_model(this.quoteJson.brand_code,"Y");
		});
	}
	get_model(brand_val,change="N") {
		if(change=="N")
			{
				this.fuel_name = "";
				this.model_name = "";
				this.variant_name = "";
				
				this.modelControl.setValue('hhh');
				this.variantControl.setValue('');
				
				/* this.model_name_modal="";
				this.fuel_name_modal="";
				this.variant_name_modal=""; */
			}
			var filter_model = [];
			this.carJson.forEach(el => {
				if (el.brand_code == brand_val) {
					filter_model[el.model_code] = el;
			}
		});

		var finalModelList = [];
		var output: any;
		output = { "id": 0, "name": "Select Model" };
		finalModelList.push(output);
		Object.keys(filter_model).forEach(function (key) {
			var el = filter_model[key];
			output = { "id": el.model_code, "name": el.model_name };
			finalModelList.push(output);
		});
		this.totalModelList = finalModelList;
		//this.filteredOptionsModel	=this.totalModelList;
		this.totalFuelList = [];
		this.totalVariantList = [];
		this.car_id = 0;
		this.get_fuel(this.quoteJson.model_code,change);
	}

	get_fuel(model_code,change="N") {
		if(change=="N")
		{
			this.fuel_name = "";
			this.variant_name = "";
			this.variantControl.setValue('');
			/* this.fuel_name_modal="";
			this.variant_name_modal=""; */
		}
		var filter_fuel = [];
		this.carJson.forEach(el => {
			if (el.model_code == model_code) {
				filter_fuel[el.fuel_type] = el;
			}
		});
		var finalFilterFuel = [];
		var output: any;
		Object.keys(filter_fuel).forEach(function (key) {
			var el = filter_fuel[key];
			if (key == "P") {
				el.fuel_logo = "gasoline.png";
			}
			if (key == "D") {
				el.fuel_logo = "gas-station.png";
			}
			if (key == "E") {
				el.fuel_logo = "electric-station.png";
			}
			output = el;
			finalFilterFuel.push(output);
		});
		this.totalFuelList = finalFilterFuel;
		this.totalVariantList = [];
		this.car_id = 0;
		if (this.totalFuelList.length >0 ) {
			this.get_variant(this.totalFuelList[0]);
		}
	}

	get_variant(elv) {
		var finalVariantList = [];
		var output: any;
		output = { "id": 0, "name": "Select Variant" };
		finalVariantList.push(output);

		this.carJson.forEach(el => {
			if (el.model_code == elv.model_code && el.fuel_type == elv.fuel_type) {
				output = { "id": el.id, "name": el.variant_name };
				finalVariantList.push(output);
			}
		});
		this.totalVariantList = finalVariantList;
		//this.variantControl.setValue('');
		this.car_id = 0;
	}

	get_car_details(selected_car)
	{
		this.car_id = selected_car;
		this.carJson.forEach(el => {
			if (el.id == this.car_id) {
				this.filter_car_list = el;
			}
		});
	}

	change_fw()
	{
		if(this.car_id>0 || this.form_rto_id>0)
		{
			this.dialogRef.close();
			this.quoteJson.quote_submit = 1;
			if(this.car_id>0)
			{
				this.quoteJson.brand_code = this.filter_car_list.brand_code;
				this.quoteJson.model_code = this.filter_car_list.model_code;
				this.quoteJson.fuel_type = this.filter_car_list.fuel_type;
				this.quoteJson.variant_code = this.filter_car_list.variant_code;
				this.quoteJson.cubic_capacity = this.filter_car_list.cubic_capacity;
				this.quoteJson.car_id = this.filter_car_list.id;
				this.quoteJson.car_fullname = this.filter_car_list.full_name;

				this.quoteJson.brand_name = this.filter_car_list.brand_name;
				this.quoteJson.model_name = this.filter_car_list.model_name;
				this.quoteJson.fuel_name = this.filter_car_list.fuel_type_text;
				this.quoteJson.variant_name = this.filter_car_list.variant_name;
				/* this.brand_name_modal = this.filter_car_list.brand_name;
				this.model_name_modal = this.filter_car_list.model_name;
				this.fuel_name_modal = this.filter_car_list.fuel_type_text;
				this.variant_name_modal = this.filter_car_list.variant_name; */
			}
			if(this.form_rto_id>0)
			{
				this.quoteJson.rto_details = this.rtoDetail;
				this.quoteJson.rto_id = this.form_rto_id;
				this.quoteJson.rto_code = this.form_rto_code;
				this.quoteJson.rtoText = this.rtoText;
			}
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.showPremiumData=false;
				//this.showPremiumDataTp=false;
				this.callPremiumApiService();
			});
		}
		else
		{
			//this.modalService.dismissAll();
		}
	}

	sendSmsEmailApiService(shareFormEmailData)
	{
		//shareFormEmailData.serviceUrl=this.APIURL+"service.php?action=SEND_SMS_EMAIL";
		this.apiService.sendSmsEmailPHP(shareFormEmailData,this.quoteJson,this.globalAddonArray,this.globalPremAddonArray).subscribe(data => {

		});
	}
	shareSMSFormSubmit()
	{
		this.shareFormSMS.patchValue({ "QuoteUrl": this.quoteUrl });

		this.shareFormEmailSubmitted = true;
		if (this.shareFormSMS.invalid) {
			return;
		}
		else
		{
			let shareFormSmsData = this.shareFormSMS.value;
			this.sendSmsApiService(shareFormSmsData);
			this.shareFormSMSMsg=true;
		}
	}
	shareWhatsAppSMSFormSubmit()
	{
		this.shareFormWhatsappSMS.patchValue({ "QuoteUrl": this.quoteUrl });

		this.shareFormEmailSubmitted = true;
		if (this.shareFormWhatsappSMS.invalid) {
			return;
		}
		else
		{
			let shareFormWhatSappSmsData = this.shareFormWhatsappSMS.value;
			this.sendSmsApiService(shareFormWhatSappSmsData);
			this.shareFormWhatsAppSMSMsg=true;
		}
	}
	sendSmsApiService(shareFormSmsData)
	{
		this.apiService.sendSmsEmailPHP(shareFormSmsData,this.quoteJson,this.globalAddonArray,this.globalPremAddonArray).subscribe(data => {});
	}
	filter_garage_list()
	{
		let temp_list = [];
		let state_temp_list = [];
		let other_temp_list = [];
		if (Array.isArray(this.garargelist))
		// if(this.garargelist && this.garargelist.length>0)
		{
			this.garargelist.forEach(el => {
				if(el.pid==this.garage_pid)
				{
					if(el.cid==this.quoteJson.rto_details.city_id)
					{
						temp_list.push(el);
					}
					else
					{
						state_temp_list.push(el);
					}
				}
				if(el.pid=='0')
				{
					other_temp_list.push(el);
				}
			});
		}
		if(temp_list.length>0)
		{
			this.garargelistfilter = temp_list;
		}
		else if(state_temp_list.length>0)
		{
			this.garargelistfilter = state_temp_list;
		}
		else
		{
			this.garargelistfilter = other_temp_list;
		}
	}
	openGarage(content,pid): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.garage_pid = pid;
		this.filter_garage_list();
		this.dialogRef = this.dialog.open(content, {
			width: '610px',
			//panelClass:'newpop',
			//height: '90%'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
		console.log(this.garargelistfilter)
	}
	openDialog(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '610px',
			//panelClass:'newpop',
			//height: '90%'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	openShareDialog(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '400px',
			//panelClass:'newpop',
			//height: '90%'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	openDialog2(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '300px'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	openDialog3(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '610px',
			// panelClass:'newpop',
			// height: '43%'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	openCompareDialog(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '800px',
			// panelClass:'newpop',
			// height: '43%'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	generateUi(){
		this.apiService.getUiColors().subscribe((data) => {
			this.uiStyle = data;
			this.isSponsored = this.uiStyle.isSponsored;
			this.logo = this.uiStyle.logoUrl;
			this.navBar.nativeElement.setAttribute('style', `background-color: ${data.hdrColor} !important`);

		})
	}
	ngOnInit() {
		// this.generateUi();
		//this.Accordion.closeAll();
		// DONE BY ARIT FOR LIVE CHAT
		// this.apiService.removeChatMotor();
		
		this.setPospURL();
		this.ncb_array = [];
		this.kotakAddonflag = false;
		this.IS_LIVE  = this.apiService.getIsLIVE();
		this.BASEURL = this.apiService.getBaseURL();
		this.B2B_AND_B2C_USER_TYPE	=this.apiService.B2B_AND_B2C_USER_TYPE;
		this.getcarJson();
		this.getrtoJson();
		this.setlocalStorage();
		this.localStorage.getItem('userJson').subscribe((data: any) => {
			this.userJson= data;
			if (data != null) {
				if(typeof data.is_new_retailer !== 'undefined' && this.IS_LIVE==2){
					this.isNewRetailer=data.is_new_retailer;
				}
				if(data.user_code=="101597" || data.user_code=="100086" || data.role_type== '4')
				{
					this.customDiscount = true;
				}
				this.isLoggedIn = true;
				if (data.white_label == '1') {
					this.white_label = 1;
				}
			}

			if( this.white_label != 1 ){
				// DONE BY ARIT FOR LIVE CHAT
				// this.apiService.openLiveChatbot();
			}
		});

		if (this.IS_LIVE == 0 || this.IS_LIVE == 1) {
			this.countResultPremium_use = 6;
		} else {
			this.countResultPremium_use = 5;
		}
		this.generateModifyQuoteForm();
		this.generateshareFormEmail();
		this.generateshareFormSMS();
		this.generateshareFormWhatSappSMS();
		this.addressDetailForm = this.fb.group({
			custAddress: ['', [Validators.required]],
			custState: ['', [Validators.required]],
			custCity: ['', [Validators.required]],
			custPincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
			custStateLabel: [''],
			custCityLabel: [''],
		})
		this.filteredOptionsState = this.myStateControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterState(value))
			);
		this.filteredOptionsBrand = this.brandControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterBrand(value))
			);
		this.filteredOptionsModel = this.modelControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterModel(value))
			);
		this.filteredOptionsVariant = this.variantControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterVariant(value))
			);
		this.filteredOptionsRto = this.rtoControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterRto(value))
			);

		this.createCallMeBackForm();
		this.route.queryParams.subscribe(params => {
			if(params.QID!=null) {
				this.getQuoteData(params.QID);
				if(params.ISRENEWAL)
				{
					this.ISRENEWAL_Q =true;
					this.getProposalData(params.QID);
				}
			} else {
				this.setQuoteData();
			}

			if(params.PROVIDER!=null){
				this.getselectedArr = params.PROVIDER.split(",");
			}
		});


		// PARSE AFFILIATE LINK
		let full_url = this.router.url.split('?')[0];
		let url_segment = full_url.split('/');
		url_segment.forEach(el => {
			let affilate_index = this.apiService.affiliateList.indexOf(el);
			if( affilate_index !== -1 ){
				this.affiliateParam	=el;
			}
		});

		this.localStorage.getItem("quoteJson").subscribe((data:any) => {
			if(data.dont_have_prev_policy){
				this.dontHavePreviousYearPolicy = data.dont_have_prev_policy;
			}
			//this.quoteJson.new_ncb = 0;
			//this.quoteJson.prev_ncb = 0;
		});

		this.localStorage.getItem("quoteJson").subscribe((quoteJson: any) => {
			this.quoteJson = quoteJson

			let d1 = new Date();
			let d2 = new Date(quoteJson.registration_date.month + "/" + quoteJson.registration_date.day + "/" + quoteJson.registration_date.year);
			let yearDiff = Math.floor((d1.getTime() - d2.getTime()) / 31104000000);

			let premium_type = 'COM'
			if(this.quoteJson.form_premium_type == 0) {
				premium_type = 'COM'
				this.isPremiumTypeNew = true
			} else {
				this.isPremiumTypeNew = false
				if(yearDiff > 9) {
					premium_type = 'TP'
					this.changePrevPolicyType('thirdParty',1)
				} else if(yearDiff > 2) {
					premium_type = 'COM'
					this.changePrevPolicyType('Comprehensive',1)
				} else {
					premium_type = 'SAOD'
					this.changePrevPolicyType('saOD',1)
				}
			}

			quoteJson.premium_type = premium_type
			this.localStorage.setItem("quoteJson", quoteJson).subscribe(() => {})
		});
	}
	ngAfterViewInit() {
		// this.setPospURL();
	}

	setPospURL() {
		this.localStorage.getItem('userJson').subscribe((data: any) => {
		  if (data != null) {
			this.isLoggedIn = true;
			if (data.role_type == '8') {
			  this.isRollType8 = true;
			  this.POSP_URL = this.apiService.getPospURL();
			  if (data.profile_pic_url) {
				if (data.profile_pic_url != "") {
				  this.isPospImg = true;
				  this.POSP_img = data.profile_pic_url;
				} else {
				  this.isPospImg = false;
				  this.POSP_name = data.name;
				  this.POSPshortname = this.getshortname(this.POSP_name);
				}
			  } else {
				this.isPospImg = false;
				this.POSP_name = data.name;
				this.POSPshortname = this.getshortname(this.POSP_name);
	
			  }
			}
		  }
		});
	
	  }
	  getshortname(fullname: string){
		return fullname.split(' ').map(n => n[0]).join('');
		}
			

	setlocalStorage(){
		this.localStorage.getItem('globalAddonArray').subscribe((data: any) => {
			if (data != null) {
				for (var i = 0; i < 14; i++) {
					if (data[i].isChecked) {
						this.globalAddonArray[i].isChecked = true;
					}
				}
			}
		});

		this.localStorage.getItem('globalPremAddonArray').subscribe((data: any) => {
			if (data != null)
			{
				this.globalPremAddonArray = data;
			}
		});
		this.localStorage.getItem('globalAccessories').subscribe((data: any) => {
			if (data != null)
			{
				for (var i = 0; i < 3; i++) {
					if (data[i].isChecked) {
						this.globalAccessories[i].isChecked = true;
					}
				}
			}
		});
		this.localStorage.getItem('globalAdditionalCover').subscribe((data: any) => {
			if (data != null) {
				for (var i = 0; i < 5; i++) {
					if (data[i].isChecked) {
						this.globalAdditionalCover[i].isChecked = true;
					}
				}
			}
		});
		this.localStorage.getItem('thirdPartyCover').subscribe((data: any) => {
			if (data != null) {
				for (var i = 0; i < 5; i++) {
					if (data[i].isChecked) {
						this.thirdPartyCover[i].isChecked = true;
					}
				}
			}
		});
	}
	createCallMeBackForm() {
		this.callMeBack = this.fb.group({
			MobileNo: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
		});
	}
	getProposalData(QID)
	{
		this.apiService.getquotesdetails(QID).subscribe(data => {
			let resData=data;
			let proposalStoredJSON : any;
			proposalStoredJSON=resData;
			proposalStoredJSON=(proposalStoredJSON);

			this.localStorage.setItem('proposalJson', proposalStoredJSON.proposalJson).subscribe(() => {

			});
		});
	}
	setQuoteData(){
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson = data;
			if(this.quoteJson.dont_have_prev_policy){
				this.dontHavePreviousYearPolicy=this.quoteJson.dont_have_prev_policy;
				this.quoteJson.pre_policy_expiry_date={};
			}

			if(this.dontHavePreviousYearPolicy==true){
				this.changePrevPolicyType('thirdParty',1);
			}

			this.apiService.getCitylist().subscribe(data => {
				this.cityJson = data;
				this.apiService.getStatelist().subscribe(data => {
					this.stateJson = data;
					this.stateJson.forEach(el => {
						if (el.sname == this.quoteJson.rto_details.sname){
							this.quoteJson.rto_details.state_id = el.id
							this.setState(el.id,el.sname);
							this.getCity(el.id);
							this.get_garage_list(this.quoteJson.rto_details.city_id,el.id);
						}
					});
				});
			});
			this.myStateControl.setValue(this.quoteJson.rto_details.sname);
			this.myCityControl.setValue(this.quoteJson.rto_details.city_name);
			this.brandControl.setValue(this.quoteJson.brand_name);
			this.modelControl.setValue(this.quoteJson.model_name);
			this.variantControl.setValue(this.quoteJson.variant_name);
			this.rtoControl.setValue(this.quoteJson.rtoText);

			this.paid_driver = this.quoteJson.paid_driver_val;
			if (this.quoteJson.isThirdParty) {
				this.prev_policy_type = 'thirdParty';
				this.isThirdParty = true;
				if(this.quoteJson.is_tppd_deduct==true)
				{
					this.is_tppd_deduct = true;
				}else{
					this.is_tppd_deduct = false;
				}
			}else{
				this.prev_policy_type = 'Comprehensive';
				this.isThirdParty = false;
			}
			if (this.quoteJson.unnamed_passenger == 0)
			{
				this.quoteJson.unnamed_passenger = 100000;
			}
			if (this.quoteJson.pa_cover_checked)
			{
				//this.quoteJson.is_unnamed_passenger = 1;
				this.pa_cover_checked = true;
				this.pa_cover = this.quoteJson.unnamed_passenger;
				this.thirdPartyCover[2].isChecked=true;
			}
			if (this.quoteJson.paid_driver_type)
			{
				//this.quoteJson.is_unnamed_passenger = 1;
				this.pa_paid_checked = true;
				this.paid_cover = this.quoteJson.paid_driver;
				this.thirdPartyCover[0].isChecked=true;
			}
			this.modifyIDV = this.quoteJson.modifyIDV;
			if (this.quoteJson.showCustomIDV){
				this.cIDV = this.quoteJson.modifyIDV;
				if(this.cIDV==0){
					this.cIDV = this.minIDV;
				}
			}else{}
			this.car_fullname = this.quoteJson.cv_fullname;
			this.brand_name = this.quoteJson.brand_name;
			this.model_name = this.quoteJson.model_name;
			this.variant_name = this.quoteJson.variant_name;

			this.car_cc = this.quoteJson.car_cc;
			this.fuel_type_text = this.quoteJson.fuel_type_text;
			this.rtoText = this.quoteJson.rtoText;
			this.isRenewal = this.quoteJson.is_renewal;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
			this.populateModifyQuoteForm();
			let now = new Date();
			this.minmemberShipDate = new Date();

			this.currDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
			var curr_year = new Date().getFullYear();
			var last_year = new Date().getFullYear() - 15;
			for (let i = curr_year; i > last_year; i--) {
				this.maufacYear.push(i);
			}
			this.startTimer(20);
			if(this.userJson!=null){
				if(this.userJson.role_type=='20' && this.quoteJson.deductWallet==0){
					let quotePayload = {
						"userJson":this.userJson,
						"master_code": this.userJson.parent_user_code,
						"user_code":this.userJson.user_code,
						"quote_id":this.quoteJson.uniqueID,
						"policy_type":"FW",
						"deduct_type":"quote"
					};
					this.apiService.walletDeductedService(quotePayload).subscribe(deductRes =>{
						let resDatas=deductRes;
						let Strdeductres : any;
						Strdeductres=resDatas;
						Strdeductres=(Strdeductres);
						if(Strdeductres!=null){
							if(Strdeductres.status==1){
								this.quoteJson.deductWallet=1;
								this.localStorage.setItem('quoteJson',this.quoteJson).subscribe(() => {})
								this.callPremiumApiService();
							}else{
								this.openDialog3(this.timeoutcontent);
							}
						}
					})
				}else{
					this.callPremiumApiService();
				}
			}else{
				this.callPremiumApiService();
			}
		});
	}

	getQuoteData(QID)
	{
		let getquoteJson={
			"QID":QID,
			"providerId":1,
			"serviceUrl":""
		};
		this.apiService.getQuoteData(getquoteJson).subscribe(data => {
			let resData=data;
			let quoteStoredJSON : any;
			quoteStoredJSON=resData;
			let quotedata = (quoteStoredJSON);
			let globalAddonArray = quotedata.globalAddonArray;
			let globalPremAddonArray = quotedata.globalPremAddonArray;
			this.localStorage.setItem('quoteJson', quotedata).subscribe(() => {
				this.localStorage.setItem('globalAddonArray', globalAddonArray).subscribe(() => {
					this.localStorage.setItem('globalPremAddonArray', globalPremAddonArray).subscribe(() => {
						this.setlocalStorage();
						this.setQuoteData();
					});
				});
			});
		});
	}
	private _filterState(value: string): any {
		const filterValue = value.toLowerCase();
		return this.stateJson.filter(option => option.sname.toLowerCase().includes(filterValue));
	}
	private _filterBrand(value: string): any {
		const filterValue = value.toLowerCase();
		return this.totalBrandList.filter(option => option.name.toLowerCase().includes(filterValue));
	}
	private _filterModel(value: string): any {
		const filterValue = value.toLowerCase();
		//this.totalModelList= '';
		//this.modelControl.setValue("");
		return this.totalModelList.filter(option => option.name.toLowerCase().includes(filterValue));
	}
	private _filterRto(value: string): any {
		const filterValue = value.toLowerCase();
		return this.totalRTOList.filter(option => option.name.toLowerCase().includes(filterValue));
	}
	private _filterVariant(value: string): any {
		const filterValue = value.toLowerCase();
		return this.totalVariantList.filter(option => option.name.toLowerCase().includes(filterValue));
	}
	private _filterCity(value: string): any {
		const filterValue = value.toLowerCase();
		return this.filtercityJson.filter(option => option.city_name.toLowerCase().includes(filterValue));
	}
	resetStateErr(value) {
		this.setStateErr = true;
		this.addressDetailForm.get('custState').setValue('');
	}
	resetCityErr(value) {
		this.setCityErr = true;
		this.addressDetailForm.get('custCity').setValue('');
	}
	setState(id, name) {
		this.setStateErr = false;
		this.addressDetailForm.get('custState').setValue(id);
		this.addressDetailForm.get('custStateLabel').setValue(name);
		this.filteredOptionsCity = this.myCityControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterCity(value))
			);
	}

	getCity(id) {
		var filter_city = [];
		this.cityJson.forEach(el => {
			if (el.state_id == id) {
				filter_city.push(el);
			}
		});
		this.filtercityJson = filter_city;
		//// console.log("this.filtercityJson",this.filtercityJson);
	}
	setCity(id, name,state_id) {
		this.setCityErr = false;
		this.addressDetailForm.get('custCity').setValue(id);
		this.addressDetailForm.get('custCityLabel').setValue(name);
		this.get_garage_list(id,state_id);
	}
	get_badge_count(pid)
	{
		//return this.garargelist.length;
		let temp_list = [];
		let other_temp_list = [];
		if(this.garargelist && this.garargelist.length>0)
		{
			this.garargelist.forEach(el => {
				if(el.pid==pid && el.cid==this.quoteJson.rto_details.city_id)
				{
					temp_list.push(el);
				}
				if(el.pid=='0')
				{
					other_temp_list.push(el);
				}
			});
		}
		if(temp_list.length>0)
		{
			return temp_list.length;
		}
		else
		{
			return other_temp_list.length;
		}
	}
	get_garage_list(city_id,state_id)
	{
		let getquoteJson={
			"stateID":state_id,
			"cityID":city_id,
			"serviceUrl":""
		};
		this.garageLoader = true;
		this.garargelist = [];
		this.apiService.getGarageList(getquoteJson).subscribe(data => {
			console.log('garagelist',data)
			let garagelistString = data;
			let garageJson: any;
			garageJson = garagelistString;

			
			this.garargelistbool = true;
			this.garageLoader = false;
			try
			{
			garageJson = (garageJson);
			this.garargelist = garageJson;
			}
			catch(e)
			{
				return;
			}
			this.countGarage = this.garargelist.length;
			this.filter_garage_list();
		});

	}
	
	getMoreInformation(): string {
		return `You can avail considerable discounts on the car insurance premium in case of the following:
		\n\u2022 If you have joined Automobile Association of India
		\n\u2022 On installing ARAI approved anti-theft device
		\n\u2022 Applying for Voluntary Excess`;
	}
	callPremiumApiService() {
		this.show_recal_addon = true;
		this.premiumJsonShow = false;
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson = data;
			if( this.quoteJson.CNG_LPG_Kit_type === true ){
				this.globalAccessories[2].isChecked = true;
			}
			if (this.quoteJson.quoteID == '') {
				this.storeQuoteData();
			} else {
				this.beforeCallService();
			}
		});
	}
	storeQuoteData()
	{
		if(this.IS_LIVE==0)
		{
			/** NODE Version */
			this.apiService.saveQuote(this.quoteJson).toPromise().then(res => {
				this.quoteresponse = res;
				if (this.quoteresponse.success === true) {
					this.quoteID = this.quoteresponse.quoteId;
					this.quoteJson.quoteID = this.quoteID;
					this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });

					this.UserTrackData();
				}
				this.beforeCallService();
			});
		}
		else
		{
			this.apiService.saveQuotePHP(this.quoteJson).toPromise().then(res => {
				// console.log("this.quoteresponse",res);
				this.quoteresponse = (res);
				if (this.quoteresponse.success === true)
				{
					this.quoteID = this.quoteresponse.quoteId;
					this.quoteJson.quoteID = this.quoteID;
					if(this.IS_LIVE==2)
					{
						this.insertCRMQuoteCall(this.quoteJson);
					}
					this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });

					this.UserTrackData();
				}
				this.beforeCallService();
			});
		}
	}

	UserTrackData(){
		let userTrackData={
				"unique_id":this.quoteJson.uniqueID,
				"quote_id":this.quoteJson.quoteID,
				"page_id":"3",
				"created_by":this.quoteJson.source_user,
			};

			this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
			});
	}

	beforeCallService() {
		//// console.log('Before call');
		this.countResultPremium = 0;
		this.showPremiumData = false;
		this.premiumJson = [];
		this.premiumJsonTemp = [];
		this.route.queryParams.subscribe(params => {
			this.callServices();
		});
	}
	resetShowPriorityWiseButton(){
		// FOR COM
		this.priorityData.show_com_all	=false;
		this.priorityData.priority_arr	=[];
		this.priorityData.show_com_after_loader	=false;
		this.priorityData.show_com_counter	=0;
		this.comShowMoreHide =false; // kyccode

		// FOR TP
		this.priorityData.show_tp_all	=false;
		this.priorityData.tp_priority_arr	=[];
		this.priorityData.show_tp_after_loader	=false;
		this.priorityData.show_tp_counter	=0;
	}
	callServices() {
		this.callNewIndia=0;
		this.showOnlyRoyal =0;
		this.subscribeList.unsubscribe();
		// this.apiService.premiumLoaderCounterReset()
		this.resetShowPriorityWiseButton();
		this.countResultPremium = 0;
		this.defaultRtoText=this.quoteJson.rto_details.rto_code + " " + this.quoteJson.rto_details.city_name + ", " + this.quoteJson.rto_details.sname;
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson = data;

			this.brand_name = this.quoteJson.brand_name;
			this.model_name = this.quoteJson.model_name;
			this.fuel_name = this.quoteJson.fuel_name;
			this.variant_name = this.quoteJson.variant_name;
			this.defaultRtoText=this.quoteJson.rto_details.rto_code + " " + this.quoteJson.rto_details.city_name + ", " + this.quoteJson.rto_details.sname;

			let now = new Date();
			let reg_year = this.quoteJson.registration_date.year;
			this.expireMinDate = new Date(reg_year+1, now.getMonth(), now.getDate());
			this.setAddon();
			this.route.queryParams.subscribe(params => {
				if (params.TYPE != null) {
					if(params.TYPE == 'TP') {
						this.isThirdParty = true;
						this.quoteJson.isThirdParty = true;
						this.quoteJson.premium_type = "TP";
					}
				}
			});
			this.form_premium_type = this.quoteJson.form_premium_type;

			if (!this.quoteJson.isThirdParty) {
				if (this.form_premium_type == 0) {
					this.callComprehensiveServices();
				} else if (this.form_premium_type == 1){
					this.comprehensive = true;
					this.isRenewal = true;
					this.callComprehensiveServices();
				}
			} else {
				//// console.log('ff=>',this.quoteJson.isThirdParty);
				this.comprehensive = false;
				this.countResultPremium = 0;
				this.callTpServices();
				//this.changePrevPolicyType('thirdParty',1);
			}

			this.showquoteData = true;
			this.populateModifyQuoteForm();
		});
	}

	callComprehensiveServices()
	{
		let premiumData;
		this.subscribeList.add(
			this.apiService.getPremium(this.quoteJson).subscribe(data => {
				if (this.prev_policy_type != 'thirdParty') {
					premiumData = data;
					if (premiumData != "" && typeof premiumData !== 'undefined') {
						try {
							let premiumJson = (premiumData);
							this.parsePremiumJson(premiumJson);
						}
						catch (e) {
							return;
						}
					}
				}
			})

		);
		this.SELECT_PREMIUM_TYPE = 1;
		if (this.quoteJson.premium_type == "SAOD") {
			this.SELECT_PREMIUM_TYPE = 3;
			// this.form_premium_type=3;
		}
		if (this.form_premium_type == 0) {
			this.SELECT_PREMIUM_TYPE = 0;
		}
		/*
		if (this.IS_LIVE == 2) {
			if (this.form_premium_type == 0) {// FOR NEW CASE
				this.hdfcGetNewPremium();
			} else {
				if(this.quoteJson.pre_policy_type=="COMPREHENSIVE") {
					let counter	=1;
					//this.kotakRolloverPremium();
					this.localStorage.getItem('userJson').subscribe((val) => {
						let data:any;
						data = val;
						if(data!=null && data.role_type=='20')
						{
							this.getpriorityWiseComIds(); // kyccode
							this.walletRetailerServiceCall();
						}
						else if(data!=null && this.B2B_AND_B2C_USER_TYPE.includes(+data.role_type))
						{
							// SET GIBL POS WALLET B2B STATUS
							this.quoteJson.b2b	=data.optionB2B;
							this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() =>
							{
								if(this.quoteJson.b2b && this.quoteJson.b2b==1)
								{
									this.walletRetailerServiceCall();
								}
								else
								{
									this.generalCOMServicecall();
								}
							});
						}
						else
						{
							this.priorityWiseComServicecall();
						}
					});
				}
				this.localStorage.getItem('userJson').subscribe((val) => {
					let data:any;
					data = val;
					let GivenDateStr = this.quoteJson.pre_policy_expiry_date.year+"-"+this.quoteJson.pre_policy_expiry_date.month+"-"+this.quoteJson.pre_policy_expiry_date.day;
					let CurrentDate = new Date();
					CurrentDate.setHours(0,0,0,0);
					let GivenDate = new Date(GivenDateStr);
					let GivenDateTime=GivenDate.getTime();
					let CurrentDateTime=CurrentDate.getTime();
					if((data!=null && (data.user_code== '101597' || data.user_code=="100086" || data.role_type== '4')) || this.getselectedArr.length>0)
					{
						this.generalOFFLineCOMServicecall();
					}
					else if(data==null && GivenDateTime < CurrentDateTime)
					{
						this.generalOFFLineCOMServicecall();
					}
				});
			}
		} else {
		}*/
	
		if (this.form_premium_type == 0) { // FOR NEW CASE
			// this.kotakGetNewPremium();
			// this.hdfcGetNewPremium();
			
			this.iciciGetNewPremium();
			this.cholaGetNewPremium();
			this.relianceGetPremium();


		} else {
			if(this.quoteJson.pre_policy_type == "COMPREHENSIVE") {
				const timer$ = interval(1000);
				this.localStorage.getItem('userJson').subscribe((val) => {
					let data:any;
					data = val;
					if(data!=null && data.role_type=='20') {
						this.walletRetailerServiceCall();
					} else {
						this.generalCOMServicecall();
					}
				});
			} else {
				this.localStorage.getItem('userJson').subscribe((val) => {
					let data:any;
					data = val;
					if(data!=null && data.role_type=='20') {}
					else {
						this.kotakRolloverPremium();
					}
				});
			}

			this.localStorage.getItem('userJson').subscribe((val) => {
				let data:any;
				data = val;
				let GivenDateStr = this.quoteJson.pre_policy_expiry_date.year+"-"+this.quoteJson.pre_policy_expiry_date.month+"-"+this.quoteJson.pre_policy_expiry_date.day;
				let CurrentDate = new Date();
				CurrentDate.setHours(0,0,0,0);
				let GivenDate = new Date(GivenDateStr);
				// console.log("GivenDate",GivenDate);
				// console.log("CurrentDate",CurrentDate);
				let GivenDateTime=GivenDate.getTime();
				let CurrentDateTime=CurrentDate.getTime();
				//// console.log("this.getselectedArr.length",this.getselectedArr.length);
				if((data!=null && (data.user_code== '101597' || data.user_code=="100086" || data.role_type== '4')) || this.getselectedArr.length>0)
				{
					this.generalOFFLineCOMServicecall();
				}
				else if(data==null && GivenDateTime < CurrentDateTime)
				{
					this.generalOFFLineCOMServicecall();
				}
			});
			/** End */
		}
	}

	walletRetailerServiceCall()
	{
		//nm
		const timer$ = interval(1000);
		const timer2$ = interval(1000);

		this.digitRolloverCDPremium();
		this.nationalGetPremium(1);

		// // console.log(" test => "); return 0;

		this.callServiceSub2 = timer2$.subscribe((sec2) => {
			if( sec2>7 ){
				this.callServiceSub2.unsubscribe();
				this.apiService.premiumLoaderCounterReset()
			}else{
				if( sec2==1 ){
					this.hdfcGetRolloverCDPremium();
				}
				else if( sec2==2 ){
					this.relianceRolloverCDPremium();
				}
				else if( sec2==3 ){
					this.bajajRolloverCDPremium();
					//this.bajajRolloverPremium();
				}
				else if( sec2==4 ){
					this.digitRolloverCDPremium();
				}
				else if( sec2==5 ){
					if(this.isNewRetailer==0){
						this.tataRolloverPremium();
					}
					// console.log('Tata Call==>',sec2);
				}
				else if( sec2==6 )
				{
					if(this.IS_LIVE==2)
					{
						//this.kotakRolloverPremium();
						this.kotakRolloverCDPremium();
						// console.log('Kotak Call==>',sec2);
					}
					else
					{
						// this.kotakRolloverPremium();
						this.kotakRolloverCDPremium();
						// console.log('Kotak CD Call==>',sec2);
					}
				}
				else if( sec2==7 ){
					if(this.isNewRetailer==0){
						this.futureRolloverPremium();
					}
					// console.log('Future Call==>',sec2);
				}
				// nm-new
				else if( sec2==8 ){
					if(this.isNewRetailer==0){
						this.digitRolloverPremium();
					}
				}
			}
		});
		if(this.isNewRetailer==0){
			this.magmaRolloverPremium();
			this.sompoRolloverPremium();
			this.iciciGetPremium();
			this.newindiaRolloverPremium();
			this.cholaGetPremium();
			this.iffcoGetPremium();
		}

		//this.kotakRolloverCDPremium();
	}

	generalCOMServicecall()
	{
		if(this.quoteJson.premium_type=="COM")
		{
			this.futureRolloverPremium();
			this.relianceRolloverPremium();
			this.digitRolloverPremium();
			this.iciciGetPremium();
			this.cholaGetPremium();
			// this.kotakRolloverPremium();
			// this.tataRolloverPremium();
			// this.bajajRolloverPremium();
			// this.hdfcGetRolloverPremium();
			// this.magmaRolloverPremium();
			// this.sompoRolloverPremium();
			// this.nationalGetPremium();
			// this.newindiaRolloverPremium();
			// this.iffcoGetPremium();
		}
		if(this.quoteJson.premium_type=="SAOD")
		{
			this.bajajODRolloverPremium();
			this.digitODRolloverPremium();
			this.iciciodPremium();
			this.cholaODRolloverPremium();
			this.odiffcoGetPremium();

		}

		}



	generalOFFLineCOMServicecall()
	{
		this.localStorage.getItem('userJson').subscribe((data: any) => {
			let user_data:any;
			user_data = data;
			if(data==null || data.role_type!='20')
			{
				this.onlyOfflineComService();
			}
		});
		this.magmaRolloverPremium();
		this.kotakRolloverPremium();
	}

	onlyOfflineComService()
	{
		this.offlineGetPremium(38); // FOR RAHEJA OFFLINE
		this.offlineGetPremium(34); // FOR EDELWEISS OFFLINE
		this.offlineGetPremium(37); // FOR DHFL OFFLINE
		this.offlineGetPremium(7);  // FOR ICICI OFFLINE
		this.offlineGetPremium(11); // FOR ORIENTAL OFFLINE
		this.offlineGetPremium(26); // FOR SHRIRAM OFFLINE
		//this.offlineGetPremium(8);  // FOR IFFCO OFFLINE
		this.offlineGetPremium(21); // FOR MAGMA OFFLINE
	}

	priorityWiseComServicecall()
	{
		let sendData:any	={};
		sendData.car_id	=this.quoteJson.car_id;
		sendData.rto_code	=this.quoteJson.rto_code;
		sendData.policy_sub_type	=this.quoteJson.form_premium_type;

		this.apiService.COM_NON_PSU_INSURER_IDS.sort((a, b) => a - b);

		this.apiService.getPriorityData(sendData).subscribe(pririty_list_data => {
			let final_insurer_ids;
			let priority_arr	=[];
			this.priorityData.priority_arr	=[];

			if( pririty_list_data!='' ){
				let priority_data:any	=(pririty_list_data);
				if( priority_data.insurer_id && priority_data.insurer_id.length>0 ){
					this.priorityData.show_com_all	=true;
					priority_data.insurer_id.forEach(el => {
						priority_arr.push(parseInt(el));
					});
				}
				final_insurer_ids = priority_arr.concat(this.apiService.COM_NON_PSU_INSURER_IDS.filter(x => priority_arr.every(y => y !== x)));
			}
			else{
				final_insurer_ids = priority_arr.concat(this.apiService.COM_NON_PSU_INSURER_IDS.filter(x => priority_arr.every(y => y !== x)));
			}
			this.priorityData.priority_arr	=priority_arr;
			// INSURER WISE SERVICE CALL
			this.callMatchItemWiseComService(final_insurer_ids);

		},(error) =>{
			// console.log('Error occured');
		});

	}
	timer = ms => new Promise(res => setTimeout(res, ms));

	async callMatchItemWiseComService(final_insurer_ids)
	{
		if(this.quoteJson.premium_type=="COM")
		{
			for(let i=0; i< final_insurer_ids.length; i++)
			{
				let el = final_insurer_ids[i];
				switch(el) {
					case 2: {
						this.bajajRolloverPremium();
						break;
					}
					case 3: {
						this.iciciGetPremium();
						break;
					}
					case 4:{
						this.cholaGetPremium();
						break;
					}
					case 5: {
						this.futureRolloverPremium();
						break;
					}
					case 6: {
						this.hdfcGetRolloverPremium();
						break;
					}
					case 12: {
						this.relianceRolloverPremium();
						break;
					}
					case 16: {
						this.sompoRolloverPremium();
						break;
					}
					case 17: {
						this.tataRolloverPremium();
						break;
					}
					case 21: {
						this.magmaRolloverPremium();
						break;
					}
					case 28: {
						this.kotakRolloverPremium();
						break;
					}
					case 29: {
						this.digitRolloverPremium();
						break;
					}
					case 8: {
						this.iffcoGetPremium();
						break;
					}
					default: {
					  //statements;
					  break;
					}
				}
				await this.timer(1000);
			}

			// PSU SERVICE CALL
			let COM_PSU_INSURER_IDS	=this.apiService.COM_PSU_INSURER_IDS.sort((a, b) => a - b);

			COM_PSU_INSURER_IDS.forEach(el => {
				switch(el) {
					case 10: {
						this.nationalGetPremium();
						break;
					}
					case 18: {
						this.newindiaRolloverPremium();
						break;
					}
					default: {
					  //statements;
					  break;
					}
				}
			});
		}
		if(this.quoteJson.premium_type=="SAOD")
		{
			this.bajajODRolloverPremium();
			this.digitODRolloverPremium();
			this.iciciodPremium();
			this.cholaODRolloverPremium();
			this.odiffcoGetPremium();


		}
	}

	callTpServices()
	{
		let premiumData;
		this.subscribeList.add(
			this.apiService.getPremium(this.quoteJson).subscribe(data => {
				if (this.prev_policy_type == 'thirdParty') {
					premiumData = data;
					if (premiumData != "" && typeof premiumData !== 'undefined') {
						try {
							let premiumJson = (premiumData);
							this.parsePremiumJson(premiumJson);
						}
						catch (e) {
							return;
						}
					}
				}
			})

		);
		this.SELECT_PREMIUM_TYPE = 2;
		if (this.IS_LIVE == 2)
		{

			this.localStorage.getItem('userJson').subscribe((data: any) => {
				if (data != null)
				{
					if (data.role_type == '20')
					{
						//this.sompoTPPremium();
						this.getTpPriorityIds(); // kyccode
						this.walletTPRetailerServiceCall();
					}
					else  if(data!=null && this.B2B_AND_B2C_USER_TYPE.includes(+data.role_type))
					{
						this.quoteJson.b2b	=data.optionB2B;

						this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() =>
						{
							if(this.quoteJson.b2b && this.quoteJson.b2b==1)
							{
								this.walletTPRetailerServiceCall();
							}
							else
							{
								this.generalTPServicecall();
							}
						});
					}
				}
				else
				{
					this.priorityWiseTPServicecall();
					this.tpIciciGetPremium();
					this.tpHDFCGetPremium(); // Online
					this.sompoTPPremium(); // Online
					// this.nationalTPPremium(); // Online
					this.offlineGetTPPremium(13);  // ROYAL OFFLINE
				}

				if((data!=null && (data.user_code== '101597' || data.user_code=="100086" || data.role_type== '4')))
				{
					this.generalOFFLineTPServicecall();
				}
			});
		}
		else
		{
			this.offlineGetTPPremium(13);  // ROYAL OFFLINE
			this.tpIciciGetPremium();
			this.tpMagmaGetPremium();
			this.tpCholaGetPremium();
			this.kotakTPPremium();
			this.tpFutureGetPremium();
			this.tpiffcoGetPremium();
			// this.tpBajajGetPremium();
			this.localStorage.getItem('userJson').subscribe((data: any) => {
				if (data != null)
				{
					if (data.role_type == '20')
					{
						this.walletTPRetailerServiceCall();
					}
					else  if(data!=null && this.B2B_AND_B2C_USER_TYPE.includes(+data.role_type))
					{
						this.quoteJson.b2b	=data.optionB2B;

						this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() =>
						{
							if(this.quoteJson.b2b && this.quoteJson.b2b==1)
							{
								this.walletTPRetailerServiceCall();
							}
							else
							{
								this.generalTPServicecall();
							}
						});
					}
				}
				else
				{
					this.priorityWiseTPServicecall();

					this.tpHDFCGetPremium(); // Online
					this.sompoTPPremium(); // Online
					this.nationalTPPremium(); // Online
					this.tpDhflGetPremium();
				}

			});
		}
	}
	walletTPRetailerServiceCall()
	{
		this.showOnlyRoyal =1;
		this.tpDigitGetCDPremium(); // Online
		this.hdfcGetTPCDPremium(); // Online
		this.nationalTPPremium(1); // Online;
		this.tpBajajGetPremium(1);

		if(this.isNewRetailer==0){
			this.tpFutureGetPremium(); // Online
			// this.tpBajajGetPremium(1); // Online
			this.tpIciciGetPremium();
		}
		this.offlineGetTPPremium(13);  // ROYAL OFFLINE
		if (this.IS_LIVE == 2)
		{
			if(this.isNewRetailer==0){
				this.tpRelianceGetPremium(); // Online
				this.tpNewIndiaGetPremium(); // Offline
			}
		}
		else
		{
			this.tpRelianceGetCDPremium();
			this.tpNewIndiaGetPremium(); // Offline
		}
	}
	generalTPServicecall()
	{
		this.offlineGetTPPremium(13);  // ROYAL OFFLINE
		this.tpDigitGetPremium(); // Online
		this.tpHDFCGetPremium(); // Online
		this.nationalTPPremium(); // Online;
		this.tpFutureGetPremium(); // Online
		this.tpBajajGetPremium(); // Online
		this.tpRelianceGetPremium(); // Online
		this.tpIciciGetPremium();
		this.kotakTPPremium(); // Online
		this.tpiffcoGetPremium()// Online
		//this.tpCholaGetPremium();
	}
	generalOFFLineTPServicecall()
	{
		this.tpMagmaGetPremium(); // Offline
		this.tpCholaGetPremium(); // Offline
		this.tpTataAIGGetPremium(); // Offline
	}

	priorityWiseTPServicecall()
	{
		let sendDataTP:any	={};
		sendDataTP.car_id	=this.quoteJson.car_id;
		sendDataTP.rto_code	=this.quoteJson.rto_code;
		sendDataTP.policy_sub_type	=2;
		this.apiService.TP_NON_PSU_INSURER_IDS.sort((a, b) => a - b);

		this.apiService.getPriorityData(sendDataTP).subscribe(pririty_list_tp_data => {
			let final_insurer_tp_ids;
			let priority_tp_arr	=[];
			this.priorityData.priority_arr	=[];
			if( pririty_list_tp_data!='' ){
				let priority_tp_data:any	=(pririty_list_tp_data);
				if( priority_tp_data.insurer_id && priority_tp_data.insurer_id.length>0 ){
					this.priorityData.show_com_all	=true;
					priority_tp_data.insurer_id.forEach(el => {
						priority_tp_arr.push(parseInt(el));
					});
				}
				final_insurer_tp_ids = priority_tp_arr.concat(this.apiService.TP_NON_PSU_INSURER_IDS.filter(x => priority_tp_arr.every(y => y !== x)));
			}
			else{
				final_insurer_tp_ids = priority_tp_arr.concat(this.apiService.TP_NON_PSU_INSURER_IDS.filter(x => priority_tp_arr.every(y => y !== x)));
			}
			this.priorityData.priority_arr	=priority_tp_arr;
			// INSURER WISE SERVICE CALL
			this.callMatchItemWiseTPService(final_insurer_tp_ids);
		},(error) =>{
			// console.log('Error occured');
		});

	}

	async callMatchItemWiseTPService(final_insurer_ids)
	{
		for(let i=0; i< final_insurer_ids.length; i++)
		{
			let el = final_insurer_ids[i];

			switch(el) {
				case 2: {
					this.tpBajajGetPremium();
					break;
				}
				case 4: {
					this.tpCholaGetPremium();
					break;
				}
				case 5: {
					this.tpFutureGetPremium();
					break;
				}
				case 6: {
					this.tpHDFCGetPremium();
					break;
				}
				case 8: {
					this.tpiffcoGetPremium();
					break;
				}
				case 12: {
					this.tpRelianceGetPremium();
					break;
				}
				case 28: {
					this.kotakTPPremium();
					break;
				}
				case 29: {
					this.tpDigitGetPremium();
					break;
				}
				default: {
				  //statements;
				  break;
				}
			}
			await this.timer(1000);
		}

		// PSU SERVICE CALL
		let TP_PSU_INSURER_IDS	=this.apiService.TP_PSU_INSURER_IDS.sort((a, b) => a - b);
		TP_PSU_INSURER_IDS.forEach(el => {
			switch(el) {
				case 10: {
					this.nationalTPPremium();
					break;
				}
				default: {
				  //statements;
				  break;
				}
			}
		});
	}

	//kyccode
	getTpPriorityIds(){
		let sendDataTP:any	={};
		sendDataTP.car_id	=this.quoteJson.car_id;
		sendDataTP.rto_code	=this.quoteJson.rto_code;
		sendDataTP.policy_sub_type	=2;
		this.apiService.TP_NON_PSU_INSURER_IDS.sort((a, b) => a - b);

		this.apiService.getPriorityData(sendDataTP).subscribe(pririty_list_tp_data => {
			let final_insurer_tp_ids;
			let priority_tp_arr	=[];
			this.priorityData.priority_arr	=[];
			if( pririty_list_tp_data!='' ){
				let priority_tp_data:any	=(pririty_list_tp_data);
				if( priority_tp_data.insurer_id && priority_tp_data.insurer_id.length>0 ){
					this.priorityData.show_com_all	=true;
					priority_tp_data.insurer_id.forEach(el => {
						priority_tp_arr.push(parseInt(el));
					});
				}
				final_insurer_tp_ids = priority_tp_arr.concat(this.apiService.TP_NON_PSU_INSURER_IDS.filter(x => priority_tp_arr.every(y => y !== x)));
			}
			else{
				final_insurer_tp_ids = priority_tp_arr.concat(this.apiService.TP_NON_PSU_INSURER_IDS.filter(x => priority_tp_arr.every(y => y !== x)));
			}
			this.priorityData.priority_arr	=priority_tp_arr;
		},(error) =>{
			// console.log('Error occured');
		});
	}
	getpriorityWiseComIds(){
		let sendData:any	={};
		sendData.car_id	=this.quoteJson.car_id;
		sendData.rto_code	=this.quoteJson.rto_code;
		sendData.policy_sub_type	=this.quoteJson.form_premium_type;

		this.apiService.COM_NON_PSU_INSURER_IDS.sort((a, b) => a - b);

		this.apiService.getPriorityData(sendData).subscribe(pririty_list_data => {
			let final_insurer_ids;
			let priority_arr	=[];
			this.priorityData.priority_arr	=[];

			if( pririty_list_data!='' ){
				let priority_data:any	=(pririty_list_data);
				if( priority_data.insurer_id && priority_data.insurer_id.length>0 ){
					this.priorityData.show_com_all	=true;
					priority_data.insurer_id.forEach(el => {
						priority_arr.push(parseInt(el));
					});
				}
				final_insurer_ids = priority_arr.concat(this.apiService.COM_NON_PSU_INSURER_IDS.filter(x => priority_arr.every(y => y !== x)));
			}
			else{
				final_insurer_ids = priority_arr.concat(this.apiService.COM_NON_PSU_INSURER_IDS.filter(x => priority_arr.every(y => y !== x)));
			}
			this.priorityData.priority_arr	=priority_arr;

		},(error) =>{
			// console.log('Error occured');
		});
	}
	//kyccode



	premiumBreakup(premiumItem)
	{
		// console.log('qqqqq--->'+JSON.stringify(premiumItem))
		this.premiumBreakupJson = [];
		this.premiumBreakupJson.push(premiumItem);
	}

	generateModifyQuoteForm() {
		this.quoteModifyForm = this.fb.group({
			modifyExpiryDate: ['', [Validators.required]],
			modifyRegistrationDate: [''],
			modifyManufacDateMM: [''],
			modifyManufacDateYY: [''],
			prev_policy_type: ['Comprehensive'],
			lastClaim: ['0'],
			prevInsurerID: ['0'],
			new_ncb: ['']
		});


		this.quoteModifyForm.valueChanges.subscribe(val => {

			this.isModifyFormChange = true;
			this.provider_id=val.prevInsurerID;
			this.quoteJson.prev_insurer=this.provider_id;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });

		});
		this.quoteModifyLeftForm = this.fb.group({
			customIDV: ['1'],
			modifyIDV: ['0'],
			isClaimed: ['0'],
			modifyNCB: ['0'],
			modifyDiscount: ['0'],
		});
		this.Vdiscount = this.fb.group({
			vdeduct: [''],
			member: [''],
			antiTheftDevice: ['']
		});
	}
	updateRegDate(event) {

		var reg_year = event.target.value.getUTCFullYear();
		var reg_month = event.target.value.getUTCMonth();
		var reg_day = event.target.value.getUTCDate();
		this.quoteJson.minExpDate = new Date(reg_year+1, reg_month, reg_day);
		let manufactureYear = parseInt(reg_year);
		let currYear = new Date().getFullYear();
		let yearSpan = 0;
		let new_ncb = 0;
		let prev_ncb = 0;
		  if (this.last_claim == 0) {
			yearSpan = currYear - manufactureYear;
		  }
		  else {
			yearSpan = currYear - manufactureYear + 1;
		  }

		  switch (yearSpan) {
			case 0: new_ncb = 0; prev_ncb = 0; break;
			case 1: new_ncb = 20; prev_ncb = 0; break;
			case 2: new_ncb = 25; prev_ncb = 20; break;
			case 3: new_ncb = 35; prev_ncb = 25; break;
			case 4: new_ncb = 45; prev_ncb = 35; break;
			case 5: new_ncb = 50; prev_ncb = 45; break;
		  }
		if (yearSpan > 5) {
			new_ncb = 50;
			prev_ncb = 50;
		}
		this.quoteJson.new_ncb=new_ncb;
		this.quoteJson.prev_ncb=prev_ncb;
		this.new_ncb=new_ncb;
		this.prev_ncb=prev_ncb;

		let new_ncb_array = [];
		this.ncb_array = [0,20,25,35,45,50];
		for (var val of this.ncb_array) {
			if(val <= this.prev_ncb)
			{
				new_ncb_array.push(val);

			}
		}
		this.ncb_array = new_ncb_array;
	}
	showDivCustomIDV(bool) {
		if (bool)
		{
			this.cIDV = '';
			this.selectIDV = '1';
			this.quoteJson.modifyIDV = 0;
			this.quoteJson.idv = 0;
		}
		else {

			this.selectIDV = '2';
			this.quoteJson.idv = this.modifyIDV;
			this.quoteJson.modifyIDV = this.modifyIDV;
		}
		this.showCustomIDV = bool;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}
	quoteModifyLeftSubmit()
	{

		if (this.quoteModifyLeftForm.invalid) {
			return;
		}
		this.quoteJson.showCustomIDV = this.showCustomIDV;
		if(this.selectIDV == '1'){
			this.showCustomIDV = false;
			this.quoteJson.idv = 0;
		    this.quoteJson.modifyIDV = 0;
		}
		else
		{
			this.showCustomIDV = true;
			if(this.modifyIDV < this.minIDV  && this.customDiscount==false)
			{
				this.idvRangeError = true;
				return;
			}
			else if(this.modifyIDV > this.maxIDV  && this.customDiscount==false)
			{
				this.idvRangeError = true;
				return;
			}
			else
			{
				this.idvRangeError = false;
				this.quoteJson.idv = this.modifyIDV;
				this.quoteJson.modifyIDV = this.modifyIDV;
			}
		}
		this.quoteJson.cDiscount = this.cDiscount;

		this.quoteJson.zero_dept_amt = this.zeroDepAmt;
		this.quoteJson.zero_dept_per = this.zeroDepPerc;

		this.quoteJson.rsa_amt = this.rsaAmt;
		//this.quoteJson.rsa_per = this.rsaPerc;

		this.quoteJson.engine_amt = this.engineAmt;
		this.quoteJson.engine_perc = this.enginePerc;

		this.quoteJson.ncb_prot_amt = this.ncbAmt;
		this.quoteJson.ncb_prot_perc = this.ncbPerc;

		this.quoteJson.keylock_replace_amt = this.keylockAmt;
		this.quoteJson.keylock_replace_perc = this.keylockPerc;

		this.quoteJson.consumable_amt = this.consumableAmt;
		this.quoteJson.consumable_perc = this.consumablePerc;

		this.quoteJson.invoice_amt = this.invoiceAmt;
		this.quoteJson.invoice_perc = this.invoicePerc;


		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() =>
		{
			this.loader = true;
			this.startTimer(20);
			this.updateQuoteData();
			this.callPremiumApiService();
			this.onNoClick();
		});
	}
	get modifyRegistrationDate() {
		return this.quoteModifyForm.get('modifyRegistrationDate');
	}
	populateModifyQuoteForm()
	{
		this.last_claim = this.quoteJson.lastClaim;
		this.registration_date_text = this.quoteJson.registration_date_text;
		let ped = this.quoteJson.pre_policy_expiry_date;
		let previous_policy_exp_date = ped.month + '/' + ped.day + '/' + ped.year;
		this.pre_policy_expiry_date = new Date(previous_policy_exp_date);
		let ped_month = this.pre_policy_expiry_date.toLocaleString('default', { month: 'short' });
		this.pre_policy_expiry_date_text = ped.day + ' ' + ped_month + ' ' + ped.year;
		if (this.last_claim == 0)
		{
			this.claim_Previous_Policy = 'No';
		}
		else
		{
			this.claim_Previous_Policy = 'Yes';
		}
		if (this.quoteJson.is_renewal != '0')
		{
			let modifyRegistrationDate: string = this.quoteJson.registration_date.month + '-' + this.quoteJson.registration_date.day + '-' + this.quoteJson.registration_date.year;

			this.quoteModifyForm.setValue({ modifyRegistrationDate: new Date(modifyRegistrationDate), modifyExpiryDate: new Date(this.pre_policy_expiry_date), modifyManufacDateMM: this.quoteJson.manufacture_date.month, modifyManufacDateYY: this.quoteJson.manufacture_date.year, lastClaim: this.quoteJson.contactFormDetails.lastClaim, prev_policy_type: 'Comprehensive',new_ncb:this.new_ncb,prevInsurerID:this.quoteJson.prev_insurer});
		}
		else
		{
			let curr_date = new Date();
			let d = curr_date.getDate();
			let m = curr_date.getMonth() + 1;
			let month = curr_date.toLocaleString('default', { month: 'short' });
			let y = curr_date.getFullYear();

			let modifyRegistrationDate: string = m + '-' + d + '-' + y;

			this.quoteModifyForm.setValue({ modifyRegistrationDate: new Date(modifyRegistrationDate), modifyExpiryDate: new Date(this.pre_policy_expiry_date), modifyManufacDateMM: this.quoteJson.manufacture_date.month, modifyManufacDateYY: this.quoteJson.manufacture_date.year, lastClaim: this.quoteJson.contactFormDetails.lastClaim, prev_policy_type: 'Comprehensive',new_ncb:this.new_ncb,prevInsurerID:this.quoteJson.prev_insurer});
		}
		this.new_ncb = this.quoteJson.new_ncb;
		this.prev_ncb = this.quoteJson.prev_ncb;


		var reg_year = this.quoteJson.registration_date.year;

		let manufactureYear = parseInt(reg_year);
		let currYear = new Date().getFullYear();
		let yearSpan = 0;
		let new_ncb = 0;
		let prev_ncb = 0;
		  if (this.last_claim == 0) {
			yearSpan = currYear - manufactureYear;
		  }
		  else {
			yearSpan = currYear - manufactureYear + 1;
		  }

		  switch (yearSpan) {
			case 0: new_ncb = 0; prev_ncb = 0; break;
			case 1: new_ncb = 20; prev_ncb = 0; break;
			case 2: new_ncb = 25; prev_ncb = 20; break;
			case 3: new_ncb = 35; prev_ncb = 25; break;
			case 4: new_ncb = 45; prev_ncb = 35; break;
			case 5: new_ncb = 50; prev_ncb = 45; break;
		  }
		if (yearSpan > 5) {
			new_ncb = 50;
			prev_ncb = 50;
		}
		let new_ncb_array = [];
		this.ncb_array = [0,20,25,35,45,50];
		for (var val of this.ncb_array) {
			if(val <= prev_ncb)
			{
				new_ncb_array.push(val);

			}
		}
		this.ncb_array = new_ncb_array;
		this.fuel_type = this.quoteJson.fuel_type_text;
		this.rtoText = this.quoteJson.rtoText;
		this.isModifyFormChange = false;
	}
	changeNCB(modifyVal) {
		this.isModifyFormChange =true;
		this.prev_ncb = modifyVal;
		this.quoteJson.prev_ncb = modifyVal;
		var modify_Str=modifyVal.toString();
		let new_ncb = 0;
		switch (modify_Str) {
			case '0': new_ncb = 20; break;
			case '20': new_ncb = 25; break;
			case '25': new_ncb = 35; break;
			case '35': new_ncb = 45; break;
			case '45': new_ncb = 50; break;
			case '50': new_ncb = 50; break;
		}
		this.new_ncb = new_ncb;
		this.quoteJson.new_ncb =new_ncb;
		this.quoteModifyForm.get('new_ncb').setValue(this.new_ncb);
	}
	changePrevInsurer(v)
	{
		if(v == 0)
		{
			this.same_provider=0;
		}
		else
		{
			this.same_provider=1;
		}

		this.quoteModifyForm.get('prevInsurerID').setValue(v);
	}
	changePastClaim(v)
	{
		this.isModifyFormChange =true;
		if (v == 0) {
			this.last_claim = v;
			this.claim_Previous_Policy = 'No';
		}
		else {
			this.last_claim = v;
			this.claim_Previous_Policy = 'Yes';
		}
		this.quoteModifyForm.get('lastClaim').setValue(v);

		let modifyData = this.quoteModifyForm.value;
		var reg_year = modifyData.modifyRegistrationDate.getFullYear();

		let manufactureYear = parseInt(reg_year);
		let currYear = new Date().getFullYear();
		let yearSpan = 0;
		let new_ncb = 0;
		let prev_ncb = 0;
		if (this.last_claim == 0)
		{
			yearSpan = currYear - manufactureYear;
		}
		else
		{
			yearSpan = currYear - manufactureYear + 1;
		}
		switch (yearSpan)
		{
			case 0: new_ncb = 0; prev_ncb = 0; break;
			case 1: new_ncb = 20; prev_ncb = 0; break;
			case 2: new_ncb = 25; prev_ncb = 20; break;
			case 3: new_ncb = 35; prev_ncb = 25; break;
			case 4: new_ncb = 45; prev_ncb = 35; break;
			case 5: new_ncb = 50; prev_ncb = 45; break;
		}
		if (yearSpan > 5) {
			new_ncb = 50;
			prev_ncb = 50;
		}
		this.quoteJson.new_ncb=new_ncb;
		this.quoteJson.prev_ncb=prev_ncb;
		this.new_ncb=new_ncb;
		this.prev_ncb=prev_ncb;

		let new_ncb_array = [];
		this.ncb_array = [0,20,25,35,45,50];
		for (var val of this.ncb_array) {
			if(val <= this.prev_ncb)
			{
				new_ncb_array.push(val);

			}
		}
		this.ncb_array = new_ncb_array;
	}
	changePrevPolicyType_reg_popup(policyType) {
		this.isModifyFormChange =true;
		this.prev_policy_type_reg_popup = policyType;
		if(policyType=='C')
		{
			this.prev_policy_type = "Comprehensive";
			this.quoteJson.pre_policy_type="COMPREHENSIVE";
		}
		else
		{
			this.prev_policy_type = "thirdParty";
			this.quoteJson.pre_policy_type="THIRDPARTY";
		}
	}
	changePrevPolicyType(v, yr = null)
	{
		this.premiumJson = [];
		this.premiumJsonTemp = [];
		this.loader = true;
		this.startTimer(20);
		this.prev_policy_type = v;
		this.apiService.getPremium(this.quoteJson)
		// this.onNoClick()
		if (v == 'ThirdParty')
		{
			//this.thirdPartyCover[1].isChecked = true;
			this.isThirdParty = true;
			this.quoteJson.isThirdParty = true;
			this.prev_policy_type = 'ThirdParty';
			this.quoteJson.thirdPartyAddon = [
				{ paid_Cover_Driver: false },
				{ owner_Driver_Cover: false },
				{ unnamed_Passenger_PA_cover: false }
			];
			this.quoteJson.premium_type = "TP";
			this.quoteJson.pre_policy_type="COMPREHENSIVE";
			// this.callTpServices()
			// this.apiService.getPremium(this.quoteJson)
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe((data) => {
				this.callPremiumApiService();
			});
		}
		else if (v == 'SAOD')
		{
			this.quoteJson.isThirdParty = false;
			this.SELECT_PREMIUM_YEAR = yr;
			this.isThirdParty = false;
			this.comprehensive = true;
			this.countResultPremium = 0;
			this.quoteJson.premium_type = "SAOD";
			// this.apiService.getPremium(this.quoteJson)
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe((data) => {
				this.callPremiumApiService();
			});
		}
		else
		{
			//this.thirdPartyCover[1].isChecked = false;
			this.quoteJson.isThirdParty = false;
			this.SELECT_PREMIUM_YEAR = yr;
			this.isThirdParty = false;
			this.comprehensive = true;
			this.countResultPremium = 0;
			this.quoteJson.premium_type = "COM";
			// this.apiService.getPremium(this.quoteJson)
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe((data) => {
				this.callPremiumApiService();
			});
		}
		this.onNoClick();
	}

	homepage()
	{
		this.router.navigate(['/']);
		// this.localStorage.getItem('userJson').subscribe((data: any) => {
		// 	if (data != null) {
		// 		if(data.role_type.toString()=="16" || data.role_type.toString()=="8")
		// 		{
		// 			// window.location.href=this.apiService.getDomainURL();;
		// 			window.location.href=this.BASEURL;
		// 		}
		// 		else
		// 		{
		// 			window.location.href=this.BASEURL;
		// 		}
		// 	}
		// 	else
		// 	{
		// 		window.location.href=this.BASEURL;
		// 	}
		// });
	}
	quoteModifySubmit()
	{
		if (this.quoteModifyForm.invalid)
		{
			return;
		}
		let modifyData = this.quoteModifyForm.value;
		let month = modifyData.modifyRegistrationDate.toLocaleString('default', { month: 'short' });
		this.registration_date_text = modifyData.modifyRegistrationDate.getDate() + ' ' + month + ' ' + modifyData.modifyRegistrationDate.getFullYear();
		this.pre_policy_expiry_date = (modifyData.modifyExpiryDate.getMonth() + 1) + '-' + modifyData.modifyExpiryDate.getDate() + '-' + modifyData.modifyExpiryDate.getFullYear();


		let month1 = modifyData.modifyExpiryDate.toLocaleString('default', { month: 'short' });
		this.pre_policy_expiry_date_text = modifyData.modifyExpiryDate.getDate() + ' ' + month1 + ' ' + modifyData.modifyExpiryDate.getFullYear();

		var manufac_date = new Date(modifyData.modifyManufacDateMM+"/01/"+modifyData.modifyManufacDateYY);
		var register_date = new Date(modifyData.modifyRegistrationDate.getMonth() + 1+"/"+modifyData.modifyRegistrationDate.getDate()+"/"+modifyData.modifyRegistrationDate.getFullYear());

		if(manufac_date.getTime() > register_date.getTime())
		{
			this.showErrorModifyModalMsg =true;
			return;
		}
		else
		{
			this.quoteJson.manufacture_date = { year: modifyData.modifyManufacDateYY, month: modifyData.modifyManufacDateMM, day: 1 };
			this.quoteJson.registration_date = { year: modifyData.modifyRegistrationDate.getFullYear(), month: (modifyData.modifyRegistrationDate.getMonth() + 1), day: modifyData.modifyRegistrationDate.getDate() };
			this.quoteJson.pre_policy_expiry_date = { year: modifyData.modifyExpiryDate.getFullYear(), month: (modifyData.modifyExpiryDate.getMonth() + 1), day: modifyData.modifyExpiryDate.getDate() };

			this.showErrorModifyModalMsg =false;
			this.quoteJson.registration_date_text = this.registration_date_text;
			this.quoteJson.new_ncb = this.new_ncb;
			this.quoteJson.prev_ncb = this.prev_ncb;
			this.quoteJson.lastClaim = this.last_claim;
			this.quoteJson.prev_insurer = modifyData.prevInsurerID;


			if(this.last_claim==1){
				this.quoteJson.new_ncb=0;
				this.quoteJson.prev_ncb=0;
				this.new_ncb=0;
				this.prev_ncb=0;
			}
			if(this.isModifyFormChange)
			{
				this.quoteJson.modifyCarInfo=true;

				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
					this.startTimer(20);
					this.updateQuoteData();
					this.callPremiumApiService();
					this.loader = true;
					this.onNoClick();
				});
			}
			else
			{
				if(this.comfromBuyBtn)
				{
					this.quoteJson.modifyCarInfo=true;
					// console.log('this.thirdPartyCover',this.thirdPartyCover);
					this.localStorage.setItem('thirdPartyCover', this.thirdPartyCover).subscribe(() => {
						this.buyNow(this.buyTempPremiumitem,this.buyTempIndex);
					});
				}
			}

			this.comfromBuyBtn = false;
			this.onNoClick();
		}
	}

	toggle1() {
		this.show1 = !this.show1;
		// CHANGE THE NAME OF THE BUTTON.
		if (this.show1)
			this.popupshow = "Hide all";
		else
			this.popupshow = "View all";
	}
	toggle2() {
		this.show2 = !this.show2;
		// CHANGE THE NAME OF THE BUTTON.
		if (this.show2)
			this.panelshow = "";
		else
			this.panelshow = "";
	}
	onNoClick(redirect='') {
		this.dialogRef.close();
		if(redirect!=''){
			this.navigateURL(redirect);
		}

	}


	// This function made by Sitansu

	showSpecialAddon(v,bool)
	{

		if(v == 0){
			if(bool == false){
				this.special_zero_dep_type='A';

			}else{
				this.special_zero_dep_type='P';

			}
		}
		if(v == 1){
			if(bool == false){
				this.special_rsa_type='A';

			}else{
				this.special_rsa_type='P';

			}
		}
		if(v == 2){
			if(bool == false){
				this.special_engine_type='A';

			}else{
				this.special_engine_type='P';

			}
		}
		if(v == 3){
			if(bool == false){
				this.special_ncb_type='A';

			}else{
				this.special_ncb_type='P';

			}
		}
		if(v == 4){
			if(bool == false){
				this.special_keylock_type='A';

			}else{
				this.special_keylock_type='P';

			}
		}
		if(v == 5){
			if(bool == false){
				this.special_consumable_type='A';

			}else{
				this.special_consumable_type='P';

			}
		}
		if(v == 7){
			if(bool == false){
				this.special_invoice_type='A';

			}else{
				this.special_invoice_type='P';

			}
		}

	}
	// This function made by Sitansu
	onInputChangeAddon(event){

		if(event.target.name== "zeroDepPerc"){
			var value = event.target.value;
			this.zeroDepPerc = (value/100).toFixed(2);
			this.zeroDepAmt= 0;
		}
		if(event.target.name== "zeroDepAmt"){
			var value = event.target.value;

			this.zeroDepAmt= value;
			this.zeroDepPerc =0;
		}
		// if(event.target.name== "rsaPerc"){
		// 	var value = event.target.value;
		// 	this.rsaPerc = value;
		// 	this.rsaAmt= 0;
		// }
		if(event.target.name== "rsaAmt"){
			var value = event.target.value;

			this.rsaAmt= value;
			this.rsaPerc =0;
		}
		if(event.target.name== "enginePerc"){
			var value = event.target.value;
			this.enginePerc = (value/100).toFixed(2);
			this.engineAmt= 0;
		}
		if(event.target.name== "engineAmt"){
			var value = event.target.value;

			this.engineAmt= value;
			this.enginePerc =0;
		}

		if(event.target.name== "ncbPerc"){
			var value = event.target.value;
			this.ncbPerc = (value/100).toFixed(2);
			this.ncbAmt= 0;
		}
		if(event.target.name== "ncbAmt"){
			var value = event.target.value;

			this.ncbAmt= value;
			this.ncbPerc =0;
		}
		if(event.target.name== "keylockPerc"){
			var value = event.target.value;
			this.keylockPerc = (value/100).toFixed(2);
			this.keylockAmt= 0;
		}
		if(event.target.name== "keylockAmt"){
			var value = event.target.value;

			this.keylockAmt= value;
			this.keylockPerc =0;
		}

		if(event.target.name== "consumablePerc"){
			var value = event.target.value;
			this.consumablePerc = (value/100).toFixed(2);
			this.consumableAmt= 0;
		}
		if(event.target.name== "consumableAmt"){
			var value = event.target.value;

			this.consumableAmt= value;
			this.consumablePerc =0;
		}
		if(event.target.name== "invoicePerc"){
			var value = event.target.value;
			this.invoicePerc = (value/100).toFixed(2);
			this.invoiceAmt= 0;
		}
		if(event.target.name== "invoiceAmt"){
			var value = event.target.value;

			this.invoiceAmt= value;
			this.invoicePerc =0;
		}

	}


	hdfcGetNewPremium() {
		let primiumString;
		if (this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV != '0') {
			this.quoteJson.idv = this.minHdfcIDV;
		}
		else if (this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV != '0') {
			this.quoteJson.idv = this.maxHdfcIDV;
		}
		else {
			this.quoteJson.idv = this.modifyIDV;
		}
		let premiumData; var providerID = 6; var PREMIUM_TYPE = 0;

		this.quoteJson.paid_driver = 1;
		this.subscribeList.add(
			this.apiService.hdfcNewgetPremium(this.quoteJson, this.form_premium_type).subscribe(data => {
				premiumData = data;
				primiumString = premiumData.data;
				this.parsePremiumJson(primiumString);
			})
		);
	}
	hdfcGetRolloverCDPremium()
	{
		let primiumString;
		if (this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV != '0') {
			this.quoteJson.idv = this.minHdfcIDV;
		}
		else if (this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV != '0') {
			this.quoteJson.idv = this.maxHdfcIDV;
		}
		else {
			this.quoteJson.idv = this.modifyIDV;
		}

		let premiumData;
		this.subscribeList.add(
			this.apiService.getHDFCCDPremium(this.quoteJson, this.form_premium_type).subscribe(data => {

				premiumData = data;
				primiumString = premiumData.data;
				//// console.log('hdfc str:',primiumString);
				this.parsePremiumJson(primiumString);
			})
		);
	}
	hdfcGetRolloverPremium() {
		let primiumString;
		if (this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV != '0') {
			this.quoteJson.idv = this.minHdfcIDV;
		}
		else if (this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV != '0') {
			this.quoteJson.idv = this.maxHdfcIDV;
		}
		else {
			this.quoteJson.idv = this.modifyIDV;
		}

		let premiumData;
		this.subscribeList.add(
			this.apiService.hdfcgetrollPremium(this.quoteJson, this.form_premium_type).subscribe(data => {
				/*
				if(data!=''){
					premiumData = JSON.parse(data);
					primiumString = premiumData.data;
					console.log('hdfc str:',primiumString);
					this.parsePremiumJson(primiumString);
				}
				*/
				premiumData = data;
				try
				{
					primiumString = (premiumData);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}

			})
		);
	}
	relianceGetNewPremium() {
		let primiumString;
		if (this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV != '0') {
			this.quoteJson.idv = this.minRelianceIDV;
		}
		else if (this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV != '0') {
			this.quoteJson.idv = this.maxRelianceIDV;
		}
		else {
			this.quoteJson.idv = this.modifyIDV;
		}

		let premiumData; var providerID = 12; var PREMIUM_TYPE = 0;
		this.subscribeList.add(
			this.apiService.relianceNewgetPremium(this.quoteJson, this.form_premium_type).subscribe(data => {
				premiumData = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	relianceRolloverCDPremium()
	{
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV != '0') {
				this.quoteJson.idv = this.minRelianceIDV;
			}
			else if (this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV != '0') {
				this.quoteJson.idv = this.maxRelianceIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool = true;
		this.subscribeList.add(
			this.apiService.getRelianceCDPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	bajajRolloverCDPremium()
	{
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minBajajIDV && this.minBajajIDV != '0') {
				this.quoteJson.idv = this.minBajajIDV;
			}
			else if (this.modifyIDV > this.maxBajajIDV && this.maxBajajIDV != '0') {
				this.quoteJson.idv = this.maxBajajIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool = true;
		this.subscribeList.add(
			this.apiService.getBajajCDPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	futureRolloverPremium_BK()
	{
		let primiumString;
		this.recalculateBool =true;
		this.subscribeList.add(
			this.apiService.getFutureRollPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data.data;

				this.parsePremiumJson(primiumString);
			})
		);
	}
	orientalRolloverPremium()
	{
		let primiumString;
		this.recalculateBool =true;
		this.subscribeList.add(
			this.apiService.getOrientalRollPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data.data;
				this.parsePremiumJson(primiumString);
			})
		);
	}
	dhflRolloverPremium(){
		let primiumString;
		this.recalculateBool =true;
		this.subscribeList.add(
			this.apiService.getDhflRollPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data.data;
				this.parsePremiumJson(primiumString);
			})
		);
	}

	digitRolloverPremium_bk(){
		//alert('h');
		let primiumString;
		this.recalculateBool =true;
		this.subscribeList.add(
			this.apiService.getDigitRollPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data.data;
				this.parsePremiumJson(primiumString);
			})
		);
	}
	digitRolloverPremium(){
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minDigitIDV && this.minDigitIDV != '0') {
				this.quoteJson.idv = this.minDigitIDV;
			}
			else if (this.modifyIDV > this.maxDigitIDV && this.maxDigitIDV != '0') {
				this.quoteJson.idv = this.maxDigitIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.subscribeList.add(
			this.apiService.getDigitPremiumPHP(this.quoteJson, 1).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}


	sompoRolloverPremium() {
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minSompoIDV && this.minSompoIDV != '0') {
				this.quoteJson.idv = this.minSompoIDV;
			}
			else if (this.modifyIDV > this.maxSompoIDV && this.maxSompoIDV != '0') {
				this.quoteJson.idv = this.maxSompoIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.subscribeList.add(
			this.apiService.getSompoPremium(this.quoteJson, 1).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	futureRolloverPremium() {
		//alert('hi');
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minFutureIDV && this.minFutureIDV != '0') {
				this.quoteJson.idv = this.minFutureIDV;
			}
			else if (this.modifyIDV > this.maxFutureIDV && this.maxFutureIDV != '0') {
				this.quoteJson.idv = this.maxFutureIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.subscribeList.add(
			this.apiService.getFuturePremium(this.quoteJson, 1).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	newindiaRolloverPremium() {
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minNewindiaIDV && this.minNewindiaIDV != '0') {
				this.quoteJson.idv = this.minNewindiaIDV;
			}
			else if (this.modifyIDV > this.maxNewindiaIDV && this.maxNewindiaIDV != '0') {
				this.quoteJson.idv = this.maxNewindiaIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool =true;
		this.subscribeList.add(
			this.apiService.getNewIndiaPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	relianceRolloverPremium()
	{
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV != '0') {
				this.quoteJson.idv = this.minRelianceIDV;
			}
			else if (this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV != '0') {
				this.quoteJson.idv = this.maxRelianceIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool = true;
		//console.warn('Quote Data:', JSON.stringify(this.quoteJson));
		this.subscribeList.add(
			this.apiService.getReliancePremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					//console.warn('Repliance Response:', primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	magmaRolloverPremium() {
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minMagmaIDV && this.minMagmaIDV != '0') {
				this.quoteJson.idv = this.minMagmaIDV;
			}
			else if (this.modifyIDV > this.maxMagmaIDV && this.maxMagmaIDV != '0') {
				this.quoteJson.idv = this.maxMagmaIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool =true;
		this.setAddon();
		this.subscribeList.add(
			this.apiService.getMagmaPremium(this.quoteJson, 1).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);

					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}

	nationalGetPremium(cdStatus=0) {
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minNationalIDV && this.minNationalIDV != '0') {
				this.quoteJson.idv = this.minNationalIDV;
			}
			else if (this.modifyIDV > this.maxNationalIDV && this.maxNationalIDV != '0') {
				this.quoteJson.idv = this.maxNationalIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.subscribeList.add(
			this.apiService.getNationalPremium(this.quoteJson, 1,cdStatus).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	cholaGetPremium() {
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minCholaIDV && this.minCholaIDV != '0') {
				this.quoteJson.idv = this.minCholaIDV;
			}
			else if (this.modifyIDV > this.maxCholaIDV && this.maxCholaIDV != '0') {
				this.quoteJson.idv = this.maxCholaIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.subscribeList.add(
			this.apiService.getCholaPremium(this.quoteJson, 1).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	iffcoGetPremium() {
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minIffcoIDV && this.minIffcoIDV != '0') {
				this.quoteJson.idv = this.minIffcoIDV;
			}
			else if (this.modifyIDV > this.maxIffcoIDV && this.maxIffcoIDV != '0') {
				this.quoteJson.idv = this.maxIffcoIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.subscribeList.add(
			this.apiService.iffcoGetPremium(this.quoteJson, 1).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	kotakRolloverCDPremium() {

		let ddd; let primiumString;
		if (this.modifyIDV < this.minKotakIDV && this.minKotakIDV != '0')
		{
			this.quoteJson.idv = this.minKotakIDV;
		}
		else if (this.modifyIDV > this.maxKotakIDV && this.maxKotakIDV != '0')
		{
			this.quoteJson.idv = this.maxKotakIDV;
		}
		else
		{
			this.quoteJson.idv = this.modifyIDV;
		}
		this.subscribeList.add(
		// this.apiService.getKotakCDPremium(this.quoteJson, 1).subscribe((data:any) => {
		this.apiService.getKotakPremium(this.quoteJson, 1, 1).subscribe((data:any) => {

			// primiumString = data.data;
			primiumString = (data);

			this.parsePremiumJson(primiumString);
		})
		);
	}
	digitRolloverCDPremium() {

		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minDigitIDV && this.minDigitIDV != '0') {
				this.quoteJson.idv = this.minDigitIDV;
			}
			else if (this.modifyIDV > this.maxDigitIDV && this.maxDigitIDV != '0') {
				this.quoteJson.idv = this.maxDigitIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}

		// if(this.SELECT_PREMIUM_TYPE == 3)
		this.subscribeList.add(
			this.apiService.getDigitCDPremium(this.quoteJson, this.SELECT_PREMIUM_TYPE).subscribe((data:any) => {
				primiumString = data;
				try {
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				} catch(e) {
					return;
				}
			})
		);
	}

	unitedIndiaGetPremium() {
		let unitedData; let primiumString;
		this.subscribeList.add(
		this.apiService.getUnitedIndiaPremium(this.quoteJson, this.form_premium_type).subscribe(data => {
			unitedData = data;
			primiumString = unitedData.data;
			this.parsePremiumJson(primiumString);
		})
		);
	}

	
	iciciGetNewPremium() {
		let primiumString;
		if (this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV != '0') {
			this.quoteJson.idv = this.minHdfcIDV;
		} else if (this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV != '0') {
			this.quoteJson.idv = this.maxHdfcIDV;
		} else {
			this.quoteJson.idv = this.modifyIDV;
		}
		let premiumData;
		this.quoteJson.paid_driver = 1;
		this.subscribeList.add(
			this.apiService.getIciciNewPremium(this.quoteJson, this.form_premium_type).subscribe(data => {
				premiumData = data;
				console.log(data);
				
				primiumString = premiumData.data;
				this.parsePremiumJson(premiumData);
			})
		);
	}
	// CHANGE DONE BY Chandra
	iciciGetPremium() {
		let iciciData; let primiumString;
		this.subscribeList.add(
			this.apiService.getIciciPremium(this.quoteJson, this.form_premium_type).subscribe(icici_quote_response => {
				iciciData = icici_quote_response;
				try
				{
					primiumString = (iciciData);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}

	iciciodPremium_old() {
		let iciciData; let primiumString;
		this.subscribeList.add(
			this.apiService.getIciciPremium(this.quoteJson, 3).subscribe(icici_quote_response => {
				iciciData = icici_quote_response;
				//console.log(iciciData);
				try
				{
					primiumString = (iciciData);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	iciciodPremium()
	{
		let primiumString;
		this.subscribeList.add(
			this.apiService.getIciciPremium(this.quoteJson, 3).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				// console.log(data);
				try
				{

					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);


				}
				catch(e)
				{

					return;
				}
			})
		);
	}



	// CHANGE DONE BY ARIT
	offlineGetPremium(providerId:number) {
		if( providerId>0 ){
			let bhartiData;
			let primiumString;
			let quoteJson = {...this.quoteJson};
			quoteJson.providerId	=providerId;
			// this.quoteJson.providerId	=providerId;
			//// console.log('this.modifyIDV',this.modifyIDV);
			//// console.log('this.showCustomIDV',this.showCustomIDV);
			//// console.log('this.minOfflineIDV',this.minOfflineIDV);
			//// console.log('this.maxOfflineIDV',this.maxOfflineIDV);
			if (this.modifyIDV > 0 && this.showCustomIDV)
			{
				quoteJson.idv = this.modifyIDV;
				// this.quoteJson.idv = this.modifyIDV;
			}
			else {
				this.route.queryParams.subscribe(params => {
					if (params.QID != null) {

					}
					else {
						quoteJson.idv = 0;
						// this.quoteJson.idv = 0;
					}
				});
			}
			this.subscribeList.add(
			this.apiService.getOfflineRolloverPremium(quoteJson, this.form_premium_type).subscribe(bharti_quote_response => {
				bhartiData = bharti_quote_response;
				try
				{
					primiumString = (bhartiData);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
			);
		}
	}

	offlineGetTPPremium(providerId:number) {
		if( providerId>0 ){
			let bhartiData; let primiumString;
			let quoteJson = {...this.quoteJson};
			quoteJson.providerId	=providerId;
			// this.quoteJson.providerId	=providerId;
			//// console.log('this.modifyIDV',this.modifyIDV);
			//// console.log('this.showCustomIDV',this.showCustomIDV);
			//// console.log('this.minOfflineIDV',this.minOfflineIDV);
			//// console.log('this.maxOfflineIDV',this.maxOfflineIDV);
			if (this.modifyIDV > 0 && this.showCustomIDV)
			{
				quoteJson.idv = this.modifyIDV;
				// this.quoteJson.idv = this.modifyIDV;
			}
			else {
				this.route.queryParams.subscribe(params => {
					if (params.QID != null) {

					}
					else {
						quoteJson.idv = 0;
						// this.quoteJson.idv = 0;
					}
				});
			}
			this.subscribeList.add(
			this.apiService.getOfflineTPPremium(quoteJson, 2).subscribe(bharti_quote_response => {
				bhartiData = bharti_quote_response;
				try
				{
					primiumString = (bhartiData);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
			);
		}
	}

	tataRolloverPremium(){
		let primiumString;

		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minTataIDV && this.minTataIDV > 0) {
				this.quoteJson.idv = this.minTataIDV;
			}
			else if (this.modifyIDV > this.maxTataIDV && this.maxTataIDV > 0) {
				this.quoteJson.idv = this.maxTataIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool =true;
		this.setAddon();
		this.subscribeList.add(
		this.apiService.getTataRollPremium(this.quoteJson, 1).subscribe((data:any) => {
			this.recalculateBool =false;
			primiumString = data.data;

			this.parsePremiumJson(primiumString);
		})
		);
	}

	sompoTPPremium() {
		let primiumString;
		this.subscribeList.add(
		this.apiService.getSompoPremium(this.quoteJson, 2).subscribe((data:any) => {

			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}

	nationalTPPremium(cdStatus=0) {
		let primiumString;
		this.subscribeList.add(
		this.apiService.getNationalPremium(this.quoteJson, 2,cdStatus).subscribe((data:any) => {
			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}

	tpTataAIGGetPremium() {
		let tataData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpGetTataAigPremium(this.quoteJson, 2).subscribe(data => {
			tataData = data;
			if(tataData != null){
				primiumString = tataData.data;
				this.parsePremiumJson(primiumString);
			}
		})
		);
	}

	tpFutureGetPremiumBK(){
		let futureData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpGetFutureGeneralPremium(this.quoteJson, 2).subscribe(data => {
			futureData = data;
			if(futureData != null){
				primiumString = futureData.data;
				this.parsePremiumJson(primiumString);
			}
		})
		);
	}
	tpFutureGetPremium() {
		let primiumString;
		this.subscribeList.add(
		this.apiService.getFuturePremiumTP(this.quoteJson, 2).subscribe((data:any) => {

			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	tpMagmaGetPremium() {
		let magmaData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpGetMagmaPremium(this.quoteJson, 2).subscribe(data => {
			magmaData = data;
			if(magmaData != null){
				primiumString = magmaData.data;
				this.parsePremiumJson(primiumString);
			}
		})
		);
	}
	tpCholaGetPremium()
	{

		let cholaData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpGetCholaPremium(this.quoteJson, 2).subscribe(data => {

			// cholaData = data;

			// if(cholaData != null){
			// 	primiumString = cholaData.data;
			// 	console.log("Chola data",  cholaData.data);
			// 	this.parsePremiumJson(primiumString);
			// }
			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	cholaODRolloverPremium()
	{
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minCholaIDV && this.minCholaIDV != '0') {
				this.quoteJson.idv = this.minCholaIDV;
			}
			else if (this.modifyIDV > this.maxCholaIDV && this.maxCholaIDV != '0') {
				this.quoteJson.idv = this.maxCholaIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool = true;
		this.subscribeList.add(
			this.apiService.cholaGetRollPremium(this.quoteJson, 3).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	cholaGetNewPremium(){
		let primiumString;
		if (this.modifyIDV < this.minHdfcIDV && this.minHdfcIDV != '0') {
			this.quoteJson.idv = this.minHdfcIDV;
		} else if (this.modifyIDV > this.maxHdfcIDV && this.maxHdfcIDV != '0') {
			this.quoteJson.idv = this.maxHdfcIDV;
		} else {
			this.quoteJson.idv = this.modifyIDV;
		}
		let premiumData;
		this.quoteJson.paid_driver = 1;
		this.subscribeList.add(
			this.apiService.getCholaNewPremium(this.quoteJson, this.form_premium_type).subscribe(data => {
				premiumData = data;
				console.log(data);
				
				primiumString = premiumData.data;
				this.parsePremiumJson(premiumData);
			})
		);
	}
	sriRamGetPremium() {
		let sriramData; let primiumString;
		this.subscribeList.add(
		this.apiService.getSriRamPremium(this.quoteJson, this.form_premium_type).subscribe(data => {

			sriramData = data;
			primiumString = sriramData.data;
			this.parsePremiumJson(primiumString);
		})
		);
	}
	tpNationalGetPremium() {
		let nationalData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpNationalGetPremium(this.quoteJson, 2).subscribe(data => {
			nationalData = data;
			primiumString = nationalData.data;
			this.parsePremiumJson(primiumString);
		})
		);
	}
	tpNewIndiaGetPremium() {
		let newIndiaData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpNewIndiaGetPremium(this.quoteJson, 2).subscribe(data => {

			newIndiaData = data;
			primiumString = newIndiaData.data;
			this.parsePremiumJson(primiumString);
		})
		);
	}
	tpHDFCGetPremium() {
		let hdfcdata; let primiumString;
		this.subscribeList.add(
		this.apiService.tpHDFCGetPremium(this.quoteJson, 2, 0).subscribe(data => {
			//// console.log("HDFC TP DATA");
			hdfcdata = data;
			try
			{
				primiumString = (hdfcdata);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	tpDhflGetPremium(){
		let dhflData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpGetDhflPremium(this.quoteJson, 2).subscribe(data => {
			dhflData = data;
			if(dhflData != null){
				primiumString = dhflData.data;
				this.parsePremiumJson(primiumString);
			}
		})
		);
	}
	tpDigitGetPremiumBk(){
		let dhflData; let primiumString;
		this.subscribeList.add(
		this.apiService.tpGetDigitPremium(this.quoteJson, 2).subscribe(data => {
			dhflData = data;
			//// console.log('digit data===>',dhflData);
			if(dhflData != null){
				primiumString = dhflData.data;
				this.parsePremiumJson(primiumString);
			}
		})
		);
	}
	tpDigitGetPremium() {
		let primiumString;
		this.subscribeList.add(
		this.apiService.getDigitPremiumPHP(this.quoteJson, 2).subscribe((data:any) => {

			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	tpIciciGetPremium() {
		let primiumString;
		this.subscribeList.add(
			this.apiService.getIciciPremium(this.quoteJson, 2).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	tpDigitGetCDPremium() {
		let primiumString;
		this.subscribeList.add(
		this.apiService.getDigitCDPremium(this.quoteJson, 2).subscribe((data:any) => {
			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	tpRelianceGetCDPremium() {
		let primiumString;
		this.subscribeList.add(
		this.apiService.getRelianceCDPremium(this.quoteJson, 2).subscribe((data:any) => {
			primiumString = data;
			try
			{
				primiumString = (primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	hdfcGetTPCDPremium()
	{
		let hdfcdata; let primiumString;
		this.subscribeList.add(
		this.apiService.tpHDFCGetPremium(this.quoteJson, 2, 1).subscribe(data => {
			//// console.log("HDFC TP DATA");
			hdfcdata = data;
			try
			{
				primiumString = (hdfcdata);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);

	}

	tpRelianceGetPremium()
	{

		let relianceData; let primiumString;
		this.subscribeList.add(
			//this.apiService.tpRelianceGetPremium(this.quoteJson, 2, 0).subscribe(data => {
			this.apiService.getReliancePremium(this.quoteJson, 2).subscribe((data:any) => {

				relianceData = (data);
				//console.log('Tp='+data);
				primiumString = relianceData;
				if (primiumString.length > 0) {
		this.recalculateBool = false;

				this.parsePremiumJson(primiumString);
				}
			})
		);
	}
	tpBajajGetPremium(cdStatus=0) {
		let bajajData; let primiumString;
		this.subscribeList.add(
		this.apiService.getBajajPremiumPHP(this.quoteJson, 2,cdStatus).subscribe(data => {
			primiumString = data;
			try
			{
				primiumString = (primiumString);
				if(primiumString.length > 0){
					this.parsePremiumJson(primiumString);
				}
			}
			catch(e)
			{
				return;
			}

			// bajajData = (data);
			// //// console.log('bajaj data',bajajData);

			// primiumString = bajajData.data;
			// if(primiumString.length > 0){
			// this.parsePremiumJson(primiumString);

			// }
		})
		);
	}
	tpiffcoGetPremium() {
		let primiumString;
		this.subscribeList.add(
			this.apiService.getIffcoPremium(this.quoteJson, 2).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	odiffcoGetPremium()
	{

		let primiumString;
		this.subscribeList.add(
			this.apiService.getIffcoPremium(this.quoteJson, 3).subscribe((data:any) => {

				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}


	relianceOdPremium(){

		let ddd; let primiumString;
		if (this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV != '0') {
			this.quoteJson.idv = this.minRelianceIDV;
		}
		else if (this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV != '0') {
			this.quoteJson.idv = this.maxRelianceIDV;
		}
		else {
			this.quoteJson.idv = this.modifyIDV;
		}
		this.subscribeList.add(
		this.apiService.getReliancePremium(this.quoteJson, 4).subscribe((data:any) => {
			//// console.log("Reliance data", data);

			primiumString = data.data;

			this.parsePremiumJson(primiumString);
		})
		);

	}

	relianceGetPremium() {
		let ddd; let primiumString;
		if (this.modifyIDV < this.minRelianceIDV && this.minRelianceIDV != '0') {
			this.quoteJson.idv = this.minRelianceIDV;
		}
		else if (this.modifyIDV > this.maxRelianceIDV && this.maxRelianceIDV != '0') {
			this.quoteJson.idv = this.maxRelianceIDV;
		}
		else {
			this.quoteJson.idv = this.modifyIDV;
		}
		this.subscribeList.add(
		this.apiService.getReliancePremium(this.quoteJson, this.form_premium_type).subscribe(data => {

			/* ddd = data;
			primiumString = ddd.data; */
			primiumString = data;
			//// console.log("Reliance", primiumString);
			this.parsePremiumJson(primiumString);
		})
		);
	}
	kotakRolloverPremium(){
		let ddd; let primiumString;
		if (this.modifyIDV < this.minKotakIDV && this.minKotakIDV != '0')
		{
			this.quoteJson.idv = this.minKotakIDV;
		}
		else if (this.modifyIDV > this.maxKotakIDV && this.maxKotakIDV != '0')
		{
			this.quoteJson.idv = this.maxKotakIDV;
		}
		else
		{
			this.quoteJson.idv = this.modifyIDV;
		}
		this.subscribeList.add(
		this.apiService.getKotakPremium(this.quoteJson, 1).subscribe((data:any) => {

			primiumString = data;
			try
			{
				primiumString = (primiumString);
				// console.log("KOTAK", primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	kotakGetNewPremium(){
		let ddd; let primiumString;
		this.subscribeList.add(
		this.apiService.getKotakNewPremium(this.quoteJson, 0).subscribe((data:any) => {

			primiumString = data.data;

			this.parsePremiumJson(primiumString);
		})
		);
	}
	kotakTPPremium(){
		//alert("Call Kotak");
		let ddd; let primiumString;
		if (this.modifyIDV < this.minKotakIDV && this.minKotakIDV != '0')
		{
			this.quoteJson.idv = this.minKotakIDV;
		}
		else if (this.modifyIDV > this.maxKotakIDV && this.maxKotakIDV != '0')
		{
			this.quoteJson.idv = this.maxKotakIDV;
		}
		else
		{
			this.quoteJson.idv = this.modifyIDV;
		}
		this.subscribeList.add(
		this.apiService.getKotakTPPremium(this.quoteJson, 2).subscribe((data:any) => {

			primiumString = data;
			try
			{
				primiumString = (primiumString);
				//  console.log("KOTAK TP", primiumString);
				this.parsePremiumJson(primiumString);
			}
			catch(e)
			{
				return;
			}
		})
		);
	}
	bajajRolloverPremium(){
		let ddd; let primiumString;
		// this.subscribeList.add(
		// this.apiService.getBajajRollPremium(this.quoteJson, 1).subscribe((data:any) => {

		// 	primiumString = (data);

		// 	this.parsePremiumJson(primiumString);
		// })
		// );
	}
	bajajODRolloverPremium(cd_status=0)
	{
		let primiumString;
		if (this.modifyIDV > 0 && this.showCustomIDV) {
			if (this.modifyIDV < this.minBajajIDV && this.minBajajIDV != '0') {
				this.quoteJson.idv = this.minBajajIDV;
			}
			else if (this.modifyIDV > this.maxBajajIDV && this.maxBajajIDV != '0') {
				this.quoteJson.idv = this.maxBajajIDV;
			}
			else {
				this.quoteJson.idv = this.modifyIDV;
			}
		}
		else {
			this.route.queryParams.subscribe(params => {
				if (params.QID != null) {

				}
				else {
					this.quoteJson.idv = 0;
				}
			});
		}
		this.recalculateBool = true;
		this.subscribeList.add(
			this.apiService.getBajajPremiumPHP(this.quoteJson, 3,cd_status).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);
	}
	digitODRolloverPremium()
	{
		let primiumString;

		this.recalculateBool = true;
		this.subscribeList.add(
			this.apiService.getDigitPremiumPHP(this.quoteJson, 3).subscribe((data:any) => {
				this.recalculateBool =false;
				primiumString = data;
				try
				{
					primiumString = (primiumString);
					this.parsePremiumJson(primiumString);
				}
				catch(e)
				{
					return;
				}
			})
		);

	}
	relianceParseJson(primiumString)
	{
		//// console.log('relianceParseJson: ',primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minRelianceIDV == 0) {
				this.minRelianceIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minRelianceIDV && el.idv_amount_min != "") {
					this.minRelianceIDV = el.idv_amount_min;
				}
			}
			if (this.maxRelianceIDV == 0) {
				this.maxRelianceIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxRelianceIDV) {
					this.maxRelianceIDV = el.idv_amount_max;
				}
			}
		});
	}
	offlineParseJson(primiumString)
	{
		//// console.log('relianceParseJson: ',primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minOfflineIDV == 0) {
				this.minOfflineIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minOfflineIDV && el.idv_amount_min != "") {
					this.minOfflineIDV = el.idv_amount_min;
				}
			}
			if (this.maxOfflineIDV == 0) {
				this.maxOfflineIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxOfflineIDV) {
					this.maxOfflineIDV = el.idv_amount_max;
				}
			}
		});
	}


	tataParseJson(primiumString)
	{
		//// console.log('relianceParseJson: ',primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minTataIDV == 0) {
				this.minTataIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minTataIDV && el.idv_amount_min != "") {
					this.minTataIDV = el.idv_amount_min;
				}
			}
			if (this.maxTataIDV == 0) {
				this.maxTataIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxTataIDV) {
					this.maxTataIDV = el.idv_amount_max;
				}
			}
		});
	}

	sompoParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minSompoIDV == 0) {
				this.minSompoIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minSompoIDV) {
					this.minSompoIDV = el.idv_amount_min;
				}
			}
			if (this.maxSompoIDV == 0) {
				this.maxSompoIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxSompoIDV) {
					this.maxSompoIDV = el.idv_amount_max;
				}
			}
		});
	}
	futureParseJson(primiumString) {
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minFutureIDV == 0) {
				this.minFutureIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minFutureIDV) {
					this.minFutureIDV = el.idv_amount_min;
				}
			}
			if (this.maxFutureIDV == 0) {
				this.maxFutureIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxFutureIDV) {
					this.maxFutureIDV = el.idv_amount_max;
				}
			}
		});
	}
	nationalParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minNationalIDV == 0) {
				this.minNationalIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minNationalIDV) {
					this.minNationalIDV = el.idv_amount_min;
				}
			}
			if (this.maxNationalIDV == 0) {
				this.maxNationalIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxNationalIDV) {
					this.maxNationalIDV = el.idv_amount_max;
				}
			}
		});
	}
	iffcoParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minIffcoIDV == 0) {
				this.minIffcoIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minIffcoIDV) {
					this.minIffcoIDV = el.idv_amount_min;
				}
			}
			if (this.maxIffcoIDV == 0) {
				this.maxIffcoIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxIffcoIDV) {
					this.maxIffcoIDV = el.idv_amount_max;
				}
			}
		});
	}
	cholaParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minCholaIDV == 0) {
				this.minCholaIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minCholaIDV) {
					this.minCholaIDV = el.idv_amount_min;
				}
			}
			if (this.maxCholaIDV == 0) {
				this.maxCholaIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxCholaIDV) {
					this.maxCholaIDV = el.idv_amount_max;
				}
			}
		});
	}
	digitParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minDigitIDV == 0) {
				this.minDigitIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minDigitIDV) {
					this.minDigitIDV = el.idv_amount_min;
				}
			}
			if (this.maxDigitIDV == 0) {
				this.maxDigitIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxDigitIDV) {
					this.maxDigitIDV = el.idv_amount_max;
				}
			}
		});
	}
	hdfcParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minHdfcIDV == 0) {
				this.minHdfcIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minHdfcIDV) {
					this.minHdfcIDV = el.idv_amount_min;
				}
			}
			if (this.maxHdfcIDV == 0) {
				this.maxHdfcIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxHdfcIDV) {
					this.maxHdfcIDV = el.idv_amount_max;
				}
			}
		});
	}
	newindiaParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minNewindiaIDV == 0) {
				this.minNewindiaIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minNewindiaIDV) {
					this.minNewindiaIDV = el.idv_amount_min;
				}
			}
			if (this.maxNewindiaIDV == 0) {
				this.maxNewindiaIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxNewindiaIDV) {
					this.maxNewindiaIDV = el.idv_amount_max;
				}
			}
		});
	}
	orientalParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			if (this.minOrientalIDV == 0) {
				this.minOrientalIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minOrientalIDV) {
					this.minOrientalIDV = el.idv_amount_min;
				}
			}
			if (this.maxOrientalIDV == 0) {
				this.maxOrientalIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxOrientalIDV) {
					this.maxOrientalIDV = el.idv_amount_max;
				}
			}
		});
	}
	kotakParseJson(primiumString) {
		// let premiumJson=JSON.parse(primiumString);
		let premiumJson = primiumString;
		premiumJson.forEach(el => {
			// console.log('KOTAK_ORIGINAL_IDV0',el.KOTAK_ORIGINAL_IDV);
			if (this.minKotakIDV == 0) {
				this.minKotakIDV = el.idv_amount_min;
			}
			else {
				if (el.idv_amount_min <= this.minKotakIDV) {
					this.minKotakIDV = el.idv_amount_min;
				}
			}
			// console.log('KOTAK_ORIGINAL_IDV1',el.KOTAK_ORIGINAL_IDV);
			if (this.maxKotakIDV == 0) {
				this.maxKotakIDV = el.idv_amount_max;
			}
			else {
				if (el.idv_amount_max >= this.maxKotakIDV) {
					this.maxKotakIDV = el.idv_amount_max;
				}
			}
			// console.log('KOTAK_ORIGINAL_IDV',el.KOTAK_ORIGINAL_IDV);
			this.quoteJson.KOTAK_ORIGINAL_IDV = el.KOTAK_ORIGINAL_IDV;
		});
		// console.log('KOTAK_ORIGINAL_IDV3',this.quoteJson.KOTAK_ORIGINAL_IDV);

		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}

	openMoidifyDialog(content,edit_field='regDate'): void {
		this.edit_field = edit_field;
		this.same_provider_bool =false;
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '45%',
			panelClass:'new_popup_buy_now',
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	openPolicyTypeDialog(content,edit_field='regDate'): void {
		this.edit_field = edit_field;
		this.same_provider_bool =false;
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '45%',
			panelClass:'new_popup_buy_now',
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	openDialognow(content): void {
		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '50%',
			panelClass: 'caredit'
		});
		this.dialogRef.disableClose = true;
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
	beforeBuyNowPost(content, premiumitem, index)
	{
		this.same_provider_bool = true;
		this.comfromBuyBtn=true;
		this.buyTempPremiumitem = premiumitem;
		this.company_name=premiumitem.COMPANY_NAME;
		this.provider_id = premiumitem.PROVIDER_ID;
		this.NUM_NCB_PREM = premiumitem.NUM_NCB_PREM;

		this.buyTempIndex=index;
		if (!this.quoteJson.modifyCarInfo) {
			// this.dialogRef = this.dialog.open(content, {
			// 	width: '45%',
			// 	panelClass:'new_popup_buy_now',
			// });
			// this.dialogRef.disableClose = true;
			// this.dialogRef.afterClosed().subscribe(result => {
			// });
			this.dialogRef = this.dialog.open(content, {
				width: '50%',
				panelClass: 'caredit'
			});
			this.dialogRef.disableClose = true;
			this.dialogRef.afterClosed().subscribe(result => {
			});
			return false;
		}
		else
		{
			this.buyNow(premiumitem, index);
		}
	}
	beforeBuyNow(content, pospStatusContent, premiumitem, index)
	{
		if(this.userStatusApiStatus) {
			this.localStorage.getItem("userJson").subscribe((userDetails: any) => {
				if(!userDetails) {
					this.beforeBuyNowPost(content, premiumitem, index);
					return;
				}

				this.userStatusApiStatus = false;
				this.apiService.getPospCertificationStatus(userDetails.user_code).subscribe((res) => {
					this.userStatusApiStatus = true;
					if(res.status) {
						this.beforeBuyNowPost(content, premiumitem, index);
					} else {
						this.dialogRef = this.dialog.open(pospStatusContent, {
							width: '50%',
							panelClass:'new_popup_buy_now'
						});
						this.dialogRef.disableClose = true;
						this.dialogRef.afterClosed().subscribe(result => {
						});
					}
				});
			});
		}
		return;
	}

	buyNow(premiumitem, index) {
		this.premiumIndex = index;
		this.quoteJson.isThirdParty = this.isThirdParty;
		let addonItems = premiumitem.ADDON_ITEMS;
		this.quoteJson.zero_dep = 0;
		this.quoteJson.engine_protector = 0;
		this.quoteJson.consumable_cover = 0;
		this.quoteJson.daily_allowance = 0;
		this.quoteJson.ncb_protector = 0;
		this.quoteJson.roadside_assistance = 0;
		this.quoteJson.loss_key_cover = 0;
		this.quoteJson.invoice_return = 0;
		this.quoteJson.personal_cover = 0;
		this.quoteJson.tyre_cover = 0;
		this.quoteJson.travel_cover = 0;
		this.quoteJson.rim_damage = 0;
		this.quoteJson.medical_cover = 0;
		this.quoteJson.idv = 0;

		if(addonItems[0] && addonItems[0].isChecked==true)
			this.quoteJson.zero_dep=1;
		if(addonItems[1] && addonItems[1].isChecked==true)
			this.quoteJson.roadside_assistance=1;
		if(addonItems[2] && addonItems[2].isChecked==true)
			this.quoteJson.engine_protector=1;
		if(addonItems[3] && addonItems[3].isChecked==true)
			this.quoteJson.ncb_protector=1;
		if(addonItems[4] && addonItems[4].isChecked==true)
			this.quoteJson.loss_key_cover=1;
		if(addonItems[5] && addonItems[5].isChecked==true)
			this.quoteJson.consumable_cover=1;
		if(addonItems[6] && addonItems[6].isChecked==true)
			this.quoteJson.daily_allowance=1;
		if(addonItems[7] && addonItems[7].isChecked==true)
			this.quoteJson.invoice_return=1;
		if(addonItems[8] && addonItems[8].isChecked==true)
			this.quoteJson.tyre_cover=1;
		if(addonItems[9] && addonItems[9].isChecked==true)
			this.quoteJson.rim_damage=1;
		if(addonItems[10] && addonItems[10].isChecked==true)
			this.quoteJson.personal_cover=1;
		if(addonItems[11] && addonItems[11].isChecked==true)
			this.quoteJson.travel_cover=1;
		if(addonItems[12] && addonItems[12].isChecked==true)
			this.quoteJson.medical_cover=1;

		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });

		if (this.showCustomIDV) {
			//this.quoteJson.idv = this.minIDV;
			//this.quoteJson.modifyIDV = this.minIDV;
			//this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		}

		if(!this.quoteJson.isThirdParty)
		{
			this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => {
				this.localStorage.getItem('globalAdditionalCover').subscribe((data: any) => {
					if (data != null) {
						if (data[0].isChecked) {
							this.quoteJson.paid_driver_type = true;
						}
						else {
							this.quoteJson.paid_driver = 0;
							this.quoteJson.paid_driver_type = false;
						}
						if (data[1].isChecked) {
							this.quoteJson.pa_owner = 1;
							this.quoteJson.pa_owner_type = true;
						}
						else {
							this.quoteJson.pa_owner = 0;
							this.quoteJson.pa_owner_type = false;
						}
						if (data[4].isChecked) {
							this.quoteJson.ll_paid_driver = 1;
							this.quoteJson.ll_paid_driver_type = true;
						}
						else {
							this.quoteJson.ll_paid_driver = 0;
							this.quoteJson.ll_paid_driver_type = false;
						}
						this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
					}
				});
			});
		}

		if(this.quoteJson.isThirdParty)
		{
			this.localStorage.setItem('thirdPartyCover', this.thirdPartyCover).subscribe(() => {
				this.localStorage.getItem('thirdPartyCover').subscribe((data: any) => {
					if (data != null) {
						if (data[0].isChecked) {
							this.quoteJson.paid_driver_type = true;
						}
						else {
							this.quoteJson.paid_driver = 0;
							this.quoteJson.paid_driver_type = false;
						}
						if (data[1].isChecked) {
							this.quoteJson.pa_owner = 1;
							this.quoteJson.pa_owner_type = true;
						}
						else {
							this.quoteJson.pa_owner = 0;
							this.quoteJson.pa_owner_type = false;
						}
						if (data[4].isChecked) {
							this.quoteJson.ll_paid_driver = 1;
							this.quoteJson.ll_paid_driver_type = true;
						}
						else {
							this.quoteJson.ll_paid_driver = 0;
							this.quoteJson.ll_paid_driver_type = false;
						}

						this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
					}
				});
			});
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		this.localStorage.setItem('globalAccessories', this.globalAccessories).subscribe(() => { });
		dht('GIBL_CHOOSE_PREMIUM', premiumitem);
		this.localStorage.setItem('premiumJson', premiumitem).subscribe(() => {
			setTimeout(() => {
				if(this.ISRENEWAL_Q==true)
				{
					this.navigateURL('proposal-confirmation');
				}
				else
				{
					this.navigateURL('proposal');
				}
			}, 500);
		});
	}
	payoutCalculate(premiumString){
		this.localStorage.getItem('userJson').subscribe((data) => {
			const userJson:any=data;
			// console.log('1111111111111111',premiumString)
		if(userJson!=undefined && userJson.role_type=='8'){
			const sum = premiumString.COVER_ITEMS.reduce((accumulator, item) => {
				if (item.isChecked) {
				  // Ensure the value is treated as a number
				  const itemValue = typeof item.value === 'string' ? parseFloat(item.value) : item.value;
				  return accumulator + itemValue;
				}
				return accumulator;
			  }, 0);
			const tp_premium=typeof premiumString.NUM_TP_RATE === 'string' ?parseFloat(premiumString.NUM_TP_RATE):premiumString.NUM_TP_RATE+sum-(premiumString.TPPD?premiumString.TPPD:0);
			const od_premium=premiumString.NET_PREMIUM-tp_premium;
			let calculatePayout={
				"grid_aplicable_date": {
					"year":new Date().getFullYear(),
					"month": new Date().toLocaleString('default',{ month: 'long' }).toUpperCase()
				},
				"policy_type": "MOTOR",
				"policy_subtype":premiumString.PREMIUM_TYPE,
				"insurer_ID": premiumString.PROVIDER_ID,
				"plan_type": premiumString.PREMIUM_TYPE==0?"NEW":"Rollover",
				"quoteID": this.quoteJson.quoteID,
				"rto_code": this.quoteJson.rto_code,
				"pa_owner": this.quoteJson.pa_owner,
				"pre_policy_expiry_date": this.quoteJson.pre_policy_expiry_date,
				"registration_date":  this.quoteJson.registration_date,
				"car_id":this.quoteJson.car_id,
				"new_ncb": this.quoteJson.new_ncb,
				"service_mode":premiumString.SERVICE_MODE,
				"year":premiumString.PREMIUM_YEAR,
				"cpa_bonus":premiumString.NUM_PA_TO_OWNER_DRIVER,
				"od_amount":od_premium,
				"tp_amount":tp_premium,
				"serviceUrl":this.apiService.CRMDOMAIN +"payout-calculate/index.php?action=CALCULATE_PAYOUT"
			}
			// console.log('pr=>',calculatePayout);

			this.apiService.apiPayoutCalculate(calculatePayout).subscribe(data => {
				if(data){
					this.isPayoutButtonActive = true;
				}
			});
		}
		})
	}
	getPayoutAmountDetails(year=1){
		let listOfProvider: number[] = [];
		listOfProvider = Array.from(new Set(
			this.premiumJson.reduce((acc: number[], product: any) => {
			  if (product && product.PROVIDER_ID !== undefined) {
				acc.push(product.PROVIDER_ID);
			  }
			  return acc;
			}, [])
		  ));
		let calculatePayout={
			"policy_type":"MOTOR",
			"quote_id":this.quoteJson.quoteID,
			"year":year,
			"premium_type":this.quoteJson.premium_type=='COM'?'TPOD':(this.quoteJson.premium_type=='SAOD'?"OD":"TP"),
			"listOfProvider":listOfProvider,
			"serviceUrl":this.apiService.CRMDOMAIN +"payout-calculate/index.php?action=GET_PAYOUT"
		}
		this.payOutStatus = false;
		this.posPayoutAmountDetails = null;
		this.apiService.getPayoutList(calculatePayout).subscribe((payOutRes: PayoutResponse) => {
            if (payOutRes) {
				this.payOutStatus = true;
				if(payOutRes.status=='1'){
					this.posPayoutAmountDetails = payOutRes.data;
				}else if(payOutRes.status=='0'){
					this.payOutAmountMsg=payOutRes.message;
				}
            }
        });
	}
	parsePremiumJson(primiumString) {
		// console.log(primiumString, this.premiumListKey);
		if (primiumString != "" && typeof primiumString !== 'undefined') {
			let premiumJson = primiumString;
			if( this.priorityData.priority_arr && this.priorityData.priority_arr.length>0 ){
				if( this.priorityData.priority_arr.includes(+premiumJson[0].PROVIDER_ID) ){
					this.priorityData.show_com_counter	=1;
					this.comShowMoreHide =true; // kyccode
				}
			}

			// Chandra 09032022 //
			if(premiumJson[0].PROVIDER_ID!=18 && premiumJson[0].PREMIUM_TYPE == '2')
			{
				this.callNewIndia=this.callNewIndia + 1;
			}
			// Chandra 09032022 //


			if (premiumJson[0].PROVIDER_ID == '6') {
				this.hdfcParseJson(primiumString);
				this.premiumListKey = "HDFC";
			}
			if (premiumJson[0].PROVIDER_ID == '25') {
				//// console.log("Liverty Log::",premiumJson[0]);
				this.premiumListKey = "LIVERTY";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '12' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "RELIANCETP";
				this.relianceParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '12' && premiumJson[0].PREMIUM_TYPE == '4') {
				this.premiumListKey = "RELIANCEOD";
				this.relianceParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '12' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "RELIANCECOMP";
				// console.log("premiumJson RELIANE=>",premiumJson[0]);
				this.relianceParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '16' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "SOMPO";
				this.sompoParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '16' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "SOMPOTP";
			}
			if (premiumJson[0].PROVIDER_ID == '28') {
				this.premiumListKey = "KOTAK";
				this.kotakParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '28' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "KOTAKTP";
				this.kotakParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '17') {
				this.premiumListKey = "TATA";
				this.tataParseJson(primiumString);
			}

			if (premiumJson[0].PROVIDER_ID == '5' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "FUTURE";
				this.futureParseJson(primiumString)
			}
			if (premiumJson[0].PROVIDER_ID == '5' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "FUTURETP";
			}
			if (premiumJson[0].PROVIDER_ID == '37' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "DHFL";

			}
			if (premiumJson[0].PROVIDER_ID == '37' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "DHFLTP";
			}
			if (premiumJson[0].PROVIDER_ID == '29' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "DIGIT";
				this.digitParseJson(primiumString)
			}
			if (premiumJson[0].PROVIDER_ID == '29' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "DIGITTP";
			}
			if (premiumJson[0].PROVIDER_ID == '29' && premiumJson[0].PREMIUM_TYPE == '3') {
				this.premiumListKey = "DIGITOD";
			}
			if (premiumJson[0].PROVIDER_ID == '3') {
				this.premiumListKey = "BHARTI";
			}
			if (premiumJson[0].PROVIDER_ID == '18' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "NEWINDIA";
				this.newindiaParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '2' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "BAJAJTP";
			}
			if (premiumJson[0].PROVIDER_ID == '2' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.quoteJson.bajajIDV = premiumJson[0].IDV;
				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
				this.premiumListKey = "BAJAJ";
			}
			if (premiumJson[0].PROVIDER_ID == '2' && premiumJson[0].PREMIUM_TYPE == '3') {
				this.quoteJson.bajajIDV = premiumJson[0].IDV;
				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
				this.premiumListKey = "BAJAJOD";
			}
			/* if (premiumJson[0].PROVIDER_ID == '10') {
				this.premiumListKey = "NATIONAL";
				this.offlineParseJson(primiumString);
			} */
			if (premiumJson[0].PROVIDER_ID == '10') {
				this.premiumListKey = "NATIONAL";
				this.nationalParseJson(primiumString);
			}

			if (premiumJson[0].PROVIDER_ID == '21' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
				this.premiumListKey = "MAGMA";
			}
			if (premiumJson[0].PROVIDER_ID == '4' && premiumJson[0].PREMIUM_TYPE == '0') {
				this.premiumListKey = "CHOLANEW";
			}
			if (premiumJson[0].PROVIDER_ID == '4' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "CHOLA";
				//this.offlineParseJson(primiumString);
				this.cholaParseJson(primiumString);

			}
			
			if (premiumJson[0].PROVIDER_ID == '4' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "CHOLATP";
			}
			if (premiumJson[0].PROVIDER_ID == '4' && premiumJson[0].PREMIUM_TYPE == '3') {
				//alert(premiumJson[0].PREMIUM_TYPE);
				this.premiumListKey = "CHOLAOD";
				//console.log('Icic Saod');
			}
			if (premiumJson[0].PROVIDER_ID == '13' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "ROYALTP";
				// this.showOnlyRoyal = this.showOnlyRoyal +1;
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '13' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "ROYAL";
				// this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '15') {
				this.premiumListKey = "UNITD";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '23') {
				this.premiumListKey = "SBI";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '33') {
				this.premiumListKey = "EDEL";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '38') {
				this.premiumListKey = "RAHEJA";
				this.offlineParseJson(primiumString);
			}
			/* if (premiumJson[0].PROVIDER_ID == '29') {
				this.premiumListKey = "DIGIT";
				this.offlineParseJson(primiumString);
			} */
			if (premiumJson[0].PROVIDER_ID == '34') {
				this.premiumListKey = "EDELWISS";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '37') {
				this.premiumListKey = "DHFL";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '7' && premiumJson[0].PREMIUM_TYPE == '1') {
				this.premiumListKey = "ICICI";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '7' && premiumJson[0].PREMIUM_TYPE == '2') {
				this.premiumListKey = "ICICITP";

			}
			if (premiumJson[0].PROVIDER_ID == '7' && premiumJson[0].PREMIUM_TYPE == '3') {
				this.premiumListKey = "ICICIOD";
			}
			if (premiumJson[0].PROVIDER_ID == '7' && premiumJson[0].PREMIUM_TYPE == '3') {
				//alert(premiumJson[0].PREMIUM_TYPE);
				this.premiumListKey = "ICICIOD";
			}
			if (premiumJson[0].PROVIDER_ID == '7' && premiumJson[0].PREMIUM_TYPE == '0') {
				//alert(premiumJson[0].PREMIUM_TYPE);
				this.premiumListKey = "ICICINEW";
			}

			if (premiumJson[0].PROVIDER_ID == '11') {
				this.premiumListKey = "ORIENTAL";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '26') {
				this.premiumListKey = "SHRIRAM";
				this.offlineParseJson(primiumString);
			}
			if (premiumJson[0].PROVIDER_ID == '8') {
				this.premiumListKey = "IFFCO";
				//this.offlineParseJson(primiumString);
				this.premiumListKey = "IFFCO";
				this.iffcoParseJson(primiumString);
			}

			premiumJson.forEach(el => {
				if (this.minIDV == 0 && el.idv_amount_min != "") {
					this.minIDV = el.idv_amount_min;
				}
				else {
					if (el.idv_amount_min <= this.minIDV && el.idv_amount_min != "") {
						this.minIDV = el.idv_amount_min;
					}
				}
				if (this.maxIDV == 0 && el.idv_amount_max != "") {
					this.maxIDV = el.idv_amount_max;
				}
				else {
					if (el.idv_amount_max >= this.maxIDV && el.idv_amount_max != "") {
						this.maxIDV = el.idv_amount_max;
					}
				}
			});
			if (this.minIDV != 0 && this.maxIDV != 0) {
				this.quoteJson.minIDV = this.minIDV;
				this.quoteJson.maxIDV = this.maxIDV;
				if(this.cIDV==0)
				{
					this.cIDV = this.minIDV;
				}
				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
			}
			this.countResultPremium++;
			let premObj = this;
			for (var i = 0; i < premiumJson.length; i++) {
				if (premiumJson.length > 1)
					this.premiumJsonTemp[this.premiumListKey + i] = premiumJson[i];
				else
					this.premiumJsonTemp[this.premiumListKey] = premiumJson[i];

				premObj.premiumJson = [];
				let premiumJsonTemp = this.premiumJsonTemp;
				if(this.getselectedArr.length>0)
				{
					Object.keys(premiumJsonTemp).forEach(function (key) {
						let el = premiumJsonTemp[key];
						// console.log("provider_include",el.PROVIDER_ID);
						if(premObj.getselectedArr.includes(el.PROVIDER_ID.toString()))
						{
							//// console.log("provider_include1",el.PROVIDER_ID);
							premObj.premiumJson.push(el);
						}
					});
				}
				else
				{
					Object.keys(premiumJsonTemp).forEach(function (key) {
						let el = premiumJsonTemp[key];
						premObj.premiumJson.push(el);
						//premObj.sortByPremiumDefault();
					});
				}
				this.resetCover(premiumJson[i]);
				this.resetAddon(premiumJson[i], i);
				this.apiService.saveQuotePremium(premiumJson).subscribe(data => { });
				this.sortByPremiumDefault();
				this.getPayoutPayment(premiumJson[i]);
				if(premiumJson.length>0){
					premiumJson.forEach(element => {
						if(premiumJson[0].NET_PREMIUM>0){
							this.payoutCalculate(element);
						}
					});
				}
			}

			this.showPremiumData = true;
			if( this.priorityData.show_com_all ) this.priorityData.show_com_after_loader	=true;
			if( this.priorityData.show_tp_all ) this.priorityData.show_tp_after_loader	=true;
			if (this.quoteJson.idv == 0) {
				this.quoteModifyLeftForm.patchValue({ "modifyIDV": this.minIDV }); //IF MODIFY IDV NOT SUBMITTED MIN VALUE WILL BE SET
			} else {
				this.quoteModifyLeftForm.patchValue({ "modifyIDV": this.modifyIDV });
			}

			// Chandra 09032022 //
			// console.log('tem premium=>',this.premiumJson);
			/*
			if(this.callNewIndia>0)
			{
				this.premiumJson.forEach((el,arrIndex) => {
					if(el.PROVIDER_ID=='18')
					{
						this.premiumJson.splice(arrIndex,1);
						//// console.log('Final premium=>',this.premiumJson);
					}
				});
			}
			*/
			/*
			if(this.showOnlyRoyal>0)
			{
				// console.log('Entry royal')
				let totalins= this.premiumJson.length;
				this.premiumJson.forEach((el,arrIndex) => {
					if(el.PROVIDER_ID=='13' && el.PREMIUM_TYPE == '2')
					{
						this.premiumJson.splice(0,totalins, el);
						// console.log('Final premium=>',this.premiumJson);
					}
				});
			}
			*/
			// Chandra 09032022 //
		}

		this.premiumJsonShow = true;
	}
	/**************************************************************Remove Default Cover********************************************************/
	resetCover(premiumJson) {

		if (!this.quoteJson.ll_paid_driver_type) {
			this.quoteJson.ll_paid_driver = 0;
			this.quoteJson.ll_paid_driver_type = false;
		}
		if (!this.quoteJson.pa_cover_checked) {
			this.quoteJson.unnamed_passenger = 0;
			this.quoteJson.is_unnamed_passenger= 0;
		}
		if (!this.quoteJson.paid_driver_type) {
			this.quoteJson.paid_driver = 0;
		}
		let addonItems = premiumJson.COVER_ITEMS;
		let total_addon_val = 0;
		var i2 = 0;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		addonItems.forEach(el => {
			if (i2 <= 4) {
				let addon_value = parseFloat(el.value);
				if (!isNaN(addon_value))
				{
					if(this.quoteJson.isThirdParty==true)
					{
						if (this.thirdPartyCover[i2].isChecked || premiumJson.COVER_ITEMS[i2].isChecked)
						{
							if(i2==0 && this.quoteJson.paid_driver==200000 )
							{
								premiumJson.NET_PREMIUM = parseFloat(premiumJson.NET_PREMIUM) + parseFloat(premiumJson.COVER_ITEMS[i2].value);
							}
							if(i2==2 && this.quoteJson.unnamed_passenger==200000 && premiumJson.PROVIDER_ID!=29)
							{
								premiumJson.NET_PREMIUM = parseFloat(premiumJson.NET_PREMIUM) + parseFloat(premiumJson.COVER_ITEMS[i2].value);
							}
							premiumJson.COVER_ITEMS[i2].isChecked = true;
						}
						else {
							total_addon_val = total_addon_val + addon_value;
						}
					}
					else
					{
						if (this.globalAdditionalCover[i2].isChecked || premiumJson.COVER_ITEMS[i2].isChecked)
						{
							if(i2==0 && this.quoteJson.paid_driver==200000 && premiumJson.PROVIDER_ID!=29)
							{
								premiumJson.NET_PREMIUM = parseFloat(premiumJson.NET_PREMIUM) + parseFloat(premiumJson.COVER_ITEMS[i2].value);
							}
							if(i2==2 && this.quoteJson.unnamed_passenger==200000)
							{
								premiumJson.NET_PREMIUM = parseFloat(premiumJson.NET_PREMIUM) + parseFloat(premiumJson.COVER_ITEMS[i2].value);
							}
							premiumJson.COVER_ITEMS[i2].isChecked = true;
						}
						else {
							total_addon_val = total_addon_val + addon_value;
						}
					}
				}
			}
			i2++;
		});


		let total_net_premium = parseFloat(premiumJson.NET_PREMIUM) - total_addon_val;
		let service_tax = Math.round(total_net_premium * .18);
		let total_premium = total_net_premium + service_tax;
		premiumJson.NET_PREMIUM = total_net_premium;
		premiumJson.SERVICE_TAX = service_tax;
		premiumJson.TOTAL_PREMIUM = total_premium;
	}
	/**************************************************************Remove Default Addon********************************************************/
	resetAddon(premiumJson, index) {
		if (this.quoteJson.isThirdParty)
		{
			//this.quoteJson.pa_owner = 1;
			var i = 0;
			this.thirdPartyCover.forEach(el =>
			{
				this.thirdPartyCover[i].isDisplay = false;
				i++;
			});
			//this.thirdPartyCover[1].isChecked = true;
		}
		else
		{
			//this.quoteJson.pa_owner = 1;
			//this.globalAdditionalCover[1].isChecked = true;
		}
		this.quoteJson.zero_dep = 0;
		this.quoteJson.engine_protector = 0;
		this.quoteJson.consumable_cover = 0;
		this.quoteJson.daily_allowance = 0;
		this.quoteJson.ncb_protector = 0;
		this.quoteJson.roadside_assistance = 0;
		this.quoteJson.loss_key_cover = 0;
		this.quoteJson.invoice_return = 0;
		this.quoteJson.personal_cover = 0;
		this.quoteJson.tyre_cover = 0;
		this.quoteJson.travel_cover = 0;
		this.quoteJson.rim_damage = 0;
		this.quoteJson.medical_cover = 0;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {});
		this.localStorage.setItem('thirdPartyCover', this.thirdPartyCover).subscribe(() => {});
		this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => {});


		let addonItems = premiumJson.ADDON_ITEMS;
		var total_addon_val = 0, i2 = 0;
		let prem_key = premiumJson.PROVIDER_ID;
		let rsa_val = 0;
		//// console.log("addonItems::",addonItems);
		//// console.log("premiumJson.NET_PREMIUM::",premiumJson.NET_PREMIUM);

		addonItems.forEach(el => {
			let addon_value = parseFloat(el.value);
			if (!isNaN(addon_value))
			{
				if (this.globalPremAddonArray && this.globalPremAddonArray[prem_key] && this.globalPremAddonArray[prem_key][i2].isChecked)
				{
					premiumJson.ADDON_ITEMS[i2].isChecked = true;
					if(premiumJson.PROVIDER_ID=='17' && i2==1)
					{
						total_addon_val = total_addon_val + addon_value;
						rsa_val = addon_value;
					}
				}
				else
				{
					if(el.isDisplay == false)
					{
						total_addon_val = total_addon_val + addon_value;
					}
					else
					{
						el.isChecked = true;
					}
				}
			}
			i2++;
		});

		var total_net_premium = 0;
		if (premiumJson.PROVIDER_ID == '28') {
			if (this.globalPremAddonArray[prem_key] && this.globalPremAddonArray[prem_key][0] && this.globalPremAddonArray[prem_key][0].isChecked) {
				//// console.log("If Zero dept select no voluantary discount");
				var total_net_premium = parseInt(premiumJson.NET_PREMIUM) - total_addon_val;
			} else {
				let voluntary_amount = parseInt(premiumJson.VOLUNTARY_DISCOUNT);
				let net_premium = parseInt(premiumJson.NET_PREMIUM) + voluntary_amount;
				var total_net_premium = net_premium - total_addon_val;
			}
		} else {
			total_net_premium = parseInt(premiumJson.NET_PREMIUM) - total_addon_val;
		}

		total_net_premium	=Math.round(total_net_premium);
		let service_tax = Math.round(total_net_premium * .18);
		let total_premium = total_net_premium + service_tax;

		premiumJson.NET_PREMIUM = total_net_premium;
		premiumJson.SERVICE_TAX = service_tax;
		premiumJson.TOTAL_PREMIUM = total_premium+rsa_val;
	}
	setAddon()
	{
		if(this.globalAddonArray[0].isChecked==true)
		{
			this.quoteJson.zero_dep = 1;
		}
		else
		{
			this.quoteJson.zero_dep = 0;
		}

		if(this.globalAddonArray[1].isChecked==true)
		{
			this.quoteJson.roadside_assistance = 1;
		}
		else
		{
			this.quoteJson.roadside_assistance = 0;
		}

		if(this.globalAddonArray[2].isChecked==true)
		{
			this.quoteJson.engine_protector = 1;
		}
		else
		{
			this.quoteJson.engine_protector = 0;
		}
		if(this.globalAddonArray[3].isChecked==true)
		{
			this.quoteJson.ncb_protector = 1;
		}
		else
		{
			this.quoteJson.ncb_protector = 0;
		}
		if(this.globalAddonArray[4].isChecked==true)
		{
			this.quoteJson.loss_key_cover = 1;
		}
		else
		{
			this.quoteJson.loss_key_cover = 0;
		}

		if(this.globalAddonArray[5].isChecked==true)
		{
			this.quoteJson.consumable_cover = 1;
		}
		else
		{
			this.quoteJson.consumable_cover = 0;
		}

		if(this.globalAddonArray[7].isChecked==true)
		{
			this.quoteJson.invoice_return = 1;
		}
		else
		{
			this.quoteJson.invoice_return = 0;
		}

		if(this.globalAddonArray[8].isChecked==true)
		{
			this.quoteJson.tyre_cover = 1;
		}
		else
		{
			this.quoteJson.tyre_cover = 0;
		}

		if(this.globalAddonArray[10].isChecked==true)
		{
			this.quoteJson.personal_cover = 1;
		}
		else
		{
			this.quoteJson.personal_cover = 0;
		}

		if(this.globalAddonArray[11].isChecked==true)
		{
			this.quoteJson.travel_cover = 1;
		}
		else
		{
			this.quoteJson.travel_cover = 0;
		}

		if(this.globalAddonArray[12].isChecked==true)
		{
			this.quoteJson.medical_cover = 1;
		}
		else
		{
			this.quoteJson.medical_cover = 0;
		}

	}

	thirdPartyCoverContrl(event: any = '', v)
	{
		this.loader = true;
		this.startTimer(20);
		this.apiService.getPremium(this.quoteJson)
		if (event.checked && v == 2)
		{
			this.pa_cover_checked = true;
			this.quoteJson.is_unnamed_passenger = 1;
			this.quoteJson.unnamed_passenger = 100000;
			this.pa_cover = 100000;
		}
		if (!event.checked && v == 2) {
			this.pa_cover_checked = false;
			this.quoteJson.is_unnamed_passenger = 0;
		}

		if (event.checked && v == 0)
		{
			this.pa_paid_checked = true;
			this.quoteJson.paid_driver_type = true;
			this.quoteJson.paid_driver = 100000;
			this.paid_cover = 100000;
		}
		if (!event.checked && v == 0)
		{
			this.pa_paid_checked = false;
			this.quoteJson.paid_driver_type = false;
			this.quoteJson.paid_driver = 0;
		}
		this.quoteJson.pa_cover_checked = this.pa_cover_checked;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		if (event.checked || event == true)
		{
			this.globalAdditionalCover[v].isChecked = true;
			this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => { });
			this.localStorage.setItem('thirdPartyCover', this.thirdPartyCover).subscribe(() => { });
			this.thirdPartyCover[v].isChecked = true;
			var i = 0, total_addon_val, total_net_premium, service_tax, total_premium;
			this.premiumJson.forEach(el => {
				if (v == 0 && this.premiumJson[i].COVER_ITEMS[0].isChecked == false)
				{
					this.thirdPartyCover[0].isDisplay = true;
					this.premiumJson[i].COVER_ITEMS[0] = { name: this.premiumJson[i].COVER_ITEMS[0].name, value: this.premiumJson[i].COVER_ITEMS[0].value, isDisplay: this.premiumJson[i].COVER_ITEMS[0].isDisplay, "isChecked": true };
					total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
				}
				else if (v == 1 && this.premiumJson[i].COVER_ITEMS[1].isChecked == false) {
					this.thirdPartyCover[1].isDisplay = true;
					this.premiumJson[i].COVER_ITEMS[1] = { name: this.premiumJson[i].COVER_ITEMS[1].name, value: this.premiumJson[i].COVER_ITEMS[1].value, isDisplay: this.premiumJson[i].COVER_ITEMS[1].isDisplay, "isChecked": true };
					total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
					this.quoteJson.pa_owner_type = true;
					this.quoteJson.pa_owner = 1;
				}
				else if (v == 2 && this.premiumJson[i].COVER_ITEMS[2].isChecked == false)
				{
					this.thirdPartyCover[2].isDisplay = true;
					this.premiumJson[i].COVER_ITEMS[2] = { name: this.premiumJson[i].COVER_ITEMS[2].name, value: this.premiumJson[i].COVER_ITEMS[2].value, isDisplay: this.premiumJson[i].COVER_ITEMS[2].isDisplay, "isChecked": true };
					total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
					let service_tax;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
				}
				else if (v == 4 && this.premiumJson[i].COVER_ITEMS[4].isChecked == false) {
					this.thirdPartyCover[4].isDisplay = true;
					this.quoteJson.ll_paid_driver = 1;
					this.quoteJson.ll_paid_driver_type = true;
					this.premiumJson[i].COVER_ITEMS[4] = { name: this.premiumJson[i].COVER_ITEMS[4].name, value: this.premiumJson[i].COVER_ITEMS[4].value, isDisplay: this.premiumJson[i].COVER_ITEMS[4].isDisplay, "isChecked": true };

					total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					// console.log(total_addon_val);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
					let service_tax;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
				}
				i++;
				// // console.log(i)
			});
		}
		else
		{
			this.globalAdditionalCover[v].isChecked = false;
			this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => { });
			this.thirdPartyCover[v].isChecked = false;
			if (v == 1) {
				this.openDialogPaOwner();
			}
			var i = 0, total_addon_val, total_net_premium, service_tax, total_premium;
			this.premiumJson.forEach(el => {
				if (v == 0 && this.premiumJson[i].COVER_ITEMS[0].isChecked == true)
				{
					this.thirdPartyCover[0].isDisplay = false;
					this.premiumJson[i].COVER_ITEMS[0] = { name: this.premiumJson[i].COVER_ITEMS[0].name, value: this.premiumJson[i].COVER_ITEMS[0].value, isDisplay: this.premiumJson[i].COVER_ITEMS[0].isDisplay, "isChecked": false };

					if(v == 0)
					{
						if (this.paid_cover == 200000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value) * 2.0;
						}
						else if (this.paid_cover == 100000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value);
						}
					}
					//total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
				}
				else if (v == 1 && this.premiumJson[i].COVER_ITEMS[1].isChecked == true) {
					if(this.premiumJson[i].PROVIDER_ID!=5)// In Future PA owner driver is mandatory
					{
						this.thirdPartyCover[1].isDisplay = false;
						this.premiumJson[i].COVER_ITEMS[1] = { name: this.premiumJson[i].COVER_ITEMS[1].name, value: this.premiumJson[i].COVER_ITEMS[1].value, isDisplay: this.premiumJson[i].COVER_ITEMS[1].isDisplay, "isChecked": false };
						total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
						total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
						service_tax = Math.round(total_net_premium * .18);
						total_premium = total_net_premium + service_tax;
						this.premiumJson[i].NET_PREMIUM = total_net_premium;
						this.premiumJson[i].SERVICE_TAX = service_tax;
						this.premiumJson[i].TOTAL_PREMIUM = total_premium;
						this.quoteJson.pa_owner_type = false;
						this.quoteJson.pa_owner = 0;

						// SET COVER PA OWNER DRIVER COVER
						this.thirdPartyCover[1].isChecked = false;
						this.localStorage.setItem('thirdPartyCover', this.thirdPartyCover).subscribe(() => {});
						this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => {});
					}
				}
				else if (v == 2 && this.premiumJson[i].COVER_ITEMS[2].isChecked == true) {
					this.quoteJson.is_unnamed_passenger = 0;
					this.thirdPartyCover[2].isDisplay = false;
					this.premiumJson[i].COVER_ITEMS[2] = { name: this.premiumJson[i].COVER_ITEMS[2].name, value: this.premiumJson[i].COVER_ITEMS[2].value, isDisplay: this.premiumJson[i].COVER_ITEMS[2].isDisplay, "isChecked": false };

					if(v == 2)
					{
						if (this.pa_cover == 200000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value) * 2.0;
						}
						else if (this.pa_cover == 100000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value);
						}
					}
					//total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
					let service_tax;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
					this.quoteJson.is_unnamed_passenger = 0;
				}
				else if (v == 4 && this.premiumJson[i].COVER_ITEMS[4].isChecked == true) {
					this.quoteJson.ll_paid_driver = 0;
					this.quoteJson.ll_paid_driver_type = false;
					this.thirdPartyCover[4].isDisplay = false;
					this.premiumJson[i].COVER_ITEMS[4] = { name: this.premiumJson[i].COVER_ITEMS[4].name, value: this.premiumJson[i].COVER_ITEMS[4].value, isDisplay: this.premiumJson[i].COVER_ITEMS[4].isDisplay, "isChecked": false };

					total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
					let service_tax;
					service_tax = Math.round(total_net_premium * .18);
					total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
				}
				i++;
			});
		}
		this.quoteJson.thirdPartyAddon = this.thirdPartyCover;
		this.localStorage.setItem('thirdPartyCover', this.thirdPartyCover).subscribe(() => {});
		this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => {});
		// // console.log(this.quoteJson);
	}

	changePaCoverForComprehensive(event) {
		this.quoteJson.unnamed_passenger = event;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}
	changePaCover(event)
	{
		var i = 0, total_addon_val, total_net_premium, service_tax, total_premium;
		this.premiumJson.forEach(el => {
			total_addon_val = 0; total_net_premium = 0; total_premium = 0;
			if (event == 200000)
				total_addon_val = this.premiumJson[i].COVER_ITEMS[2].value
			else if (event == 100000)
				total_addon_val = this.premiumJson[i].COVER_ITEMS[2].value*2;
			total_net_premium = this.premiumJson[i].NET_PREMIUM - total_addon_val;
			//// console.log(total_addon_val)
			let service_tax;
			service_tax = Math.round(total_net_premium * .18);
			total_premium = total_net_premium + service_tax;
			this.premiumJson[i].NET_PREMIUM = total_net_premium;
			this.premiumJson[i].SERVICE_TAX = service_tax;
			this.premiumJson[i].TOTAL_PREMIUM = total_premium;
			i++;
		});
		i = 0;
		this.premiumJson.forEach(el => {
			if (event == 200000) {
				this.quoteJson.unnamed_passenger = 200000;

				let total_addon_val = this.premiumJson[i].COVER_ITEMS[2].value * 2;
				let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
				let service_tax;
				service_tax = Math.round(total_net_premium * .18);
				let total_premium = total_net_premium + service_tax;
				this.premiumJson[i].NET_PREMIUM = total_net_premium;
				this.premiumJson[i].SERVICE_TAX = service_tax;
				this.premiumJson[i].TOTAL_PREMIUM = total_premium;
			}
			else if (event == 100000) {
				this.quoteJson.unnamed_passenger = 100000;
				let total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value);
				let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
				let service_tax;
				service_tax = Math.round(total_net_premium * .18);
				let total_premium = total_net_premium + service_tax;
				this.premiumJson[i].NET_PREMIUM = total_net_premium;
				this.premiumJson[i].SERVICE_TAX = service_tax;
				this.premiumJson[i].TOTAL_PREMIUM = total_premium;
			}
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
			i++;
		});
	}
	changePaidCover(event)
	{
		var i = 0, total_addon_val, total_net_premium, service_tax, total_premium;
		this.premiumJson.forEach(el => {
			total_addon_val = 0; total_net_premium = 0; total_premium = 0;
			if (event == 200000)
				total_addon_val = this.premiumJson[i].COVER_ITEMS[0].value
			else if (event == 100000)
				total_addon_val = this.premiumJson[i].COVER_ITEMS[0].value*2;
			total_net_premium = this.premiumJson[i].NET_PREMIUM - total_addon_val;
			//// console.log(total_addon_val)
			let service_tax;
			service_tax = Math.round(total_net_premium * .18);
			total_premium = total_net_premium + service_tax;
			this.premiumJson[i].NET_PREMIUM = total_net_premium;
			this.premiumJson[i].SERVICE_TAX = service_tax;
			this.premiumJson[i].TOTAL_PREMIUM = total_premium;
			i++;
		});
		i = 0;
		this.premiumJson.forEach(el => {
			if (event == 200000) {
				this.quoteJson.paid_driver = 200000;

				let total_addon_val = this.premiumJson[i].COVER_ITEMS[0].value * 2;
				let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
				let service_tax;
				service_tax = Math.round(total_net_premium * .18);
				let total_premium = total_net_premium + service_tax;
				this.premiumJson[i].NET_PREMIUM = total_net_premium;
				this.premiumJson[i].SERVICE_TAX = service_tax;
				this.premiumJson[i].TOTAL_PREMIUM = total_premium;
			}
			else if (event == 100000) {
				this.quoteJson.paid_driver = 100000;
				let total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value);
				let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
				let service_tax;
				service_tax = Math.round(total_net_premium * .18);
				let total_premium = total_net_premium + service_tax;
				this.premiumJson[i].NET_PREMIUM = total_net_premium;
				this.premiumJson[i].SERVICE_TAX = service_tax;
				this.premiumJson[i].TOTAL_PREMIUM = total_premium;
			}
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
			i++;
		});
	}
	globalAddonChecked(event, v,bool=true)
	{

		var i = 0;
		let voluntary_amount_bajaj = 0;
		if (event.checked)
		{
			if (v == 0) { this.quoteJson.zero_dep = 1; }
			if (v == 1) { this.quoteJson.roadside_assistance = 1; }
			if (v == 2) { this.quoteJson.engine_protector = 1; }
			if (v == 3) { this.quoteJson.ncb_protector = 1; }
			if (v == 4) { this.quoteJson.loss_key_cover = 1; }
			if (v == 5) { this.quoteJson.consumable_cover = 1; }
			if (v == 6) { this.quoteJson.daily_allowance = 1; }
			if (v == 7) { this.quoteJson.invoice_return = 1; }
			if (v == 8) { this.quoteJson.tyre_cover = 1; }
			if (v == 9) { this.quoteJson.rim_damage = 1; }
			if (v ==10) { this.quoteJson.personal_cover = 1; }
			if (v ==11) { this.quoteJson.travel_cover = 1; }
			if (v ==12) { this.quoteJson.medical_cover = 1; }

			//if (v == 10) { this.quoteJson.personal_cover = 1; }
			this.globalAddonArray[v].isChecked = true;
			this.localStorage.setItem('globalAddonArray', this.globalAddonArray).subscribe(() => { });

			this.premiumJson.forEach(el =>
			{
				if (this.premiumJson[i].ADDON_ITEMS[v] && !this.premiumJson[i].ADDON_ITEMS[v].isChecked )
				{
						let total_addon_val = 0;
						let rsa_val = 0;
						/*********************************************** Kotak Bundle Addon Only **************************************************/
						if(this.premiumJson[i].PROVIDER_ID =='28' && bool==true && (v == 0 || v==2 ||v == 5 ||v == 7 || v == 1))
						{
							this.kotakAddonflag = true;
							if(v == 1)
							{
								//// console.log("Road side is stand alone");
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
							}
							else
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(!this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
								if(!this.premiumJson[i].ADDON_ITEMS[7].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[7].value);
								if(!this.premiumJson[i].ADDON_ITEMS[1].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);

								total_addon_val = total_addon_val - parseFloat(this.premiumJson[i].VOLUNTARY_DISCOUNT);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[7].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
							}
						}

						/*************************************************** TATA Bundle Addon Only ******************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='17' && bool==true)
						{

							if(v == 1)
							{
								//// console.log("Road side is stand alone");
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								this.tataRolloverPremium();
							}
							else if(v == 7)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(!this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(!this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
								if(!this.premiumJson[i].ADDON_ITEMS[7].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[7].value);
								if(!this.premiumJson[i].ADDON_ITEMS[8].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);
								if(!this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(!this.premiumJson[i].ADDON_ITEMS[11].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);
								//// console.log('total_addon_val',total_addon_val)

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[7].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[8].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[11].isChecked = true;
								this.tataRolloverPremium();
							}
							else if(v == 0)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(!this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(!this.premiumJson[i].ADDON_ITEMS[11].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[11].isChecked = true;
								this.tataRolloverPremium();
							}
							else if(v == 5 || v==2)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(!this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(!this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
								if(!this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(!this.premiumJson[i].ADDON_ITEMS[11].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);


								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[11].isChecked = true;
								this.tataRolloverPremium();
							}
							else if(v == 8)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(!this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
								if(!this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(!this.premiumJson[i].ADDON_ITEMS[11].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);
								if(!this.premiumJson[i].ADDON_ITEMS[8].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);


								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[11].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[8].isChecked = true;
								this.tataRolloverPremium();
							}
							else if(v == 4 || v==10 || v==11)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(!this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(!this.premiumJson[i].ADDON_ITEMS[11].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);
								//// console.log('total_addon_val',total_addon_val)

								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[11].isChecked = true;
								this.tataRolloverPremium();
							}
							else
							{
								if(!this.premiumJson[i].ADDON_ITEMS[v].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								this.tataRolloverPremium();
							}
							if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
							{
								rsa_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
							}
						}

						/*************************************************** Future Bundle Addon Only ***********************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='5' && bool==true)
						{
							if(v == 0 || v==4 || v==10)
							{
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.futureRolloverPremium();
							}
							else
							{
								if(v == 2 || v==3 || v==5 || v==7 || v==8)
								{
									this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
									this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
									this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
									this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								}
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								this.futureRolloverPremium();
							}

						}
						/*************************************************** Magma Bundle Addon Only ***********************************************/
						/* else if(this.premiumJson[i].PROVIDER_ID =='21' && bool==true)
						{
							if(v == 3 || v == 4 || v == 6 || v == 10)
							{
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[3].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								this.magmaRolloverPremium();
							}
							else if(v == 0 || v == 1 || v==2 || v==7)
							{

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								this.magmaRolloverPremium();
							}
							else
							{
								if(this.zeroDept._checked==true || this.roadSide._checked==true)
								{
									this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
									this.magmaRolloverPremium();
								}

							}

						}  */
						/*************************************************** Oriental Bundle Addon Only ***********************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='11' && bool==true)
						{
							if(v == 0)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.orientalRolloverPremium();
							}
							else
							{
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;

							}

						}
						/*************************************************** New India Bundle Addon Only ***********************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='18' && bool==true)
						{
							if(v == 0)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.newindiaRolloverPremium();
							}
							else
							{
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;

							}

						}
						/*************************************************** Reliance Bundle Addon Only ***********************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='12' && bool==true)
						{
							if(v == 0)
							{

								//// console.log("Zero Dept is stand alone");
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								if(this.keyReplace._checked==false && this.consuCover._checked==false && this.engineProtect._checked==false)
								{
									this.relianceRolloverPremium();
								}
							}
							else if(v == 5 || v==2)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(!this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = true;
								this.relianceRolloverPremium();
							}
							else if(v == 4)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(!this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(!this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
								if(!this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = true;
								this.relianceRolloverPremium();
							}
							else
							{
								if(v!=1) // Reliance No effect with rsa
								{
									this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
								}
							}

						}
						/***************************************************** Bajaj Bundle Addon Only ************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='2' && bool==true && (v == 0 || v==1 ||v == 2 ||v == 4))
						{
							if(v==1 || v==4)
							{
								// // console.log("RSA & Losskey default added");
							}
							else if(v==0 || v==2)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(!this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);

								total_addon_val = total_addon_val - parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
							}
						}
						/******************************************************** Hdfc Bundle Addon Only ************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='6' && this.premiumJson[i].PREMIUM_TYPE =='1' && bool==true && (v == 0 || v==1 ||v == 2 ||v == 3 ||v == 5)){
							if(v==0 || v==1)
							{
								total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = true;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = true;
							}else{
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
							}


						}
						/********************************************** All Others Comp Only ***************************************************/
						else
						{
							total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
							this.premiumJson[i].ADDON_ITEMS[v].isChecked = true;
						}


						let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;
						let service_tax;
						service_tax = Math.round(total_net_premium * .18);
						let total_premium = total_net_premium + service_tax;
						this.premiumJson[i].NET_PREMIUM = total_net_premium;
						this.premiumJson[i].SERVICE_TAX = service_tax;
						this.premiumJson[i].TOTAL_PREMIUM = total_premium+rsa_val;
						let prem_key = this.premiumJson[i].PROVIDER_ID;
						this.globalPremAddonArray[prem_key]=this.premiumJson[i].ADDON_ITEMS;
						this.localStorage.setItem('globalPremAddonArray', this.globalPremAddonArray).subscribe(() => { });

				}
				i++;
			})
		}
		else
		{
			i = 0;
			if (v == 0) { this.quoteJson.zero_dep = 0; }
			if (v == 1) { this.quoteJson.roadside_assistance = 0; }
			if (v == 2) { this.quoteJson.engine_protector = 0; }
			if (v == 3) { this.quoteJson.ncb_protector = 0; }
			if (v == 4) { this.quoteJson.loss_key_cover = 0; }
			if (v == 5) { this.quoteJson.consumable_cover = 0; }
			if (v == 5) { this.quoteJson.daily_allowance = 0; }
			if (v == 7) { this.quoteJson.invoice_return = 0; }
			if (v == 8) { this.quoteJson.tyre_cover = 0; }
			if (v == 9) { this.quoteJson.rim_damage = 0; }
			if (v ==10) { this.quoteJson.personal_cover = 0; }
			if (v ==11) { this.quoteJson.travel_cover = 0; }
			if (v ==12) { this.quoteJson.medical_cover = 0; }
			//if (v == 10) { this.quoteJson.personal_cover = 0; }
			this.globalAddonArray[v].isChecked = false;
			this.localStorage.setItem('globalAddonArray', this.globalAddonArray).subscribe(() => { });
			this.premiumJson.forEach(el => {

				if (this.premiumJson[i].ADDON_ITEMS[v] && this.premiumJson[i].ADDON_ITEMS[v].isChecked)
				{
						let total_addon_val = 0;
						let rsa_val =0;
						let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM);
						/*****************************************Bundle Addon selection For TATA**************************************************/
						if(this.premiumJson[i].PROVIDER_ID =='17')
						{
							if(v == 1)
							{
								//// console.log("Road side is stand alone");
								rsa_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								this.tataRolloverPremium();
							}
							else if(v == 7)
							{
								if(this.zeroDept._checked==false && this.engineProtect._checked==false && this.consuCover._checked==false)
								{
									if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
									if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
										rsa_val =  parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
									if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
									if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
									if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
									if(this.premiumJson[i].ADDON_ITEMS[7].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[7].value);
									if(this.premiumJson[i].ADDON_ITEMS[8].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);
									if(this.premiumJson[i].ADDON_ITEMS[10].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
									if(this.premiumJson[i].ADDON_ITEMS[11].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);
									//// console.log('total_addon_val',total_addon_val)

									this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[7].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[8].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[11].isChecked = false;
									total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
									this.tataRolloverPremium();
								}
								else
								{
									if(this.engineProtect._checked==true || this.consuCover._checked==true)
									{
										if(this.premiumJson[i].ADDON_ITEMS[7].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[7].value);
										if(this.premiumJson[i].ADDON_ITEMS[8].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);
										//// console.log('total_addon_val',total_addon_val);

										this.premiumJson[i].ADDON_ITEMS[7].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[8].isChecked = false;
										total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
										this.tataRolloverPremium();
									}
									else
									{
										if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
											rsa_val =  parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
										if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
										if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
										if(this.premiumJson[i].ADDON_ITEMS[7].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[7].value);
										if(this.premiumJson[i].ADDON_ITEMS[8].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);
										//// console.log('total_addon_val',total_addon_val)

										this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[7].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[8].isChecked = false;
										total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
										this.tataRolloverPremium();
									}
								}

							}
							else if(v == 5 || v==2)
							{
								if(this.invoicePrice._checked==false  && (this.engineProtect._checked==false || this.consuCover._checked==false))
								{
									if(this.zeroDept._checked==true)
									{
										if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
										if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
										this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
									}
									else
									{
										if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
										if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
											rsa_val =  parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
										if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
										if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
										if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
										if(this.premiumJson[i].ADDON_ITEMS[10].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
										if(this.premiumJson[i].ADDON_ITEMS[11].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);

										this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[11].isChecked = false;
									}

									total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
									this.tataRolloverPremium();
								}
							}
							else if(v == 8)
							{

								if(this.invoicePrice._checked==false)
								{
									if(this.engineProtect._checked==true || this.consuCover._checked==true)
									{
										if(this.premiumJson[i].ADDON_ITEMS[8].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);
										this.premiumJson[i].ADDON_ITEMS[8].isChecked = false;
									}
									else
									{
										if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
										if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
											rsa_val =  parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
										if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
										if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
										if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
										if(this.premiumJson[i].ADDON_ITEMS[10].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
										if(this.premiumJson[i].ADDON_ITEMS[11].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);
										if(this.premiumJson[i].ADDON_ITEMS[8].isChecked)
											total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[8].value);

										this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[11].isChecked = false;
										this.premiumJson[i].ADDON_ITEMS[8].isChecked = false;
									}

									total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
									this.tataRolloverPremium();
								}

							}
							else if(v == 0)
							{
								if(this.tyreCover._checked==false && this.invoicePrice._checked==false && this.consuCover._checked==false && this.engineProtect._checked==false)
								{
									if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
									if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
										rsa_val =  parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
									if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
									if(this.premiumJson[i].ADDON_ITEMS[10].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
									if(this.premiumJson[i].ADDON_ITEMS[11].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);
									//// console.log('total_addon_val',total_addon_val)

									this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[11].isChecked = false;
									total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
									this.tataRolloverPremium();
								}
							}
							else if(v == 4 || v==10 || v==11)
							{
								if(this.zeroDept._checked==false && this.tyreCover._checked==false && this.invoicePrice._checked==false && this.consuCover._checked==false && this.engineProtect._checked==false)
								{
								if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
									rsa_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
								if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);
								if(this.premiumJson[i].ADDON_ITEMS[11].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[11].value);

								this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[11].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
								this.tataRolloverPremium();
								}
							}
							else
							{
								if(this.premiumJson[i].ADDON_ITEMS[v].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
								this.tataRolloverPremium();
							}
						}
						/*****************************************Bundle Addon selection For Future**************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='5')
						{
							if(v == 0 || v==4 || v==10)
							{
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
								this.futureRolloverPremium();
							}
							else
							{
								if(v == 2 || v==3 || v==5 || v==7 || v==8)
								{
									this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
								}
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								this.futureRolloverPremium();
							}

						}
						/*****************************************Bundle Addon selection For Magma**************************************************/
						/*  else if(this.premiumJson[i].PROVIDER_ID =='21')
						{
							if(v == 0 || v==1)
							{
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[3].isChecked = false;
								this.magmaRolloverPremium();
							}
							else
							{
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								this.magmaRolloverPremium();
							}

						}  */
						/*****************************************Bundle Addon selection For NEW INDIA**************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='18')
						{
							if(v == 0)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.newindiaRolloverPremium();
							}
							else
							{
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;

							}

						}
						/*****************************************Bundle Addon selection For Oriental**************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='11')
						{
							if(v == 0)
							{
								if(!this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.orientalRolloverPremium();
							}
							else
							{
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;

							}

						}
						/*****************************************Bundle Addon selection For Reliance**************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='12')
						{
							if(v == 0)
							{
								if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
								if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(this.premiumJson[i].ADDON_ITEMS[10].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[10].value);

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[10].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;

								if(this.keyReplace._checked==false && this.consuCover._checked==false && this.engineProtect._checked==false)
								{
									total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
								}
								else
								{
									this.relianceRolloverPremium();
								}
							}
							else if(v == 5 || v==2)
							{
								if(this.zeroDept._checked==false)
								{
									if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);

									this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								}
								if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
								if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);

								this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
								this.relianceRolloverPremium();
							}
							else if(v == 4)
							{
								if(this.zeroDept._checked==false)
								{
									if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);

									this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								}
								if((this.engineProtect._checked==false && this.consuCover._checked==false))
								{
									if(this.premiumJson[i].ADDON_ITEMS[4].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[4].value);
									if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
									if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
										total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);

									this.premiumJson[i].ADDON_ITEMS[4].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
									this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
								}

								this.relianceRolloverPremium();
							}
							else
							{
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
							}
						}
						/*****************************************Bundle Addon selection For Kotak**************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='28' && bool==true && (v == 0 || v==2 ||v == 5 ||v == 7 || v == 1))
						{
							this.kotakAddonflag = false;
							if(v == 1 && (this.zeroDept._checked==false && this.engineProtect._checked==false && this.invoicePrice._checked==false && this.consuCover._checked==false))
							{
								//// console.log("Road side is stand alone");
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
							}
							else
							{
								if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);
								if(this.premiumJson[i].ADDON_ITEMS[5].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[5].value);
								if(this.premiumJson[i].ADDON_ITEMS[7].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[7].value);
								if(this.premiumJson[i].ADDON_ITEMS[1].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
								//// console.log('Kotak total_addon_val',total_addon_val)
								//// console.log('VOLUNTARY_DISCOUNT',this.premiumJson[i].VOLUNTARY_DISCOUNT)
								total_addon_val = total_addon_val - parseFloat(this.premiumJson[i].VOLUNTARY_DISCOUNT);
								//// console.log('Kotak total_addon_val',total_addon_val)
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[5].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[7].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
							}


						}

						/*****************************************Bundle Addon selection For Kotak**************************************************/

						/*****************************************Bundle Addon selection For Bajaj**************************************************/
						else if(this.premiumJson[i].PROVIDER_ID =='2' && bool==true && (v == 0 || v==1 ||v == 2 ||v == 4))
						{
							if(v==1 || v==4)
							{
								//// console.log("RSA & Losskey default added");
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM)+total_addon_val;
							}
							else if(v==0 || v==2)
							{

								if(this.premiumJson[i].ADDON_ITEMS[0].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								if(this.premiumJson[i].ADDON_ITEMS[2].isChecked)
									total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[2].value);

								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[2].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[4].isChecked = true;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM + this.premiumJson[i].ADDON_ITEMS[4].value) - total_addon_val;

							}
						}
						else if(this.premiumJson[i].PROVIDER_ID =='6' && this.premiumJson[i].PREMIUM_TYPE =='1' && bool==true && (v == 0 || v==1 ||v == 2 ||v == 3 ||v == 5))
						{
							if(v==0 || v==1)
							{
								total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[0].value);
								total_addon_val = total_addon_val + parseFloat(this.premiumJson[i].ADDON_ITEMS[1].value);
								this.premiumJson[i].ADDON_ITEMS[0].isChecked = false;
								this.premiumJson[i].ADDON_ITEMS[1].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
							}else{
								total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
								this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
								total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
							}


						}
						else
						{
							total_addon_val = parseFloat(this.premiumJson[i].ADDON_ITEMS[v].value);
							this.premiumJson[i].ADDON_ITEMS[v].isChecked = false;
							total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
						}
						/*****************************************Bundle Addon selection For bajaj**************************************************/


						let service_tax;
						service_tax = Math.round(total_net_premium * .18);
						let total_premium = total_net_premium + service_tax;
						this.premiumJson[i].NET_PREMIUM = total_net_premium;
						this.premiumJson[i].SERVICE_TAX = service_tax;
						this.premiumJson[i].TOTAL_PREMIUM = total_premium-rsa_val;

						let prem_key = this.premiumJson[i].PROVIDER_ID;
						this.globalPremAddonArray[prem_key]=this.premiumJson[i].ADDON_ITEMS;
						this.localStorage.setItem('globalPremAddonArray', this.globalPremAddonArray).subscribe(() => { });

				}
				i++;
			})
		}
	}

	sortbymode()
	{
		let pjson = this.premiumJson;
		//// console.log('PJSON',pjson);

		function sort_by_key(array, key)
		{
			return array.sort(function(a, b)
			{

				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}


		pjson = sort_by_key(pjson, 'ONLINE_OFFLINE');

		//// console.log('PJSON2',pjson);

		//this.premiumJson = pjson;
		//// console.log("PROVIDER_ID:",this.premiumJson[0].PROVIDER_ID);
		this.premiumJson = pjson;
	}
	sortByPremium()
	{
		this.sort_value = "PREMIUM";
		let pjson = this.premiumJson;
		//// console.log('PJSON',pjson);

		function sort_by_key(array, key)
		{
			return array.sort(function(a, b)
			{

				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}
		pjson = sort_by_key(pjson, 'NET_PREMIUM');
		if(this.sort_type=="ASC")
		{
			this.sort_type = "DESC";
			this.premiumJson = pjson;

		}
		else
		{
			this.sort_type = "ASC";
			this.premiumJson = pjson.reverse();

		}
	}
	changeSort(event)
	{
		this.sort_type = "ASC";
		if(this.sort_value == "IDV")
		{
			this.sortByIDV();
		}
		else
		{
			this.sortByPremium();
		}
	}
	changeOrder(event)
	{
		this.sort_type = event;
		if(this.sort_value == "IDV")
		{
			this.sortByIDV();
		}
		else
		{
			this.sortByPremium();
		}
	}
	sortByPremiumDefault()
	{
		let pjson = this.premiumJson;
		//// console.log('PJSON',pjson);

		function sort_by_key(array, key)
		{
			return array.sort(function(a, b)
			{

				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}
		pjson = sort_by_key(pjson, 'NET_PREMIUM');
		this.premiumJson = pjson;
		this.sortbymode();
	}
	sortByIDV()
	{
		let pjson = this.premiumJson;
		//// console.log('PJSON',pjson);
		this.sort_value = "IDV";
		function sort_by_key(array, key)
		{
			return array.sort(function(a, b)
			{

				var x = a[key];
				var y = b[key];
				return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			});
		}
		pjson = sort_by_key(pjson, 'IDV');
		if(this.sort_type=="ASC")
		{
			this.sort_type = "DESC";
			this.premiumJson = pjson;
		}
		else
		{
			this.sort_type = "ASC";
			this.premiumJson = pjson.reverse();
		}
	}
	globalAdditionalCoverChecked(event: any='', v)
	{

		if (event.checked && v == 2) {
			this.pa_cover_checked = true;
		}
		if (!event.checked && v == 2) {
			this.pa_cover_checked = false;
		}
		if (event.checked && v == 0) {
			this.pa_paid_checked = true;
		}
		if (!event.checked && v == 0) {
			this.pa_paid_checked = false;
		}
		this.quoteJson.pa_cover_checked = this.pa_cover_checked;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		var i = 0;
		if (event.checked || event == true)
		{
			this.globalAdditionalCover[v].isChecked = true;
			this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => { });
			this.premiumJson.forEach(el => {
				if(this.premiumJson[i].PROVIDER_ID){
				}
				//if(this.premiumJson[i].PROVIDER_ID == 170 && v == 1)
				//{
					//Owner Driver over is mandatory
				//}
				//else
				//{
					this.premiumJson[i].COVER_ITEMS[v].isChecked = true;

					let total_addon_val = 0;

					if (v == 2 && this.quoteJson.unnamed_passenger == 100000)
					{
						if(this.premiumJson[i].COVER_ITEMS[2].value > 0)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value);
						}
					}
					else if (v == 2 && this.quoteJson.unnamed_passenger == 200000)
					{
						if(this.premiumJson[i].COVER_ITEMS[2].value > 0)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value) * 2.0;
						}
					}
					else if (v == 0 && this.quoteJson.paid_driver == 100000)
					{
						if(this.premiumJson[i].COVER_ITEMS[0].value > 0)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value);
						}
					}
					else if (v == 0 && this.quoteJson.paid_driver == 200000)
					{
						if(this.premiumJson[i].COVER_ITEMS[0].value > 0)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value) * 2.0;
						}
					}
					else
					{
						if(this.premiumJson[i].COVER_ITEMS[v].value > 0)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
						}
					}


					let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) + total_addon_val;

					let service_tax;
					service_tax = Math.round(total_net_premium * .18);
					let total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;

					if (v == 0) {
						this.quoteJson.paid_driver = 100000;
						this.quoteJson.paid_driver_type = true;
						this.paid_cover = 100000;
					}
					else if (v == 1) {
						this.quoteJson.pa_owner = 1;
						this.quoteJson.pa_owner_type = true;
					}
					else if (v == 2) {
						this.quoteJson.is_unnamed_passenger = 1;
						this.quoteJson.unnamed_passenger = 100000;
						this.pa_cover = 100000;
					}
					else if (v == 4) {
						this.quoteJson.ll_paid_driver = 1;
						this.quoteJson.ll_paid_driver_type = true;
						this.recalculateBtnShowHide = true;
					}
				//}
				i++;
			})


		}
		else
		{
			i = 0;
			this.globalAdditionalCover[v].isChecked = false;

			this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => { });
			this.premiumJson.forEach(el => {
				if((this.premiumJson[i].PROVIDER_ID == 17 || this.premiumJson[i].PROVIDER_ID ==5) && v == 1)
				{
					//Owner Driver over is mandatory
				}
				else
				{
					this.premiumJson[i].COVER_ITEMS[v].isChecked = false;
					let total_addon_val = 0; /* = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value); */
					if(v == 0)
					{
						if (this.paid_cover == 200000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value) * 2.0;
						}
						else if (this.paid_cover == 100000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[0].value);
						}
					}
					else if(v == 2)
					{
						if (this.pa_cover == 200000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value) * 2.0;
						}
						else if (this.pa_cover == 100000)
						{
							total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[2].value);
						}
					}
					else {
						total_addon_val = parseFloat(this.premiumJson[i].COVER_ITEMS[v].value);
					}
					let total_net_premium = parseFloat(this.premiumJson[i].NET_PREMIUM) - total_addon_val;
					let service_tax;
					service_tax = Math.round(total_net_premium * .18);
					let total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;

					if (v == 0) {
						this.quoteJson.paid_driver = 0;
						this.quoteJson.paid_driver_type = false;

					}
					else if (v == 1) {
						this.quoteJson.pa_owner = 0;
						this.quoteJson.pa_owner_type = false;
					}
					else if (v == 2) {
						this.quoteJson.is_unnamed_passenger = 0;
						this.quoteJson.unnamed_passenger = 0;
					}
					else if (v == 4) {
						this.quoteJson.ll_paid_driver = 0;
						this.quoteJson.ll_paid_driver_type = false;
						this.reSetRecalculate();
					}
				}
				i++;
			})
			if (v == 1) {
				this.openDialogPaOwner();
			}

		}
	}

	changeSelected(value, f = 0) {
		if (f == 2) {
			this.is_voluntary_deduct = true;
			this.quoteJson.is_voluntary_deduct = true;
		}
		else if (f == 1) {
			this.is_voluntary_deduct = false;
			this.quoteJson.is_voluntary_deduct = false;
		}
		this.quoteJson.voluntary_deduct_am = value;
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}
	showHideRecalculateBtn(event) {
		if (event.checked) {
			this.recalculateBtnShowHide = true;
		}
		else {
			this.reSetRecalculate();
		}
	}
	onChangeElecAcc(event) {
		if (event.checked) {
			this.recalculateBtnShowHide = true;
			this.quoteJson.elec_acc_type = true;
			this.globalAccessories[0].isChecked = true;
		}
		else {
			this.globalAccessories[0].isChecked = false;
			this.reSetRecalculate();
			this.quoteJson.elec_acc_type = false;
			this.quoteJson.elec_acc = 0;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}
	onChangeElecAccSlider(event){
		this.recalculateBtnShowHide = true;
	}
	onChangeNonElecAcc(event) {
		if (event.checked) {
			this.recalculateBtnShowHide = true;
			this.quoteJson.non_elec_acc_type = true;
			this.globalAccessories[1].isChecked = true;
		}
		else {
			this.reSetRecalculate();
			this.quoteJson.non_elec_acc_type = false;
			this.globalAccessories[1].isChecked = false;
			this.quoteJson.non_elec_acc = 0;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}
	onChange_CNG_LPG_Kit(event) {
		if (event.checked) {
			this.recalculateBtnShowHide = true;
			this.quoteJson.CNG_LPG_Kit_type = true;
			this.globalAccessories[2].isChecked = true;
			this.quoteJson.lpg_cngkit = 10000;
		}
		else {
			this.reSetRecalculate();
			this.quoteJson.CNG_LPG_Kit_type = false;
			this.globalAccessories[2].isChecked = false;
			this.quoteJson.lpg_cngkit = 0;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});
		}
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
	}

	recalculate() {
		this.reSetRecalculate();
		if (this.elec_below_condition || this.non_elec_below_condition || this.lpg_below_condition)
			return;
		this.loader = true;
		this.apiService.getPremium(this.quoteJson)
		this.startTimer(20);
		if (this.quoteJson.elec_acc == 0) {
			this.quoteJson.elec_acc_type = false;
		}
		else {
			this.quoteJson.elec_acc_type = true;
		}
		if (this.quoteJson.non_elec_acc == 0) {
			this.quoteJson.non_elec_acc_type = false;
		}
		else {
			this.quoteJson.non_elec_acc_type = true;
		}
		if (this.quoteJson.unnamed_passenger == 0) {
			this.quoteJson.unnamed_passenger = 100000;
		}
		/* 		this.localStorage.setItem('tmpPremiumJson', this.premiumJson).subscribe(() => {
				}); */
		this.localStorage.setItem('globalAddonArray', this.globalAddonArray).subscribe(() => { });
		this.localStorage.setItem('globalAccessories', this.globalAccessories).subscribe(() => { });
		this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => { });
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
			this.onNoClick();
		});
	}
	reSetRecalculate(){
		this.recalculateBtnShowHide = false;
		this.globalAccessories.forEach(el => {
			if (el.isChecked) {
				this.recalculateBtnShowHide = true;
			}
		});
	}
	changeTPPD(f = 0)
	{
		if (f == 2) {
			this.is_tppd_deduct = true;
			this.quoteJson.is_tppd_deduct = true;
		}
		else if (f == 1) {
			this.is_tppd_deduct = false;
			this.quoteJson.is_tppd_deduct = false;
		}
		this.recalculatePOPUPNotClose();
	}
	change_legal_liability_paid_driver(event) {
		this.quoteJson.ll_paid_driver = 0;
		this.quoteJson.ll_paid_driver_type = false;
		this.recalculatePOPUPNotClose();
		//this.recalculate();
	}
	recalculatePOPUPNotClose() {
		this.reSetRecalculate();
		if (this.elec_below_condition || this.non_elec_below_condition || this.lpg_below_condition)
			return;
		this.loader = true;
		this.startTimer(20);
		this.apiService.getPremium(this.quoteJson)
		if (this.quoteJson.elec_acc == 0) {
			this.quoteJson.elec_acc_type = false;
		}
		else {
			this.quoteJson.elec_acc_type = true;
		}
		if (this.quoteJson.non_elec_acc == 0) {
			this.quoteJson.non_elec_acc_type = false;
		}
		else {
			this.quoteJson.non_elec_acc_type = true;
		}
		if (this.quoteJson.motorAssociationDiscount) {
		}
		if (this.quoteJson.unnamed_passenger == 0) {
			this.quoteJson.unnamed_passenger = 100000;
		}
		/* 		this.localStorage.setItem('tmpPremiumJson', this.premiumJson).subscribe(() => {
				}); */
		this.localStorage.setItem('globalAddonArray', this.globalAddonArray).subscribe(() => { });
		this.localStorage.setItem('globalAccessories', this.globalAccessories).subscribe(() => { });
		this.localStorage.setItem('globalAdditionalCover', this.globalAdditionalCover).subscribe(() => { });
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			this.callPremiumApiService();
		});
	}
	occupationTypeDiscount(v) {
		this.quoteJson.occupationTypeDiscountValue = v;
	}
	motorAssociationDiscount(v) {
		if (v) {
			this.motorAssociationDiscountFlag = true;
			this.quoteJson.motorAssociationDiscount = true;
			this.recalculateBtnShowHide = true;
		}
		else {
			this.motorAssociationDiscountFlag = false;
			this.quoteJson.motorAssociationDiscount = false;
			this.reSetRecalculate();
			this.callPremiumApiService();
		}
	}
	setAntiTheftDeviceDiscount(f) {
		if (f) {
			this.AntiTheftDeviceDiscount = true;
			this.quoteJson.antiTheftDevice = 1;
			this.recalculateBtnShowHide = true;
			this.globalDisCountArray[0].isChecked = true;
			this.localStorage.setItem('globalDisCountArray', this.globalDisCountArray).subscribe(() => { });
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		}
		else {
			this.AntiTheftDeviceDiscount = false;
			this.quoteJson.antiTheftDevice = 0;
			this.reSetRecalculate();
			this.globalDisCountArray[0].isChecked = false;
			this.localStorage.setItem('globalDisCountArray', this.globalDisCountArray).subscribe(() => { });
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
			this.callPremiumApiService();
		}
	}
	setHandicappedDiscount(v) {
		if (v) {
			this.HandicappedDiscount = true;
			this.quoteJson.HandicappedDiscount = true;
			this.globalDisCountArray[8].isChecked = true;
			this.recalculateBtnShowHide = true;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});
		}
		else {
			this.HandicappedDiscount = false;
			this.quoteJson.HandicappedDiscount = false;
			this.globalDisCountArray[8].isChecked = false;
			this.reSetRecalculate();
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
				this.callPremiumApiService();
			});

		}
	}
	setLpg() {
		if (this.quoteJson.lpg_cngkit < 10000 || this.quoteJson.lpg_cngkit > this.maxIDV)
		{
			this.lpg_below_condition = true;
		}
		else
		{
			this.lpg_below_condition = false;
		}
	}
	set_elec_acc() {
		if (this.quoteJson.elec_acc < 0 || this.quoteJson.elec_acc > this.maxIDV)
			this.elec_below_condition = true;
		else
			this.elec_below_condition = false;
	}
	set_non_elec_acc() {
		if (this.quoteJson.non_elec_acc < 0 || this.quoteJson.non_elec_acc > this.maxIDV)
			this.non_elec_below_condition = true;
		else
			this.non_elec_below_condition = false;
	}
	set_kotak_elec_acc(){
		if (this.quoteJson.elec_acc < this.minElec || this.quoteJson.elec_acc > this.maxElec)
			this.elec_below_condition = true;
		else
			this.elec_below_condition = false;
	}
	set_kotak_non_elec_acc(){
		if (this.quoteJson.non_elec_acc < this.minElec || this.quoteJson.non_elec_acc > this.maxElec)
			this.non_elec_below_condition = true;
		else
			this.non_elec_below_condition = false;
	}
	setLpgKotak() {
			if (this.quoteJson.lpg_cngkit < 10000 || this.quoteJson.lpg_cngkit > 60000)
				this.lpg_below_condition = true;
			else
				this.lpg_below_condition = false;
		}
	scroll(id)
	{
		let el = document.getElementById(id);
		setTimeout(() => {    //<<<---    using ()=> syntax
			el.scrollIntoView();
		}, 300);
	}
	openDialogPaOwner(i = 'blank', premiumItem: any = '', total_addon_val = 0): any {
		const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
			width: '400px',
			data: {}
		});
		dialogRef.disableClose = true;
		dialogRef.afterClosed().subscribe(result => {
			let returnData = result;
			this.cpaCover = returnData.cpa_cover;
			this.quoteJson.cpaCover=this.cpaCover;
		    this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });

			if (i != 'blank') {
				if (returnData == 'no') {
					this.premiumJson[i].COVER_ITEMS[1].isChecked = true;
					let total_net_premium = parseFloat(premiumItem.NET_PREMIUM) + total_addon_val;
					let service_tax = Math.round(total_net_premium * .18);
					let total_premium = total_net_premium + service_tax;
					this.premiumJson[i].NET_PREMIUM = total_net_premium;
					this.premiumJson[i].SERVICE_TAX = service_tax;
					this.premiumJson[i].TOTAL_PREMIUM = total_premium;
				}
			}
			else {
				if (returnData == 'no') {
					this.thirdPartyCover[1].isChecked = true;
					this.thirdPartyCoverContrl(true, 1);
				}
			}
		});
	}
	call_me_back_submit() {
		let callMeBack = this.callMeBack.value;
		this.localStorage.getItem('quoteJson').subscribe((data: any) => {
			let getquoteJson = {
				"QID": data.quoteID,
				"cust_email":data.cust_email,
				"mobileNo": callMeBack.MobileNo
			};
			this.apiService.call_me_back_submit(getquoteJson).subscribe(data => {
				this.callMeBackSubmit = false;
			});
		});
	}
	goBackToQuote() {
		let backToQuote = {
			back: true
		}
		this.localStorage.setItem('backToQuote', backToQuote).subscribe(() => {
			this.router.navigate(['/']);
		});
	}
	showHideBtn(displayAllAddon) {
		if (!displayAllAddon)
			this.buttonName = 'Show';
		else
			this.buttonName = 'Hide';
	}
	addonLoopFn(items) {
		this.providerFeatureCount	=0;
		let curObj	=this;
		items.forEach(function (item) {
			if( item.isChecked && (item.value>0 || item.isInclude) ){
				curObj.providerFeatureCount	=curObj.providerFeatureCount+1;
			}
		});
    }

	coverLoopFn(items) {
		let curObj	=this;
		items.forEach(function (item) {
			if( item.isChecked && item.value>0 ){
				curObj.providerFeatureCount	=curObj.providerFeatureCount+1;
			}
		});
    }

	coverLoopFnTp(items) {
		this.providerFeatureCount	=0;
		let curObj	=this;
		items.forEach(function (item) {
			if( item.isChecked && item.value>0 ){
				curObj.providerFeatureCount	=curObj.providerFeatureCount+1;
			}
		});
    }

	iterateProviderFeature() {
		this.providerFeatureCount	=this.providerFeatureCount+1;
    }
	insertCRMQuoteCall(quoteJson)
	{
		this.apiService.insertCRMQuote(quoteJson).subscribe(response => {
		});
	}

	updateQuoteData()
	{
		this.apiService.updateQuotePHP(this.quoteJson,this.quoteJson.quoteID).toPromise().then(res => {});
	}
	selectedQuote(providerID:string, isChecked: boolean)
	{
		if(isChecked) {
			this.selectedArr.push(providerID);
		}
		else
		{
			let index = this.selectedArr.indexOf(providerID);
			this.selectedArr.splice(index,1);
		}
	}

	showMoreAction(type:any){
		this.priorityData.show_com_all=!this.priorityData.show_com_all;
		if( this.prev_policy_type =='thirdParty' ){
			this.track_button('SHOW-MORE-TP-FW');
		}
		if( type=='Comprehensive' ){
			this.track_button('SHOW-MORE-COM-FW');
		}
	}

	track_button(buttonClassname)
	{
		let userTrackData={
			"unique_id":this.quoteJson.uniqueID,
			"quote_id":this.quoteJson.quoteID,
			"page_id":"3",
			"btn_id":buttonClassname,
			"serviceUrl":""
		};
		this.apiService.track_button(userTrackData).subscribe(data => {});
	}
	getPayoutPayment(el)
	{
		if(this.userJson && this.userJson.role_type=='20')
		{
			el.pa_owner=this.quoteJson.pa_owner;
			el.paid_driver=this.quoteJson.paid_driver;
			el.unnamed_passenger=this.quoteJson.unnamed_passenger;
			el.ll_paid_driver=this.quoteJson.ll_paid_driver;
			el.quoteID=this.quoteJson.quoteID;
			el.source=this.userJson.parent_user_code;
			el.uname=this.userJson.user_name;
			this.apiService.calculatePayoutPayment(el).subscribe(response => {
				el.PAY_OUT_PREMIUM = response;
				el.PAY_OUT = el.TOTAL_PREMIUM - response;
			});
		}
		else if(this.userJson && (this.userJson.role_type=='8' || this.userJson.role_type=='12'))
		{
			if(this.quoteJson.b2b && this.quoteJson.b2b==1)
			{
				el.pa_owner=this.quoteJson.pa_owner;
				el.paid_driver=this.quoteJson.paid_driver;
				el.unnamed_passenger=this.quoteJson.unnamed_passenger;
				el.ll_paid_driver=this.quoteJson.ll_paid_driver;
				el.quoteID=this.quoteJson.quoteID;
				el.source=this.userJson.parent_user_code;
				el.uname=this.userJson.user_name;
				el.user_code=this.userJson.user_code;
				el.wallet_balance = this.userJson.wallet_balance;
				this.apiService.calculatePayoutPaymentPOS(el).subscribe(response => {
					el.PAY_OUT_PREMIUM = response;
					el.PAY_OUT = el.TOTAL_PREMIUM - response;
				});
			}
		}


	}
	// ----------------Lahu--------------------------------------
	openCompare(event: any, item: any){
		this.showCompareList = true;
		const isChecked = event.checked;
		this.screenWidth = window.innerWidth;
		if (isChecked) {
			if(this.screenWidth <= 426){
				if(this.compareList.length < 2){
					this.compareList.push(item);
				
					// this.compareJson.push(item[0]);
				}else{
					alert('you can compare only two premium')
	
				}
			}else if(this.screenWidth >= 425){
				if(this.compareList.length < 3){
					this.compareList.push(item);
				
					// this.compareJson.push(item[0]);
				}else{
					alert('you can compare only three premium')
	
				}
			}
		} else {
			const index = this.compareList.indexOf(item);
			if (index !== -1) {
				this.compareList.splice(index, 1);
				// this.compareJson.splice(this.compareJson.indexOf(item[0]), 1);
			}
			if(this.compareList.length < 1){
				this.showCompareList = false
			}
		}
	}
	isCheckCheckBox(item :any){
		return this.compareList.includes(item);
	}
	onCloseCompare(){
		this.showCompareList = false;
		this.compareList.splice(0)
	}
	clearItem(val:any){
		const index = this.compareList.findIndex(i => i.id === val.id);
		if (index !== -1) {
		  this.compareList.splice(index, 1);
		}

		if(this.compareList.length < 1){
			this.showCompareList = false
		}
	}
	getClassBasedOnLength(){
		if(this.compareList.length <= 2){
			return 'col-3'
		}else if(this.compareList.length <= 3){
			return 'col-2'
		}
	}
	quoteComparePdfDownload() {
		let url = this.APIURL + "quote-compare/quote-compare-pdf-download.php?quoteid=" + this.quoteJson.quoteID + "&data=" + JSON.stringify(this.compareJson);
		window.open(url, "_blank");
	}
	activityPoints(content): void {
		this.dialogRef = this.dialog.open(content, {
			panelClass: 'activity-modal'
		});
		this.dialogRef.afterClosed().subscribe(result => {
		});
	}
}
@Component({
	selector: 'dialog-overview-example-dialog',
	templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
	cpaCover: any;

	constructor(
		public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any) { }
	onNoClick(): void {
		if(this.cpaCover == undefined){
			this.cpaCover =0;
		}
		this.dialogRef.close({cpa_cover:this.cpaCover});
	}
	changeOwnerdrivr(v): void{
		this.cpaCover =v;
	}

}
