import { Component, OnInit, EventEmitter, Output, AfterViewInit, ChangeDetectorRef, ViewChild, ViewChildren, OnDestroy, Inject, ElementRef, PLATFORM_ID } from '@angular/core';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { MatSelectSearchVersion } from 'ngx-mat-select-search';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { MatSelect } from '@angular/material';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

// import carjson from './fourwheeler.json';
import rtojson from './rto_master.json';

import { take, takeUntil } from 'rxjs/operators';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReplaySubject, Subject } from 'rxjs';
import { invalid } from '@angular/compiler/src/render3/view/util';
import { nextTick } from 'q';
import { NgSelectComponent } from '@ng-select/ng-select';
import { NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { AppDateAdapter, APP_DATE_FORMATS } from '../../share/date.adapter';
import { AppService } from '../../service/app.service';
import { DeviceDetectorService } from 'ngx-device-detector';

import { HttpClient } from "@angular/common/http";
import { DOCUMENT } from '@angular/common';

import { isPlatformBrowser } from '@angular/common';
import { animate, query, state, style, transition, trigger } from '@angular/animations';
declare const dht: any;
interface Rto {
	id: string;
	name: string;
}
interface Brand {
	id: string;
	name: string;
	brand_name: string;
	brand_code: string;
}
interface Model {
	id: string;
	name: string;
	model_name: string;
	model_code: string;
}
interface Variant {
	id: string;
	name: string;
	variant_name: string;
}
@Component({
	selector: 'app-quote',
	templateUrl: './quote.component.html',
	styleUrls: ['./quote.component.scss', '../../../assets/quote/css/style.css'],
	providers: [
		{
			provide: DateAdapter, useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
		}
	],
	animations: [
		trigger('content', [
			state('true', style({
				transform: "scale(1)",
				zIndex: "1",
				opacity: '1',

				top: "0",
				right: "0",
				bottom: "0",
				left: "0",
				// background: '#0000006e',
			})),
			state('false', style({
				transform: "scale(0.2)",
				background: 'unset',
				overflowY: "hidden",
				zIndex: "0",
				opacity: '0',

				top: "150px",
				bottom: "-150px",
				right: "600px",
				left: "-600px",
			})),
			transition('false => true', [
				animate(600, style({
					transform: "scale(1)",
					top: "0",
					bottom: "0",
					right: "0",
					left: "0",

					zIndex: "1",
					opacity: '1',
				}))
			]),
			transition('true => false', [
				animate(600, style({
					transform: "scale(0.2)",
					top: "150px",
					bottom: "-150px",

					right: "600px",
					left: "-600px",
				}))
			]),
		]),

		trigger('modalButton', [
			state('false', style({
				transform: "scale(1)",
				zIndex: "1",
				opacity: '1',
			})),
			state('true', style({
				transform: "scale(0)",
				zIndex: "0",
				opacity: '0',
			})),
			transition('true => false', [
				animate(600, style({
					transform: "scale(1)",

					zIndex: "1",
					opacity: '1',
				}))
			]),
			transition('false => true', [
				animate(600, style({
					transform: "scale(0)",
				}))
			]),
		])
	]

})
export class QuoteComponent implements OnInit, AfterViewInit, OnDestroy {
	isRollType8: boolean = false;
	POSP_URL:string = "";
	POSP_name: string="";POSPshortname: string="";
	isReady: boolean = true;

	localWindow: any;
	chatItem: any = {};
	startDate = new Date();
	isBrandFill = false;
	quoteForm = this._formBuilder.group({
		isRenewal: ['1', [Validators.required]],
		userCode: ['0'],
		car_fullname: [''],
		registration_date: [''],
		registration_date_text: [''],
		manufacture_date: [''],
		brand_name: [''],
		brand_code: [''],
		model_name: [''],
		fuel_name: [''],
		fuel_type_text: [''],
		variant_name: [''],
		car_id: [''],
		car_cc: [''],
		rto_id: [''],
		rtoText: [''],
		rto_details: [''],
		prev_ncb: [0],
		new_ncb: [0],
		idv: [0],
		zero_dep: [0],
		pa_owner: [0],
		vol_discount: [0],
		brandFormGroup: this._formBuilder.group({
			brandCtrl: ['', [Validators.required]]
		}),
		modelFormGroup: this._formBuilder.group({
			modelCtrl: [null, [Validators.required]]
		}),
		fuelFormGroup: this._formBuilder.group({
			fuelCtrl: [null, [Validators.required]]
		}),
		variantFormGroup: this._formBuilder.group({
			variantCtrl: [null, [Validators.required]]
		}),
		regisFormGroup: this._formBuilder.group({
			regisCtrl: [null, [Validators.required]],
			regisYrCtrl: ['', [Validators.required]]
		}),
		contactFormGroup: this._formBuilder.group({
			mobileNoCtrl: ['', [Validators.required, Validators.pattern(/^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/)]],
			emailCtrl: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
			expiryDate: ['', [Validators.required]],
			lastClaim: ['0', [Validators.required]]
		}),
		options: this._formBuilder.group({
			floatLabel: ['1', [Validators.required]],
		})
	});
	options: FormGroup;
	isEditable = true;
	makeActive = true;
	modelActive = false;
	fuelActive = false;
	variantActive = false;
	prospectConfirmError = false;
	registrationActive = false;
	contactActive = false;
	panelOpenState = false;
	showQuoteForm = false;
	showlogo = false;
	dont_have_prev_policy = false;
	topBrandList: any;
	refferJson: any;
	twJson: any;
	rtoJson: any;
	matSelectSearchVersion = MatSelectSearchVersion;
	totalBrandList: any;
	totalModelList: any;
	topModelList: any;
	totalFuelList: any;
	totalVariantList: any;
	totalRtoList: any;
	topVariantList: any;
	regYearDropdown: any[] = [];
	quoteJson: any;

	otp_msg: string = '';
	brandName: string = 'Brand';
	modelName: string = 'Model';
	fuelName: string = 'Fuel';
	variantName: string = 'Variant';
	registrationName: string = 'Registration';
	source_user: string = "100173";
	role_type: string = "";
	user_token: string = "";
	selectedStepperIndex: any;
	contactSubmitLoader = false;

	form_brand: string = "0";
	form_model: string = "0";
	form_fuel: string = "0";
	form_variant: string = "0";
	form_rto_id: string = "0";
	form_rto_code: string = "0";
	form_reg_year: string = "2019";
	form_car: string = "0";
	affiliate_customer_request_id = "";
	USERURL = "";
	form_premium_type = 1;
	brandText: any;
	modelText: any;
	fuelText: any;
	variantText: any;
	rtoDetail: any;
	isEdit: boolean = false;
	carText: any;
	carrierType: any;
	IS_LIVE: any;
	filter_tw_list: any;
	white_label = 1;
	user_code = '0';
	isLoggedIn: boolean = false;
	regMinDate: any;
	regMaxDate: any;
	APIURL: string = "";
	expireMinDate: any;
	expireMaxDate: any;
	uniqueID: any;
	loginData: any;
	prospectForm = this._formBuilder.group({
		prospectName: ['', [Validators.required]],
		prospectPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
		prospectEmail: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
		prospectPassword: ['', [Validators.required]],
		prospectConfPassword: ['', [Validators.required]],
	});
	prospectSubmitted: any;
	successProspect: boolean = false;
	BASEURL: any;


	protected rtos: Rto[];
	protected brands: any[];
	protected models: Model[];
	protected variants: Variant[];
	/** control for the MatSelect filter keyword */
	public filteredRtos: ReplaySubject<Rto[]> = new ReplaySubject<Rto[]>(1);
	public filteredModels: ReplaySubject<Model[]> = new ReplaySubject<Model[]>(1);
	public filteredVariants: ReplaySubject<Variant[]> = new ReplaySubject<Variant[]>(1);
	protected _onDestroy = new Subject<void>();
	@ViewChild('rtoSelect', { static: false }) rtoSelect: NgSelectComponent;
	@ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
	@ViewChild('modelSelect', { static: false }) modelSelect: NgSelectComponent;
	@ViewChild('variantSelect', { static: false }) variantSelect: NgSelectComponent;
	@ViewChild('rtoYrSelect', { static: false }) rtoYrSelect: any;
	@ViewChild('stepper', { static: false }) stepper: MatStepper;
	@ViewChild('custMobileNo', { static: true }) custMobileNo: ElementRef;
	@ViewChild('navBar', { static: true }) private navBar: ElementRef;

	isLinear = true;
	deviceInfo = null;
	device_info: any;

	// CHANGE DONE BY ARIT
	jsonLoader: boolean = true;
	autoOpenRegYrDD: boolean = true;
	CNG_LPG_Kit_type: boolean = false;
	lpg_cngkit: any = 0;

	affiliateParam: string = '';
	isShow: boolean = false;
	autoOfferContentImgOrText: boolean = true;
	modalClass: String = "small";
	isShowOffer: boolean = false;
	registrationDate: any = null;
	uiStyle:any;
	isSponsored:boolean=false;
	logo:string='assets/quote/img/logo.png';
	isRenewal:boolean = true;
	@Output() toggleSidenav = new EventEmitter<any>();
	isPospImg: boolean;
	POSP_img: any;
	domain_url="";
	carInsurUrl:any;
	bikeInsurUrl:any;
	cvInsurUrl:any;
	healthInsurUrl:any;
	travelInsurUrl:any;
	termInsurUrl:any;
	constructor(private cdRef: ChangeDetectorRef, private deviceService: DeviceDetectorService, private apiService: AppService, private router: Router, private _formBuilder: FormBuilder, private route: ActivatedRoute, public dialog: MatDialog, private localStorage: LocalStorage, private _snackBar: MatSnackBar, private httpClient: HttpClient, @Inject(DOCUMENT) public document: Document, @Inject(DOCUMENT) public htmlDocument: HTMLDocument, @Inject(PLATFORM_ID) private platformId: Object) {
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
	offerModalOpen() {
		// console.log("%cModal Open -=|=-", "color: aqua; font-size: x-large");

		this.isShow = true;
		this.modalClass = "big";
		this.autoOfferContentImgOrText = true;
	}

	offerModalClose() {
		// console.log("%cModal Close -=|=-", "color: crimson; font-size: x-large");

		this.isShow = false;
		this.modalClass = "small";
	}

	bannerClick() {
		this.localStorage.getItem('userJson').subscribe((userJson: any) => {
			if (userJson != null) {
				let date = new Date();
				let ses = "" + date.getDay() + date.getMonth() + date.getFullYear() + date.getSeconds() + date.getMinutes() + date.getHours();
				let payload = { "user_code": userJson.user_code, "click_id": 1, "page_name": "CAR", "sess_id": ses };
				this.apiService.bannerClick(payload).subscribe((response) => { });
			}
		});
	}

	showImgOrTestData(showText) {
		this.autoOfferContentImgOrText = showText;
		this.bannerClick();
	}
	redirctCampaignPage() {
		this.localStorage.getItem('userJson').subscribe((userJson: any) => {
			if (userJson != null) {
				let date = new Date();
				let ses = "" + date.getDay() + date.getMonth() + date.getFullYear() + date.getSeconds() + date.getMinutes() + date.getHours();
				let payload = { "user_code": userJson.user_code, "click_id": 2, "page_name": "CAR", "sess_id": ses };
				this.apiService.bannerClick(payload).subscribe((response) => {
					let showModel = { 'isShow': false };
					this.localStorage.setItem('showModel', showModel).subscribe(() => { });
					// let return_url= 'http://192.168.7.29:4200/';
					let return_url = userJson.campaign_url;
					window.location.href = return_url;
				});
			}
		});
	}

	epicFunction() {
		this.deviceInfo = this.deviceService.getDeviceInfo();
		const isMobile = this.deviceService.isMobile();
		const isTablet = this.deviceService.isTablet();
		const isDesktopDevice = this.deviceService.isDesktop();
		let source_device = '';
		if (isMobile) {
			source_device = 'MOBILE'
		}
		else if (isTablet) {
			source_device = 'TABLET'
		}
		else if (isDesktopDevice) {
			source_device = 'DESKTOP'
		}
		this.device_info = {
			visitor_source: "GIBL.IN",
			visitor_device: source_device,
			visitor_browser: this.deviceInfo.browser.toUpperCase(),
			visitor_agent: this.deviceInfo.userAgent
		}
	}

	openDialogLongin() {
		const dialogRef = this.dialog.open(DialogContentExampleDialog,
			{
				//width: '550px'
				data: { name: 'otpverify' }
			});

		dialogRef.afterClosed().subscribe(result => {
			this.localStorage.getItem('userJson').subscribe((data: any) => {
				if (data != null) {
					let userCode = data.user_code;
					this.quoteForm.get('userCode').setValue(userCode);
					if (data.white_label == '1') {

						this.white_label = 1;
					}
					this.isLoggedIn = true;
				}
			});
		});
	}
	navigateURL(router_link) {
		this.route.queryParams.subscribe(params => {
			if (params.utm_source != null && params.utm_source == 'dailyhunt') {
				this.affiliateParam = "dailyhunt";
			}
			if (this.affiliateParam != '') {
				this.router.navigate(['/' + router_link], { queryParams: { utm_source: this.affiliateParam } });

			}
			else {
				this.router.navigate(['/' + router_link]);
			}

		});
		//this.router.navigate(['/'+router_link]);
	}
	logout() {
		this.localStorage.removeItem('userJson').subscribe(() => {
			this.quoteForm.get('userCode').setValue(0);
			this.source_user = "100173";
			this.isLoggedIn = false;
			this.white_label = 0;
		});
	}
	openDialog() {
		const dialogRef = this.dialog.open(DialogContentExampleDialog,
			{
				//width: '550px'
				data: { name: 'openDialog' }
			});

		dialogRef.afterClosed().subscribe(result => {
			console.log(`Dialog result: ${result}`);
		});
	}
	focusModle() {
		this.modelSelect.open();
	}
	focusVariant() {
		this.variantSelect.open();
	}
	focusYrRto() {
		this.rtoYrSelect.open();
	}
	focusRto(id) {
		//this.select.focusSearchInput();
		if (id == '')
			this.get_rto_list();
		else
			this.filterRTO(id);

		this.rtoSelect.open();
	}
	doSomething(car_id) {
		this.twJson.forEach(el => {
			if (el.id == car_id) {
				this.filter_tw_list = el;
			}
		});
	}

	openSnackBar(message: string, action: string) {
		this._snackBar.open(message, action, {
			duration: 10000,
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
		this.setPospURL();
		this.domain_url = this.apiService.getDomainURL();
		this.carInsurUrl = `${this.domain_url}car-insurance/`;
		this.bikeInsurUrl = `${this.domain_url}two-wheeler-insurance/`;
		this.cvInsurUrl = `${this.domain_url}commercial-vehicle-insurance/`;
		this.healthInsurUrl = `${this.domain_url}health-insurance/`;
		this.travelInsurUrl = `${this.domain_url}travel-insurance/`;
		this.termInsurUrl = `${this.domain_url}term-insurance/`;
		var d = new Date();
		this.uniqueID = d.getTime();
		this.localWindow = this.document.defaultView;
		this.APIURL = this.apiService.getUserServiceURL();
		this.USERURL = this.apiService.getUserServiceURL();
		this.epicFunction();
		this.IS_LIVE = this.apiService.getIsLIVE();
		this.BASEURL = this.apiService.getBaseURL();

		this.carrierType = "public";
		this.generateProspectForm();
		this.prospectSubmitted = false;


		var curr_year = new Date().getFullYear();
		var last_year = new Date().getFullYear() - 20;
		this.regMinDate = last_year;
		this.regMaxDate = curr_year - 1;
		for (let i = curr_year; i >= last_year; i--) {
			this.regYearDropdown.push(i);
		}

		this.route.queryParams.subscribe(params => {
			if (params.TYPE == "R") {
				this.form_premium_type = 1;
			}
			if (params.TYPE == "N") {
				this.form_premium_type = 0;
				this.isRenewal = false;
				let now = new Date();
				this.quoteForm.get('isRenewal').setValue("0");
				this.quoteForm.get('regisFormGroup').get("regisYrCtrl").setValue(now.getFullYear());
			}
		});

		// DONE BY ARIT LOAD JSON RUN TIME
		// this.twJson = carjson;
		this.apiService.getcarJson().subscribe((carjsonn: any) => {
			if (carjsonn) {
				this.twJson = (typeof carjsonn == 'string' ? JSON.parse(carjsonn) : carjsonn);
				this.get_brand();
				this.get_top_brand();

				this.localStorage.getItem('quote_form_data').subscribe((data: any) => {
					if (data && !data.page_status.quote) {
						this.isReady = false;
						let car = this.twJson.find(item => item.id == data.vehicle_id);
						this.filter_tw_list = car;
						setTimeout(() => {
							this.brandChanged(data.vehicle_id);
							this.variantTapped(car.id, car.variant_name, car.variant_code, car.cubic_capacity);
							setTimeout(() => {
								this.registrationTapped(data.rto);
								this.contactTapped(parseInt(data.registration_year));
								this.contactFormGroup.get('mobileNoCtrl').setValue(data.mobile_no);
								this.contactFormGroup.get('emailCtrl').setValue(data.email_id);
								this.contactFormGroup.get('expiryDate').setValue(data.expiry_date);
								this.contactFormGroup.get('lastClaim').setValue(data.lastClaimedYear);
								this.dont_have_prev_policy = data.dontHavePreviousYearPolicy;
								data.page_status = {
									quote: true,
									listing: false,
									proposal: false,
								}
								this.registrationDate = data.registration_date;
								this.localStorage.setItem('quote_form_data', data).subscribe(data => {
									this.contactFormSubmit();
									setTimeout(() => { this.isReady = true; }, 500);
								});
							}, 1000);
						}, 1000);
					} else if (data && data.page_status.quote) {
						this.localStorage.removeItem('quote_form_data').subscribe(data => { });
					}
				});
			}
		});

		this.rtoJson = rtojson;
		this.jsonLoader = !this.jsonLoader;


		this.localStorage.getItem('refferJson').subscribe((data: any) => {
			if (data && data != '') {
				this.refferJson = data;
			}
			else {
				this.refferJson = "";
			}
		});
		// DONE BY ARIT FOR LIVE CHAT
		// this.apiService.openMotorChatbot();
	}

	generateProspectForm() {

	}
	prevPolicyCheck(event) {
		if (event.checked) {
			this.dont_have_prev_policy = true;
			this.contactFormGroup.get('expiryDate').setValidators([]);
			this.contactFormGroup.get('expiryDate').updateValueAndValidity();
		}
		else {
			this.dont_have_prev_policy = false;
			this.contactFormGroup.get('expiryDate').setValidators([]);
			this.contactFormGroup.get('expiryDate').updateValueAndValidity();
		}
	}
	prospectSubmit() {
		this.prospectSubmitted = true;
		this.prospectConfirmError = false;
		if (this.prospectForm.invalid == true) {
			return;
		}
		else {
			if (this.prospectForm.value.prospectPassword != this.prospectForm.value.prospectConfPassword) {
				this.prospectConfirmError = true;
				return;
			}
			else {
				let prospectJson = {
					"prospect_name": this.prospectForm.value.prospectName,
					"prospect_phone": this.prospectForm.value.prospectPhone,
					"prospect_email": this.prospectForm.value.prospectEmail,
					"prospect_password": this.prospectForm.value.prospectPassword,
					"prospect_conf_password": this.prospectForm.value.prospectConfPassword,
					"source_value": "FWLANDING",
					"serviceUrl": ""
				};
				prospectJson.serviceUrl = this.USERURL + "pos-registration.php";
				this.apiService.registration(prospectJson).subscribe((data: any) => {
					let submit_res = (data);

					if (submit_res.flag_proceed == true) {
						this.openSnackBar('Thank you for your interest, we will get back to you soon.', '');
						this.prospectSubmitted = false;
						this.prospectForm.reset();
						this.successProspect = true;
					} else {
						this.openSnackBar(submit_res.errMsgs, '');
						this.prospectSubmitted = false;
						//this.prospectForm.reset();
						this.successProspect = true;
					}
				});
			}
		}
	}

	editDetail() {

		this.localStorage.getItem('backToQuote').subscribe((data1: any) => {
			//let backQuote = data1.back;
			if (data1 != null && data1.back) {
				this.localStorage.getItem('quoteJson').subscribe((data) => {
					this.quoteJson = data;
					if (this.quoteJson != null) {
						this.isEdit = true;
						this.quoteForm.get('isRenewal').setValue(this.quoteJson.is_renewal);
						if (this.IS_LIVE == 2) {
							this.isNewCar(1);
							this.quoteJson.form_premium_type = 1;
							this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
						}
						else {
							this.isNewCar(this.quoteJson.is_renewal);
						}
						this.brandChanged(this.quoteJson.car_id);
					}
				});
				let backToQuote = {
					back: false
				}
				this.localStorage.setItem('backToQuote', backToQuote).subscribe(() => { });
			}
			else {
				//this.form_premium_type = 1;
				this.localStorage.removeItem('quoteJson').subscribe(() => { });
				let backToQuote = {
					back: false
				}
				this.localStorage.setItem('backToQuote', backToQuote).subscribe(() => { });
			}
		});
	}

	brandChanged1(id) {
		this.twJson.forEach(el => {
			if (el.id == id) {
				this.filter_tw_list = el;
			}
		});
		this.brandChanged(id);
	}
	get brandFormGroup() {
		return this.quoteForm.get('brandFormGroup');
	}
	get modelFormGroup() {
		return this.quoteForm.get('modelFormGroup');
	}
	get fuelFormGroup() {
		return this.quoteForm.get('fuelFormGroup');
	}
	get variantFormGroup() {
		return this.quoteForm.get('variantFormGroup');
	}
	get regisFormGroup() {
		return this.quoteForm.get('regisFormGroup');
	}
	get contactFormGroup() {
		return this.quoteForm.get('contactFormGroup');
	}
	public trackByFn(index: any, item: any) {
		return index;
	}

	ngAfterViewInit() {
		// this.setPospURL();
		this.editDetail();
		if (isPlatformBrowser(this.platformId)) {
			let referrerLink = '';

			this.localStorage.getItem('refferJson').subscribe((data: any) => {
				if (data && data != '') {
					this.affiliate_customer_request_id = data.request_id;
				}
			});
			this.localStorage.getItem('referrerLink').subscribe((data: any) => {
				if (data && data != '') {
					referrerLink = data;
					let userTrackData = {
						"unique_id": this.uniqueID,
						"quote_id": "0",
						"page_id": "2",
						"btn_id": "BASE",
						"param_str": this.router.url,
						"serviceUrl": "",
						"referrerLink": referrerLink
					};
					this.apiService.track_button(userTrackData).subscribe(data => { });
				}
				else {
					let userTrackData = {
						"unique_id": this.uniqueID,
						"quote_id": "0",
						"page_id": "2",
						"btn_id": "BASE",
						"param_str": this.router.url,
						"serviceUrl": "",
						"referrerLink": ""
					};
					this.apiService.track_button(userTrackData).subscribe(data => { });
				}
			});

			this.route.queryParams.subscribe(params => {
				console.log('queryParams',params)
				if (params.TYPE == "R") {
					this.form_premium_type = 1;
				}
				if (params.TYPE == "N") {
					this.form_premium_type = 0;
				}
				/*************************************Auto Login********************************/
				let loginJson;
				if (params.ref != null) {
					if (params.ref == "GIBLDNCD") {
						loginJson = {
							"uname": params.uname,
							"source": params.source,
							"acode": params.acode,
							"token": params.akey,
							"serviceUrl": ""
						};
						loginJson.serviceUrl = this.APIURL + "login.php?TYPE=2";
					}
					if (params.ref == "GIBLDNPOS") {
						loginJson = {
							"uname": params.uname,
							"acode": params.acode,
							"token": params.akey,
							"serviceUrl": ""
						};
						loginJson.serviceUrl = this.APIURL + "login.php?TYPE=3";
					}
					if (params.ref == "GIBLDNQRCODE") {
						loginJson = {
							"qrcode": params.qrcode,
							"serviceUrl": ""
						};
						loginJson.serviceUrl = this.APIURL + "login.php?TYPE=5";
					}
					if (params.ref == "GIBLDNTIEUP") {
						loginJson = {
							"tcode": params.tcode,
							"serviceUrl": ""
						};
						loginJson.serviceUrl = this.APIURL + "login.php?TYPE=6";
					}
					if (params.ref == "GIBLDNVISIT") {
						this.showlogo = true;
						this.white_label = 0;
						this.user_code = '100173';
					}
					if (loginJson) {
						this.apiService.signIn(loginJson).subscribe(data => {
							let res: any = data;
							this.showlogo = true;
							let rd = (res);
							if (rd && rd.token) {
								if (rd.status == '1') {
									this.isLoggedIn = true;
									if (rd.white_label == '1') {
										this.white_label = 1;
									}
									else {
										this.white_label = 0;
									}
								}
								else {
									this.isLoggedIn = false;
									if (rd.white_label == '1') {
										this.white_label = 1;
									}
									else {
										this.white_label = 0;
									}
								}
								let userCode = rd.user_code;
								this.user_code = userCode;
								this.quoteForm.get('userCode').setValue(userCode);

								this.localStorage.setItem('userJson', rd).subscribe(() => {
									this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
								});
							} else {
								this.white_label = 0;
								this.user_code = '100173';
								this.localStorage.setItem('userJson', "").subscribe(() => {
									this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
								});
							}
						});
					}
				} else {
					this.showlogo = true;
					if (params.source != null) {
						loginJson = {
							"source": params.source,
							"serviceUrl": ""
						};
						loginJson.serviceUrl = this.APIURL + "login.php?TYPE=7";
						this.apiService.signIn(loginJson).subscribe(data => {
							let res: any = data;
							let rd = (res);
							if (rd.token) {
								if (rd.status == '1') {
									this.isLoggedIn = true;
									if (rd.white_label == '1') {
										// this.whileLabeled=true;
										this.white_label = 1;
									}
								}
								else {
									this.isLoggedIn = false;
								}

								let userCode = rd.user_code;
								this.user_code = userCode;
								this.localStorage.setItem('userJson', rd).subscribe(() => {
									this.quoteForm.get('userCode').setValue(userCode);
									this.generateUi();
									this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
								});
							}
							else {
								this.isLoggedIn = false;
								this.user_code = '100173';
								this.localStorage.setItem('userJson', null).subscribe(() => {
									this.router.navigate(['/'], { queryParams: { TYPE: params.TYPE } });
								});
							}
						});
					}
					else {
						this.localStorage.getItem('userJson').subscribe((data: any) => {
							if (data != null) {
								this.source_user = data.source_user;
								this.role_type = data.role_type;
                				this.user_token = data.token;
								this.isLoggedIn = true;
								if (data.white_label == '1') {
									this.white_label = 1;
								}
								else {
									this.white_label = 0;
								}
								let userCode = data.user_code;
								this.user_code = userCode;
								this.quoteForm.get('userCode').setValue(userCode);
							}
							else {
								this.white_label = 0;
								this.user_code = '100173';
								this.quoteForm.get('userCode').setValue(0);
							}
						});
					}
				}

				/********Offer Model Auto Premier*******/
				this.localStorage.getItem('userJson').subscribe((userJson: any) => {
					if (userJson != null && userJson.show_offer == '1') {
						this.isShowOffer = true;
					}
				});
				this.localStorage.getItem('showModel').subscribe((showModel: any) => {
					if (showModel == null && this.isShowOffer == true) {

						setTimeout(() => {
							this.offerModalOpen();
						}, 800);
					}
				});


				setTimeout(() => {
					if (this.autoOfferContentImgOrText && this.isShowOffer == true)
						this.offerModalClose();
				}, 15000);
				/********Offer Model Auto Premier*******/
			});
		}

		this.cdRef.detectChanges();
	}

	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}

	isNewCar(val) {
		if (val == 0) {
			this.quoteForm.get('isRenewal').setValidators([]);
			this.quoteForm.get('isRenewal').updateValueAndValidity();
			this.regisFormGroup.get('regisYrCtrl').setValidators([]);
			this.regisFormGroup.get('regisYrCtrl').updateValueAndValidity();
			this.contactFormGroup.get('lastClaim').setValidators([]);
			this.contactFormGroup.get('lastClaim').updateValueAndValidity();
			//this.contactFormGroup.get('lastClaim').setValue('0');
			this.contactFormGroup.get('expiryDate').setValidators([]);
			this.contactFormGroup.get('expiryDate').updateValueAndValidity();
		}
		else if (val == 1) {
			this.quoteForm.get('isRenewal').setValidators([Validators.required]);
			this.quoteForm.get('isRenewal').updateValueAndValidity();
			this.regisFormGroup.get('regisYrCtrl').setValidators([Validators.required]);
			this.regisFormGroup.get('regisYrCtrl').updateValueAndValidity();
			this.contactFormGroup.get('lastClaim').setValidators([Validators.required]);
			this.contactFormGroup.get('lastClaim').updateValueAndValidity();
			//this.contactFormGroup.get('lastClaim').setValue('0');
			this.contactFormGroup.get('expiryDate').setValidators([Validators.required]);
			this.contactFormGroup.get('expiryDate').updateValueAndValidity();
		}
		this.form_premium_type = val;
	}

	/*****************************************************/
	//Get Brand List
	/*****************************************************/
	get_brand() {
		var totalBrandListFilter = [];
		var output: any;
		//output = { id: "0", name: "Not in the list? Find your car's brand here", brand_name: "", brand_code: "" };
		//totalBrandListFilter.push(output);
		this.twJson.forEach(el => {
			output = { id: el.id, name: el.full_name, brand_name: el.brand_name, brand_code: el.brand_code };
			totalBrandListFilter.push(output);
		});
		this.totalBrandList = totalBrandListFilter;

		this.route.queryParams.subscribe(params => {
			if (params.edit == "Y") {
				//this.editDetail();
			}
		});
	}
	/*****************************************************/
	//Get 12 top brand or manufacturer
	/*****************************************************/
	get_top_brand() {
		var filter_brand = [];
		this.twJson.forEach(el => {
			if (el.popular_brand == '1') {
				filter_brand.push(el);
			}
		});
		this.topBrandList = filter_brand;
	}
	get_model(brand_val) {
		var filter_model = [];
		this.twJson.forEach(el => {
			if (el.brand_code == brand_val) {
				filter_model[el.model_code] = el;
			}
		});
		var finalModelList = [];
		var output: any;
		//output = { id: "0", name: "Not in the list? Find your car's model here", model_name: "", model_code: "" };
		//finalModelList.push(output);
		Object.keys(filter_model).forEach(function (key) {
			var el = filter_model[key];
			output = { id: el.model_code, name: el.model_name, model_name: el.model_name, model_code: el.model_code };
			finalModelList.push(output);
		});
		this.totalModelList = finalModelList;
	}
	supportLink() {
		window.location.href = this.apiService.getDomainURL()+"contact-us/";
	}
	registrationPage() {
		window.location.href = this.apiService.getDomainURL()+"pos/";
	}
	homepage() {
		this.router.navigate(['/']);
		// this.localStorage.getItem('userJson').subscribe((data: any) => {
		// 	if (data != null) {
		// 		if (data.role_type.toString() == "16" || data.role_type.toString() == "8" || data.role_type.toString() == "20") {
		// 			// window.location.href = this.apiService.getDomainURL();
		// 			window.location.href = this.BASEURL;
		// 		}
		// 		else {
		// 			window.location.href = this.BASEURL;
		// 		}
		// 	}
		// 	else {
		// 		window.location.href = this.BASEURL;
		// 	}
		// });
	}
	/*****************************************************/
	//Get variant List
	/*****************************************************/

	get_variant(model_code, fuel_type_text) {
		var finalVariantList = [];
		var output: any;
		//output = { id: "0", name: "Not in the list? Find your car's variant here", variant_name: "" };
		//finalVariantList.push(output);

		this.twJson.forEach(el => {
			if (el.model_code == model_code && el.fuel_type_text == fuel_type_text) {
				output = { id: el.id, name: el.variant_name + ' (' + el.cubic_capacity + ')', variant_name: el.variant_name };
				finalVariantList.push(output);
			}
		});
		this.totalVariantList = finalVariantList;
	}
	/*****************************************************/
	//Get top 12 model list
	/*****************************************************/
	get_top_model(brand_code) {
		var filter_model = [];
		var finaltopModelList = [];

		var output = [];
		this.twJson.forEach(el => {
			if (el.brand_code == brand_code) {
				filter_model[el.model_code] = el;
			}
		});

		this.twJson.forEach(el => {
			if (el.brand_code == brand_code) {
				filter_model[el.model_code] = el;
				if (el.popular_model == '1') {
					finaltopModelList.push(el);
				}
			}
		});
		this.twJson.forEach(el => {
			if (el.brand_code == brand_code) {
				filter_model[el.model_code] = el;
				if (finaltopModelList.length < 16) {
					finaltopModelList.push(el);
				}
			}
		});
		var flags = [], output = [], l = finaltopModelList.length, i;
		for (i = 0; i < l; i++) {
			if (flags[finaltopModelList[i].model_code]) continue;
			flags[finaltopModelList[i].model_code] = true;
			if (output.length < 16)
				output.push(finaltopModelList[i]);
		}
		this.topModelList = output;
	}
	/*****************************************************/
	//Get Fuel List
	/*****************************************************/
	get_fuel(model_code) {
		var filter_fuel = [];

		this.twJson.forEach(el => {
			if (el.model_code == model_code) {
				filter_fuel[el.fuel_type_text] = el;
			}
		});

		var finalFilterFuel = [];
		Object.keys(filter_fuel).forEach(function (key) {
			var el = filter_fuel[key];
			if (key == "Petrol" || key == "PETROL") {
				el.fuel_logo = "gasoline.png";
			}
			if (key == "Diesel" || key == "DIESEL" || key == "Disel" || key == "Bifuel") {
				el.fuel_logo = "gas-station.png";
			}
			if (key == "CNG" || key == "cng" || key == "Cng" || key == "Electric") {
				el.fuel_logo = "electric-station.png";
			}
			if (key == "LPG" || key == "lpg" || key == "Lpg") {
				el.fuel_logo = "gas.png";
			}

			finalFilterFuel.push(el);
		});


		// DONE BY ARIT
		let ext_json = JSON.parse(JSON.stringify(this.twJson));
		var filter_fuel_ext = [];
		ext_json.forEach(elm => {
			if (elm.model_code == model_code) {
				filter_fuel_ext[elm.fuel_type_text] = elm;
			}
		});
		Object.keys(filter_fuel_ext).forEach(function (key) {
			var ext_el = filter_fuel_ext[key];
			if (key == "Petrol" || key == "PETROL") {
				ext_el.fuel_logo = "gasoline.png";
				ext_el.fuel_type_text = "Ext Cng";
				finalFilterFuel.push(ext_el);
			}
		});

		this.totalFuelList = finalFilterFuel;

		/* if (this.totalFuelList.length == 1 && this.form_car == "0") {
		  this.fuelTapped(this.totalFuelList[0].fuel_type_text, this.totalFuelList[0].fuel_type, this.totalFuelList[0].model_code);
		} */
		// DONE BY ARIT ENDS HERE
	}

	get_top_variant(model_code, fuel_type_text) {
		var filter_variant = [];
		this.twJson.forEach(el => {
			if (el.model_code == model_code && el.fuel_type_text == fuel_type_text && filter_variant.length < 16) {
				filter_variant.push(el);
			}
		});
		var final_filter_variant = [];
		var i = 1;
		filter_variant.forEach(el => {
			if (i <= 16) {
				final_filter_variant.push(el);
				i++;
			}
		});
		this.topVariantList = final_filter_variant;
	}
	// mainPage(){
	//   window.location.href="https://www.gibl.in/";
	// }
	move(index: number) {

		if (index == 1) {
			this.modelActive = false;
			this.makeActive = true;
			this.registrationActive = false;
			this.variantActive = false;
			this.fuelActive = false;
			this.contactActive = false;
		}
		else if (index == 2) {
			this.modelActive = true;
			this.makeActive = false;
			this.registrationActive = false;
			this.variantActive = false;
			this.fuelActive = false;
			this.contactActive = false;
		}
		else if (index == 3) {
			this.modelActive = false;
			this.makeActive = false;
			this.registrationActive = false;
			this.variantActive = false;
			this.fuelActive = true;
			this.contactActive = false;
		}
		else if (index == 4) {
			this.modelActive = false;
			this.makeActive = false;
			this.registrationActive = false;
			this.variantActive = true;
			this.fuelActive = false;
			this.contactActive = false;
		}
		else if (index == 5) {
			this.modelActive = false;
			this.makeActive = false;
			this.registrationActive = true;
			this.variantActive = false;
			this.fuelActive = false;
			this.contactActive = false;
		}
		else if (index == 6) {
			this.modelActive = false;
			this.makeActive = false;
			this.registrationActive = false;
			this.variantActive = false;
			this.fuelActive = false;
			this.contactActive = true;
		}
	}
	goForward() {
		this.stepper.next();
		let curObj = this;
		setTimeout(function waitTargetElem() {
			if (this.document.body.contains(curObj.custMobileNo.nativeElement)) {
				curObj.custMobileNo.nativeElement.focus();
			} else {
				setTimeout(waitTargetElem, 100);
			}
		}, 100);
	}
	goBackward() {
		this.stepper.previous();
	}
	/*****************************************************/
	//Change Brand List
	/*****************************************************/
	async brandChanged(car_id) {
		await this.doSomething(car_id);
		this.quoteForm.get('car_id').patchValue(car_id);
		this.form_brand = this.filter_tw_list.brand_code;
		this.form_model = this.filter_tw_list.model_code;
		this.form_fuel = this.filter_tw_list.fuel_type;
		this.form_variant = this.filter_tw_list.variant_code;
		this.form_car = this.filter_tw_list.id;
		let full_name = this.filter_tw_list.brand_name + ' ' + this.filter_tw_list.model_name + ' ' + this.filter_tw_list.variant_name + ' CC ' + this.filter_tw_list.cubic_capacity + ' ' + this.filter_tw_list.fuel_type;
		this.carText = full_name;
		this.quoteForm.get('car_fullname').setValue(this.filter_tw_list.full_name);
		this.makeTapped(this.filter_tw_list.brand_name, this.filter_tw_list.brand_code, this.filter_tw_list.full_name, this.form_car)
		this.modelFormGroup.get('modelCtrl').setValue(this.filter_tw_list.model_code);
		this.modelTapped(this.filter_tw_list.model_name, this.filter_tw_list.model_code);
		this.fuelTapped(this.filter_tw_list.fuel_type_text, this.filter_tw_list.fuel_type, this.filter_tw_list.model_code);
		this.variantTapped(this.filter_tw_list.id, this.filter_tw_list.variant_name, this.filter_tw_list.variant_code, this.filter_tw_list.cubic_capacity);
		if (this.isEdit) {
			this.registrationTapped(this.quoteJson.rto_id);
			setTimeout(() => {
				this.stepper.selectedIndex = 0;
				this.isEdit = false;
			}, 250);
		}
	}
	brandValidation() {
		this.modelFormGroup.get('modelCtrl').setValidators([Validators.required]);
		this.modelFormGroup.get('modelCtrl').updateValueAndValidity();
		this.fuelFormGroup.get('fuelCtrl').setValidators([Validators.required]);
		this.fuelFormGroup.get('fuelCtrl').updateValueAndValidity();
		this.variantFormGroup.get('variantCtrl').setValidators([Validators.required]);
		this.variantFormGroup.get('variantCtrl').updateValueAndValidity();
	}
	makeTapped(name, code, full_name = '', car_id = '') {
		this.stepper.reset();
		this.brandValidation();
		//this.quoteForm.get('car_id').setValue(car_id);
		this.brandName = name;
		this.modelName = 'Model';
		this.fuelName = 'Fuel';
		this.variantName = 'Variant';
		this.registrationName = 'Registration';

		this.form_brand = code;
		//this.quoteForm.get('car_id').setValue(car_id);
		this.quoteForm.get('brand_code').patchValue(code);
		this.brandFormGroup.get('brandCtrl').setValidators([]);
		this.brandFormGroup.get('brandCtrl').updateValueAndValidity();
		if (full_name == '') {
			var filter_tw_list: any;
			this.twJson.forEach(el => {
				if (el.brand_code == code) {
					filter_tw_list = el;
				}
			});
			this.quoteForm.get('car_fullname').setValue(filter_tw_list.full_name);
		}

		this.get_model(code);
		this.get_top_model(code);
		this.goForward();

	}
	modelValidation() {
		/*     this.fuelFormGroup.get('fuelCtrl').setValidators([Validators.required]);
			this.fuelFormGroup.get('fuelCtrl').updateValueAndValidity(); */
		this.variantFormGroup.get('variantCtrl').setValidators([Validators.required]);
		this.variantFormGroup.get('variantCtrl').updateValueAndValidity();
	}
	modelTapped(name, code) {
		this.stepper.reset();
		this.goForward();
		this.modelValidation();
		this.modelName = name;
		this.fuelName = 'Fuel';
		this.variantName = 'Variant';
		this.registrationName = 'Registration';
		this.form_model = code;
		this.get_fuel(code);
		this.modelFormGroup.get('modelCtrl').setValidators([]);
		this.modelFormGroup.get('modelCtrl').updateValueAndValidity();
		this.goForward();
	}
	fuelTapped(fuel_type_text, fuel_type, model_code) {
		this.variantName = 'Variant';
		this.registrationName = 'Registration';
		this.fuelFormGroup.get('fuelCtrl').setValidators([]);
		this.fuelFormGroup.get('fuelCtrl').updateValueAndValidity();
		// DONE BY ARIT
		if (fuel_type_text == 'Ext Cng') {
			fuel_type_text = 'Petrol';
			this.CNG_LPG_Kit_type = true;
			this.lpg_cngkit = 20000;
		} else {
			this.CNG_LPG_Kit_type = false;
			this.lpg_cngkit = 0;
		}
		// DONE BY ARIT ENDS HERE
		this.get_variant(model_code, fuel_type_text);
		this.get_top_variant(model_code, fuel_type_text);

		this.form_fuel = fuel_type_text;
		this.form_variant = "0";
		this.form_car = "0";
		this.fuelName = fuel_type_text;
		this.goForward();
	}
	async variantTapped(car_id, variantName, variant_code = '', cc = '') {
		await this.doSomething(car_id);
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => { });
		this.quoteForm.get('car_id').setValue(car_id);
		this.quoteForm.get('car_cc').setValue(cc);
		this.form_car = car_id;
		this.quoteForm.get('car_fullname').setValue(this.filter_tw_list.full_name);
		this.variantFormGroup.get('variantCtrl').setValidators([]);
		this.variantFormGroup.get('variantCtrl').updateValueAndValidity();
		this.variantName = variantName;
		this.form_variant = variant_code;
		if (car_id != "0" && typeof car_id !== 'undefined') {
			//this.brandChanged(car_id);
		}
		this.get_rto_list();
		this.goForward();
	}
	get_rto_list() {
		var totalRTOListFilter = [];
		var output: any;
		//output = { id: "0", name: "Select RTO (e.g. MH02 or Mumbai)" };
		//totalRTOListFilter.push(output);
		this.rtoJson.forEach(el => {
			output = { id: el.id, name: el.rto_code + " " + el.city_name + ", " + el.sname + " " };
			totalRTOListFilter.push(output);
		});
		this.totalRtoList = totalRTOListFilter;
	}
	rtoMasking(searchValue: string, event, selectContent) {
		if (event.inputType != 'deleteContentBackward') {
			if (/^([a-zA-Z]{2})$/.test(searchValue)) {
				searchValue = searchValue + '-';
				selectContent.filterValue = searchValue;
			}
		}
	}

	registrationTapped(rto_id) {
		this.contactFormGroup.get('mobileNoCtrl').setValue(this.refferJson.cust_phone);
		this.contactFormGroup.get('emailCtrl').setValue(this.refferJson.cust_email);

		this.rtoJson.forEach(el => {
			if (el.id == rto_id) {
				this.form_rto_code = el.rto_code;
				this.rtoDetail = el;
				this.quoteForm.get('rtoText').setValue(el.rto_code + " " + el.city_name + ", " + el.sname);
				this.quoteForm.get('rto_id').setValue(el.id);
				this.quoteForm.get('rto_details').setValue(this.rtoDetail);
				this.regisFormGroup.get('regisCtrl').setValue(el.rto_code + " " + el.city_name + ", " + el.sname);
				this.form_rto_id = el.id;
			}
		});
		if (this.form_premium_type != 1) {
			this.regisFormGroup.get('regisYrCtrl').setValidators([]);
			this.regisFormGroup.get('regisYrCtrl').updateValueAndValidity();
			this.contactFormGroup.get('lastClaim').setValidators([]);
			this.contactFormGroup.get('lastClaim').updateValueAndValidity();
			this.contactFormGroup.get('lastClaim').setValue('0');
			this.contactFormGroup.get('expiryDate').setValidators([]);
			this.contactFormGroup.get('expiryDate').updateValueAndValidity();
			this.goForward();
		} else {
			this.regisFormGroup.get('regisYrCtrl').setValidators([Validators.required]);
			this.regisFormGroup.get('regisYrCtrl').updateValueAndValidity();
			this.contactFormGroup.get('lastClaim').setValidators([Validators.required]);
			this.contactFormGroup.get('lastClaim').updateValueAndValidity();
			this.contactFormGroup.get('lastClaim').setValue('0');

			this.contactFormGroup.get('expiryDate').setValidators([Validators.required]);
			this.contactFormGroup.get('expiryDate').updateValueAndValidity();

			if (!this.isEdit) {
				setTimeout(() => {
					this.goForward();
				}, 250);
			}
		}

		if (this.isEdit && this.quoteForm.get('isRenewal').value == 1) {
			let now = new Date();
			if (now.getFullYear == this.quoteJson.registration_date.year) {
				this.regisFormGroup.get('regisYrCtrl').setValue('');
			}
			else {
				this.regisFormGroup.get('regisYrCtrl').setValue(this.quoteJson.registration_date.year);
			}
			//this.contactFormGroup.get('mobileNoCtrl').setValue(this.quoteJson.cust_phone);
			//this.contactFormGroup.get('emailCtrl').setValue(this.quoteJson.cust_email);
			let ped = this.quoteJson.pre_policy_expiry_date;
			let previous_policy_exp_date = ped.month + '/' + ped.day + '/' + ped.year;
			let dd = new Date(previous_policy_exp_date);
			this.contactFormGroup.get('expiryDate').setValue(dd);
			this.contactFormGroup.get('lastClaim').setValue(this.quoteJson.lastClaim);
			if (!this.isEdit) {
				setTimeout(() => {
					this.focusYrRto();
				}, 1000);
			}
		}
		else if (this.isEdit && this.quoteForm.get('isRenewal').value == 0) {
			this.regisFormGroup.get('regisYrCtrl').setValue(this.quoteJson.registration_date.year);
			//this.contactFormGroup.get('mobileNoCtrl').setValue(this.quoteJson.cust_phone);
			// this.contactFormGroup.get('emailCtrl').setValue(this.quoteJson.cust_email);
			//this.contactFormGroup.get('expiryDate').setValue(this.quoteJson.pre_policy_expiry_date);
			this.contactFormGroup.get('lastClaim').setValue(this.quoteJson.lastClaim);
			this.goForward();
		}
	}

	contactTapped(year) {
		let now = new Date();
		this.expireMinDate = new Date(year + 1, 0, 1);
		var d = new Date();
		d.setDate(d.getDate() + 60);
		var month = d.getMonth() + 1;
		var day = d.getDate();
		this.expireMaxDate = new Date(d.getFullYear(), month, day);
		this.contactFormGroup.get('expiryDate').setValue('');
		this.contactActive = true;
		this.registrationActive = false;
		this.variantActive = false;
		this.fuelActive = false;
		this.modelActive = false;
		this.makeActive = false;
		this.regisFormGroup.get('regisYrCtrl').setValue(year);
	}

	focusCursorRegdate() {
		if (this.form_premium_type == 0) {
			this.singleSelect.focus();
		}
	}
	focusRegdate() {
		// if (this.form_premium_type == 0) {
		// }
		this.singleSelect.open();
	}

	selectionChange($event) {
		/* if ($event.selectedIndex == 0) { */
		this.move($event.selectedIndex + 1);
		//this.fuelTapped();
		/* } */
		this.selectedStepperIndex = $event.selectedIndex + 1;
		this.contactSubmitLoader = false;
	}
	filterRTO(city_id) {
		var filter_rto = [];
		var output: any;
		this.rtoJson.forEach(el => {
			if (el.city_id == city_id) {
				output = { "id": el.id, "name": el.rto_code + " " + el.city_name + ", " + el.sname };
				filter_rto.push(output);
			}
		});
		this.totalRtoList = filter_rto;
	}
	/*----------chandra--------*/

	// openChatbot(){
	// 	if (typeof this.localWindow.orientation === 'undefined'){
	// 		setTimeout(()=>{
	// 			this.loadChat('chat_load_desktop_fw.js');
	// 		}, 1000);
	// 	} else {
	// 		setTimeout(()=>{
	// 			this.loadChat('chat_load_mobile.js');
	// 		}, 1000);
	// 	}
	// }

	// loadChat(jsFile){
	// 	// IMPORT CHAT JS FILE
	// 	let chat_src	="https://www.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm="+new Date().getTime();
	// 	let elem1=this.htmlDocument.getElementById("snackbar");
	// 	let elem=this.htmlDocument.getElementById("chat_src");
	// 	if( elem ){
	// 		elem.parentNode.removeChild(elem);
	// 		elem1.parentNode.removeChild(elem1);
	// 	}
	// 	var parent_head  = this.htmlDocument.getElementsByTagName('head')[0];
	// 	var script=this.htmlDocument.createElement('script');
	// 	script.id="chat_src";
	// 	script.setAttribute('domain_name', 'CHAT');
	// 	script.type='text/javascript';
	// 	script.src=chat_src;
	// 	parent_head.appendChild(script);
	// }

	openDialogOtp(phone_no) {
		let getquoteJson = {
			"phone_no": phone_no,
			"action_type": "SEND_OTP",
			"serviceUrl": ""
		};

		getquoteJson.serviceUrl = this.APIURL + "otp-verify.php";
		const curObj = this;
		this.apiService.signIn(getquoteJson).subscribe(data => {
			let res: any = data;
			let rd = (res);
			if (rd.status == 1) {
				this.proceedToQuote();
			}
			else if (rd.status == 2) {
				const dialogRef = this.dialog.open(DialogContentExampleDialog,
					{
						//width: '550px'
						data: { name: 'otpverify', phone_no: phone_no }
					});
				dialogRef.disableClose = true;
				dialogRef.afterClosed().subscribe(result => {
					//this.proceedToQuote();
					if (result && result.status && result.status == 1) {
						dialogRef.disableClose = false;
						this.proceedToQuote();
					}
				});
			}
			else {
				this.otp_msg = "Oops. This contact no has reached maximum limit.";
			}
		});
	}

	contactFormSubmit() {
		if (this.contactFormGroup.invalid) {
			this.custMobileNo.nativeElement.focus();
			return;
		}
		if (this.IS_LIVE == 2) {
			this.localStorage.getItem('userJson').subscribe((data: any) => {
				if (data != null) {
					this.proceedToQuote();
				} else {
					//this.openDialogOtp(this.contactFormGroup.get('mobileNoCtrl').value);
					this.proceedToQuote();
				}
			});
		} else {
			this.proceedToQuote();
		}
	}

	proceedToQuote() {
		this.contactSubmitLoader = true;
		let now = new Date();
		var registrationDate: any;
		if (this.registrationDate) {
			registrationDate = { year: parseInt(this.registrationDate.year), month: parseInt(this.registrationDate.month), day: parseInt(this.registrationDate.day) };
		} else {
			if (this.form_premium_type == 1)
				registrationDate = { year: parseInt(this.regisFormGroup.get('regisYrCtrl').value), month: now.getMonth() + 1, day: now.getDate() };
			else
				registrationDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
		}

		let date = new Date(2009, now.getMonth(), 10);
		let month = date.toLocaleString('default', { month: 'short' });
		let num = now.getDate();
		let regText: string = num.toString();
		regText += " " + month;
		regText += " " + (registrationDate.year).toString();
		var manufactureDate: any;

		if (this.registrationDate) {
			manufactureDate = { year: parseInt(this.registrationDate.year), month: parseInt(this.registrationDate.month), day: 1 };
		} else {
			if (this.form_premium_type == 1)
				manufactureDate = { year: parseInt(this.regisFormGroup.get('regisYrCtrl').value), month: now.getMonth() + 1, day: 1 };
			else
				manufactureDate = { year: now.getFullYear(), month: now.getMonth() + 1, day: 1 };

		}

		var prev_ncb = 0;
		var new_ncb = 0;
		let yearSpan = 0;
		let lastClaimedYear = parseInt(this.contactFormGroup.get('lastClaim').value);
		if (this.form_premium_type == 1) {
			let manufactureYear = parseInt(this.regisFormGroup.get('regisYrCtrl').value);
			let currYear = new Date().getFullYear();
			if (lastClaimedYear == 0) {
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
			if (lastClaimedYear == 1) {
				prev_ncb = 0;
				new_ncb = 0;
			}
		}
		else {
			this.regMaxDate = this.regMaxDate + 1;
			prev_ncb = 0;
			new_ncb = 0;
		}

		let pre_policy_expiry_date;
		if (this.form_premium_type == 1) {
			if (!this.dont_have_prev_policy) {
				let ped = this.contactFormGroup.get('expiryDate').value;

				pre_policy_expiry_date = { year: ped.getFullYear(), month: ped.getMonth() + 1, day: ped.getDate() };
			}
			else {
				let last3months = new Date(now.setMonth(now.getMonth() - 2));
				pre_policy_expiry_date = { year: last3months.getFullYear(), month: last3months.getMonth(), day: last3months.getDate() };
			}
		}
		else {
			pre_policy_expiry_date = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
		}

		this.quoteForm.get('registration_date_text').setValue(regText);
		this.quoteForm.get('new_ncb').setValue(new_ncb);
		this.quoteForm.get('prev_ncb').setValue(prev_ncb);
		this.quoteForm.get('registration_date').setValue(registrationDate);
		this.quoteForm.get('manufacture_date').setValue(manufactureDate);
		this.quoteForm.get('brand_name').setValue(this.brandName);
		this.quoteForm.get('model_name').setValue(this.modelName);
		this.quoteForm.get('fuel_name').setValue(this.fuelName);
		this.quoteForm.get('variant_name').setValue(this.variantName);
		this.quoteForm.get('fuel_type_text').setValue(this.form_fuel);

		this.quoteJson = {
			"policy_type": 'MOTOR',
			"quoteID": '',
			"KOTAK_ORIGINAL_IDV": 0,
			"user_code": this.quoteForm.value.userCode,
			"brand_code": this.form_brand,
			"model_code": this.form_model,
			"fuel_type": this.form_fuel,
			"variant_code": this.form_variant,
			"rto_id": this.form_rto_id,
			"rto_code": this.form_rto_code,
			"form_premium_type": this.form_premium_type,
			"is_renewal": this.form_premium_type,
			"cust_email": this.contactFormGroup.get('emailCtrl').value,
			"cust_phone": this.contactFormGroup.get('mobileNoCtrl').value,
			"pre_policy_type": "COMPREHENSIVE",
			"pre_policy_expiry_date": pre_policy_expiry_date,
			"registration_date": registrationDate,
			"registration_date_text": this.quoteForm.get('registration_date_text').value,
			"manufacture_date": manufactureDate,
			"last_claimed_year": this.regisFormGroup.get('regisYrCtrl').value,
			"contactFormDetails": this.quoteForm.value.contactFormGroup,
			"lastClaim": this.quoteForm.value.contactFormGroup.lastClaim,
			"car_fullname": this.quoteForm.get('car_fullname').value,
			"brand_name": this.quoteForm.value.brand_name,
			"model_name": this.quoteForm.value.model_name,
			"fuel_type_text": this.quoteForm.get('fuel_type_text').value,
			"fuel_name": this.quoteForm.value.fuel_name,
			"variant_name": this.quoteForm.get('variant_name').value,
			"car_cc": this.quoteForm.get('car_cc').value,
			"rtoText": this.quoteForm.get('rtoText').value,
			"car_id": this.quoteForm.value.car_id,
			"rto_details": this.rtoDetail,
			"prev_insurer": 0,
			"modifyIDV": 0,
			"idv": 0,
			"paid_driver_type": false,
			"paid_driver": 0,
			"ll_paid_driver_type": false,
			"ll_paid_driver": 0,
			"pa_owner_type": false,
			"pa_owner": 0,
			"is_unnamed_passenger": 0,
			"elec_acc_type": false,
			"elec_acc": 0,
			"non_elec_acc_type": false,
			"non_elec_acc": 0,
			//"CNG_LPG_Kit_type": false,
			//"lpg_cngkit": 0,
			"CNG_LPG_Kit_type": this.CNG_LPG_Kit_type,
			"lpg_cngkit": this.lpg_cngkit,
			"vol_discount": 0,
			"prev_ncb": prev_ncb,
			"new_ncb": new_ncb,
			"carrier_type": this.carrierType,
			"dont_have_prev_policy": this.dont_have_prev_policy,
			'occupationType': 0,
			'dob': '',
			'associationName': '',
			'membershipNo': '',
			'antiTheftDevice': 0,
			'carAccessories': '',
			'nonElectricalAccessories': '',
			'imt': 0,
			'coverType': '',
			"zero_dep": 0,
			"kotak_nil_dep": 0,
			"engine_protector": 0,
			"consumable_cover": 0,
			"ncb_protector": 0,
			"roadside_assistance": 0,
			"invoice_return": 0,
			"tyre_cover": 0,
			"travel_cover": 0,
			"personal_cover": 0,
			"loss_key_cover": 0,
			"rim_damage": 0,
			"medical_cover": 0,
			"daily_allowance": 0,
			"loss_accessories_cover": false,
			'contactForm': this.quoteForm.value.contactFormGroup,
			"uniqueID": this.uniqueID,
			"affiliate_customer_request_id": this.affiliate_customer_request_id,
			"unnamed_passenger": 100000,
			"is_voluntary_deduct": false,
			"voluntary_deduct_am": 0,
			"is_biFuelKit": false,
			"biFuelKit_Si": 0,
			"is_tppd_deduct": false,
			"occupationDiscount": false,
			"occupationDiscountValue": null,
			"motorAssociationDiscount": false,
			"motorAssociationDiscountValue": [{ association_Name: "" }, { membership_No: "" }, { expiry_Date: "" }],
			"AntiTheftDeviceDiscount": false,
			"showCustomIDV": false,
			"regMinDate": new Date(this.regMinDate, now.getMonth(), now.getDate()),
			"regMaxDate": new Date(this.regMaxDate, now.getMonth(), now.getDate()),
			"minExpDate": new Date(registrationDate.year + 1, registrationDate.month - 1, registrationDate.day),
			"maxExpDate": this.expireMaxDate,
			"isThirdParty": false,
			"premium_type": "COM",
			"modify_coverItem": false,
			"pa_cover_checked": false,
			"recal": false,
			"HandicappedDiscount": false,
			"deviceInfo": this.device_info,
			"modifyCarInfo": false,
			"kotak_addon": false,
			"source_user": this.source_user,
			"role_type": this.role_type,
			"user_token": this.user_token,
			"deductWallet": 0
		};
		let backToQuote = {
			back: false
		}
		this.localStorage.setItem('backToQuote', backToQuote).subscribe(() => { });
		this.localStorage.removeItem('globalPremAddonArray').subscribe(() => { });
		this.localStorage.removeItem('globalAccessories').subscribe(() => { });
		this.localStorage.removeItem('globalAdditionalCover').subscribe(() => { });
		this.localStorage.removeItem('globalAddonArray').subscribe(() => { });
		this.localStorage.removeItem('premiumJson').subscribe(() => { });
		this.localStorage.removeItem('thirdPartyCover').subscribe(() => { });
		if (this.IS_LIVE == 2 || this.IS_LIVE == 1) {
			this.localStorage.removeItem('proposalJson').subscribe(() => { });
		}

		let vistorDetails = {
			"unique_id": this.uniqueID,
			"quote_id": 0,
			"page_id": "2",
			"created_by": this.source_user,
		}

		this.apiService.TrackUserSubmit(vistorDetails).subscribe(data => {
		});

		let userTrackData = {
			"unique_id": this.uniqueID,
			"quote_id": "0",
			"page_id": "2",
			"btn_id": 'create-quote-btn',
			"serviceUrl": ""
		};
		this.apiService.track_button(userTrackData).subscribe(data => {
		});
		dht('GIBL_QUOTE_PROCESS', this.quoteJson);
		this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
			//this.router.navigate(['/quote-compare']);
			this.navigateURL('quote-compare');
		});
	}
	checkLength(value, l) {
		if (value.length > l && l == 10) {
			this.contactFormGroup.get('mobileNoCtrl').setValue(parseInt(value.substring(0, l)));
		}
	}
	track_button(buttonClassname) {
		let userTrackData = {
			"unique_id": this.uniqueID,
			"quote_id": "0",
			"page_id": "2",
			"btn_id": buttonClassname,
			"serviceUrl": ""
		};
		this.apiService.track_button(userTrackData).subscribe(data => { });
	}
}

@Component({
	selector: 'otp-dialog.html',
	templateUrl: 'otp-dialog.html',
})
export class DialogContentExampleDialog implements OnInit {
	name = '';
	phone_no = '';
	panelOpenState = false;
	otpForm: FormGroup;
	submitted: boolean = false;
	APIURL: string = "";
	loginStatus: string;
	loginPopupShow: boolean = false;
	menuPopupShow: boolean = true;

	constructor(public dialogRef: MatDialogRef<DialogContentExampleDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private apiService: AppService, protected localStorage: LocalStorage, private router: Router) {

	}
	ngOnInit() {
		
		this.otpForm = new FormGroup({
			otp: new FormControl('', [Validators.required]),
		});
		this.APIURL = this.apiService.getUserServiceURL();
	}
	onNoClick(white_label = 0): void {
		this.dialogRef.close(white_label);
	}
	openDialogLongin() {
		this.menuPopupShow = false;
		this.loginPopupShow = !this.loginPopupShow;
	}

	// QUOTE FORM SUBMIT
	userFormSubmit(form: any, e: any): void {
		e.target.submit();
	}

	resendOTP() {
		let getquoteJson = {
			"phone_no": this.data.phone_no,
			"action_type": "SEND_OTP",
			"serviceUrl": ""
		};

		getquoteJson.serviceUrl = this.APIURL + "otp-verify.php";
		const curObj = this;
		this.apiService.signIn(getquoteJson).subscribe(data => {
			let res: any = data;
			let rd = (res);
			if (rd.status == 2) {
				this.loginStatus = "OTP sent to your mobile number";
			}
			else {
				this.loginStatus = "Oops. This contact no has reached maximum limit.";
			}
		});
	}
	otpverify() {
		this.loginStatus = '';
		if (this.otpForm.invalid) {
			return;
		}
		this.submitted = true;
		const signinData = this.otpForm.value;
		let getquoteJson = {
			"otp": signinData.otp,
			"phone_no": this.data.phone_no,
			"action_type": "VERIFY_OTP",
			"serviceUrl": ""
		};

		getquoteJson.serviceUrl = this.APIURL + "otp-verify.php?TYPE=1";
		const curObj = this;
		this.apiService.signIn(getquoteJson).subscribe(data => {
			let res: any = data;
			let rd = (res);
			if (rd.status == 1) {
				curObj.dialogRef.close({ 'status': 1 });
			} else {
				this.loginStatus = "Oops. You have entered wrong OTP";
			}

		});
	}
}
