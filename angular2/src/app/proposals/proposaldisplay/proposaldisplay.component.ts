import { Component, OnInit, ViewChild, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { MatTabGroup } from '@angular/material';
import { MatTabChangeEvent } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";
import statejson from '../../../assets/json/state_master.json';
import nationaljson from '../../../assets/json/national_branch.json';
import cityjson from '../../../assets/json/city_master.json';
import { AppService } from '../../service/app.service';
import kotakjson from './kotak_finance.json';
import hdfcjson from './hdfc_finance.json';
import { DOCUMENT } from '@angular/common';
declare const dht: any;
@Component({
	selector: 'app-proposaldisplay',
	templateUrl: './proposaldisplay.component.html',
	styleUrls: ['./proposaldisplay.component.scss', '../../../assets/proposal/css/main.css'],
	//encapsulation: ViewEncapsulation.Native
})

export class ProposaldisplayComponent implements OnInit {
	POSP_name: string="";POSPshortname: string="";
	isLoggedIn = false;
	isRollType8: boolean = false;
  	POSP_URL:string = "";
	carsType: string[] = ['Yes', 'No (New Bike)'];
	@ViewChild('tabs', { static: false }) tabGroup: MatTabGroup;
	// DONE BY ARIT FOR LIVE CHAT
	localWindow: any;
	chatItem: any = {};

	selectedIndex: number = 0;
	maxNumberOfTabs: number = 3;
	registerForm: FormGroup;
	personalFormGroup: FormGroup;
	custDOBDD: any[] = [];
	custDOBMM: any[] = [];
	custDOBYY: any[] = [];
	PANYY: any[] = [];
	panINCOPDD: any[] = [];
	panINCOPMM: any[] = [];
	panINCOPYY: any[] = [];
	nomineeDOBDD: any[] = [];
	nomineeDOBMM: any[] = [];
	nomineeDOBYY: any[] = [];
	appointeeDOBDD: any[] = [];
	appointeeDOBMM: any[] = [];
	appointeeDOBYY: any[] = [];
	refferJson: any;
	stateJson: any;
	cityJson: any;
	quoteJson: any;
	userJson: any;
	proposalConfirmationJson: any = {};
	kotakJson: any;
	nationalJson: any;
	hdfcJson: any;
	premiumJson: any;
	car_fullname = "";
	filtercityJson: any;
	custStateLabel: any;
	custCityLabel: any;
	rtoCodeTmp: any;
	showData = false;
	IS_LIVE: any;
	COMPANY_LOGO = '';
	PROVIDER_ID = '';
	idv = '';
	COMPANY_NAME = '';
	SERVICE_TAX = '';
	TOTAL_PREMIUM = '';
	NET_PREMIUM = '';
	PREMIUM_YEAR = '';
	getQuote: any;
	customerDetailsRes: any;
	customerID: any;
	customerData: any;
	personalDetailJson: any;
	MagmahypoJson: any;
	totalMagmaHypoList: any;
	proposalJson: any;
	rtoPat = "[A-Za-z]{0,3}[0-9]{4}$";
	carDetailJson: any;
	nomineeDetailJson: any;
	addressDetailJson: any;
	proposalJson1: any;
	prev_policy_type = '';
	name_place_holder = '';
	pan_place_holder = '';
	isNew: any;
	myControl = new FormControl('', [Validators.required]);
	myStateControl = new FormControl('', [Validators.required]);
	myCityControl = new FormControl('', [Validators.required]);
	myNationalControl = new FormControl('');
	prevInsurer = [{ id: 2, name: "Bajaj Allianz" }, { id: 3, name: "Bharti AXA" }, { id: 4, name: "Cholamandalam" }, { id: 5, name: "Future General" }, { id: 6, name: "HDFC Ergo" }, { id: 7, name: "ICICI Lombard" }, { id: 8, name: "IFFCO Tokio" }, { id: 25, name: "Liberty Videocon" }, { id: 21, name: "Magma HDI" }, { id: 10, name: "National Insurance" }, { id: 18, name: "New India" }, { id: 11, name: "Oriental Insurance" }, { id: 12, name: "Reliance General" }, { id: 13, name: "Royal Sundaram" }, { id: 23, name: "SBI General Insurance" }, { id: 26, name: "Shriram General Insurance" }, { id: 17, name: "TATA-AIG" }, { id: 15, name: "United India" }, { id: 16, name: "Universal Sompo General" }, { id: 29, name: "Godigit" }, { id: 30, name: "acko" }, { id: 31, name: "dhfl" }, { id: 32, name: "coco" }, { id: 28, name: "Kotak General Insurance" }, { id: 24, name: "Raheja QBE" }];
	filteredOptionsPrevInsurer: Observable<any>;
	filteredOptionsState: Observable<any>;
	filteredOptionsCity: Observable<any>;
	filteredOptionsNational: Observable<any>;
	prevInsuErr = false;
	setNationalErr = false;
	setStateErr = false;
	setCityErr = false;
	showCustDobError: boolean = false;
	showNomineeDobError: boolean = false;
	agediffDobError: boolean = false;
	showAppointeeDobError: boolean = false;
	NomineeBool: any;
	errorCustDobmsg: any;
	white_label = 0;
	USERURL = "";
	retailerID: any;
	BASEURL: any;
	totalDay: any = 31;
	pincodeValid = false;
	cpaCover: any = 0;
	is_owner = 0;
	isOwnerCompanyTitleShow: boolean = false;

	custDocType:string='Pan card';
	custDocTypeEg:string='e.g.HR-0619850034761';
	docTypeArr: any[] = ["Pan card","Voter Id","Driving license","Aadhaar number","Passport number"];

	uiStyle:any;
	isSponsored:boolean=false;
	logo:string='assets/quote/img/logo.png';

	@ViewChild('navBar', {static: false}) navBar:ElementRef;
	showRegistrationNumber: boolean=true;
	isPospImg: boolean;
	POSP_img: any;

	fakeArray(length: number): Array<any> {
		if (length >= 0) {
			return new Array(length);
		}
	}
	affiliateParam: string = '';

	personalDetailTab: any;
	carDetailTab: any;
	nomineeDetailTab: any;
	addressDetailTab: any;
	personalDetailComplete: any;
	carDetailComplete: any;
	nomineeDetailComplete: any;
	addressDetailComplete: any;
	domain_url="";
	carInsurUrl:any;
	bikeInsurUrl:any;
	cvInsurUrl:any;
	healthInsurUrl:any;
	travelInsurUrl:any;
	termInsurUrl:any;

	constructor(private apiService: AppService, private formBuilder: FormBuilder, private localStorage: LocalStorage, private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) public document: Document,
		@Inject(DOCUMENT) public htmlDocument: HTMLDocument) {
		this.localWindow = this.document.defaultView;
		this.USERURL = this.apiService.getUserServiceURL();
		this.getnerateDateList();
		this.getnerateDateListNominee();
		this.getnerateDateListAppointee();
			this.activepersonalDetail()
		for (let i = 1; i <= 12; i++) {
			if (i < 10) {
				var mm = "0" + i.toString();
			}
			else {
				var mm = i.toString();
			}
			this.custDOBMM.push(mm);
		}
		for (let i = 1; i <= 12; i++) {
			if (i < 10) {
				var mm = "0" + i.toString();
			}
			else {
				var mm = i.toString();
			}
			this.nomineeDOBMM.push(mm);
		}
		for (let i = 1; i <= 12; i++) {
			if (i < 10) {
				var mm = "0" + i.toString();
			}
			else {
				var mm = i.toString();
			}
			this.appointeeDOBMM.push(mm);
		}

		var curr_adult = new Date().getFullYear() - 18;
		var last_adult = new Date().getFullYear() - 99;

		for (let i = curr_adult; i > last_adult; i--) {
			this.custDOBYY.push(i);
		}

		var panStart_adult = new Date().getFullYear();
		var panLast_adult = new Date().getFullYear() - 99;
		for (let i = panStart_adult; i > panLast_adult; i--)
		{
			this.PANYY.push(i);
		}

		var curr_nominee_adult = new Date().getFullYear() - 0;
		var last_nominee_adult = new Date().getFullYear() - 99;

		for (let i = curr_nominee_adult; i > last_nominee_adult; i--) {
			this.nomineeDOBYY.push(i);
		}

		var curr_appointee_adult = new Date().getFullYear() - 20;
		var last_appointee_adult = new Date().getFullYear() - 99;

		for (let i = curr_appointee_adult; i > last_appointee_adult; i--) {
			this.appointeeDOBYY.push(i);
		}
	}

	// FUNCTION TO CHECK CUSTOMER AGE RANGE RESTRICTION
	public checkPUCStatus(control: FormControl) {
		const puc_value = control.value;
		return (puc_value > 0) ? null : { 'puc_error': true };
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
		this.IS_LIVE = this.apiService.getIsLIVE();
		this.BASEURL = this.apiService.getBaseURL();
		this.localStorage.getItem('refferJson').subscribe((data: any) => {
			if (data && data != '') {
				this.refferJson = data;
			}
		});
		this.localStorage.getItem('userJson').subscribe((data: any) => {
			if (data != null) {
				this.retailerID = data.user_code;
				if (data.white_label == '1') {
					this.white_label = 1;
				}
			}
			else {
				this.retailerID = 0;
			}
			if (this.white_label != 1) {
				// DONE BY ARIT FOR LIVE CHAT
				// this.apiService.openLiveChatbot();
			}
		});

		this.registerForm = this.formBuilder.group({
			isSubmitted: ['1', [Validators.required]],
			userCode: [0],
			createdBy: [0],

			personalDetailForm: this.formBuilder.group({
				custTitle: ['Mr.', [Validators.required]],
				//custName: ['', [Validators.required, Validators.pattern(/(\w.+\s).+/)]],
				custName: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z].*)([a-zA-Z\s]*)$/)]],
				custPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
				custEmail: ['', [Validators.required, Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)]],
				custGstNo: ['', [Validators.pattern(/^([0]{1}[1-9]{1}|[1-2]{1}[0-9]{1}|[3]{1}[0-7]{1})([a-zA-Z]{5}[0-9]{4}[a-zA-Z]{1}[1-9a-zA-Z]{1}[zZ]{1}[0-9a-zA-Z]{1})+$/g)]],
				custPancard: ['', [Validators.pattern(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/)]],
				custDocType: ['Pan card', [Validators.required]],
				custOtherDoc:['', [Validators.pattern(/^(([a-zA-Z]{2}[0-9]{2})( )|([a-zA-Z]{2}[0-9]{2})|([a-zA-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/)]],
				custDOBDD: ['', Validators.required],
				custDOBMM: ['', Validators.required],
				custDOBYY: ['', Validators.required],
				panINCOPDD: [''],
				panINCOPMM: [''],
				panINCOPYY: [''],
				custId: [''],
				isOwnerCompany: ['0'],
				companyTitle: ['M/S', []],
				companyName: ['', []],
				OrganizationContactPersonName: ['', []],
			}),

			carDetailForm: this.formBuilder.group({
				rtoCode: ['', []],
				newCar: ['0'],
				rtoregNumber: ['', [Validators.required, Validators.pattern(this.rtoPat)]],
				prevPolicyNo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\d\-/\\s]+$/)]],
				prevInsurer: ['', [Validators.required]],
				prevInsurer_id: [''],
				engineNo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.minLength(6)]],
				chassisNo: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/), Validators.minLength(6)]],//,Validators.maxLength(17)
				pucStatus: ['1'],
				isLoan: ['0', [Validators.required]],
				isOD: ['1', [Validators.required]],
				financierName: [''],
				financierCode: [''],
				financierBranchName: [''],
				TPpolicyExpiryDate: [''],
				tpPolicyNo: [''],
				prevTPInsurer: ['']
			}),
			nomineeDetailForm: this.formBuilder.group({
				nomineeTitle: ['Mr.', [Validators.required]],
				nomineeName: ['', [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z].*)([a-zA-Z\s]*)$/)]],
				//nomineeAge: ['', [Validators.required, Validators.pattern(/^\d*$/), this.ageRangeValidator(18, 120)]],
				appointeeName: [''],
				appointeeRelation: [''],
				appointeeDOBDD: [''],
				appointeeDOBMM: [''],
				appointeeDOBYY: [''],
				nomineeAge: [''],
				nomineeDOBDD: [''],
				nomineeDOBMM: [''],
				nomineeDOBYY: [''],

				nomineeRelation: ['', [Validators.required]]
			}),

			addressDetailForm: this.formBuilder.group({
				custAddress: ['', [Validators.required]],
				custState: ['', [Validators.required]],
				custCity: ['', [Validators.required]],
				custPincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
				//custPincode: ['',[Validators.required, Validators.pattern(!/[^[0-9]]/),Validators.minLength(6)]],
				custStateLabel: [''],
				branch_name: [''],
				role_id: [''],
				custCityLabel: [''],
			})
		});
		/*this.filteredOptionsPrevInsurer = this.myControl.valueChanges
		  .pipe(
			startWith(''),
			map(value => this._filter(value))
		);*/
		this.filteredOptionsState = this.myStateControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterState(value))
			);
		this.filteredOptionsNational = this.myNationalControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterNational(value))
			);
		this.stateJson = statejson;
		this.cityJson = cityjson;
		//this.nationalJson = nationaljson;
		this.parseQueryParam();
		// DONE BY ARIT FOR LIVE CHAT

		// PARSE AFFILIATE LINK
		let full_url = this.router.url.split('?')[0];
		let url_segment = full_url.split('/');
		url_segment.forEach(el => {
			let affilate_index = this.apiService.affiliateList.indexOf(el);
			if (affilate_index !== -1) {
				this.affiliateParam = el;
			}
		});


		// personalDetailForm
		this.localStorage.getItem('quote_form_data').subscribe((data: any) => {
			if (data && !data.page_status.proposal) {
				this.personalDetailForm.patchValue({
					custName: data.name,
				});
				this.carDetailForm.patchValue({
					rtoregNumber: data.registration_no.substr(4, data.registration_no.length),
					prevPolicyNo: data.previous_policy_number,
					prevInsurer_id: parseInt(data.previous_insurance_company_id),
					prevInsurer: data.previous_insurance_company
				});
				this.myControl.setValue(data.previous_insurance_company);
				this.prevInsuErr = false;
			}
		});
	}
	// ngAfterViewInit() {
	// 	this.setPospURL();
	// }
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
	parseQueryParam() {
		this.route.queryParams.subscribe(params => {
			if (params.QID == null) {
				this.saveJourneyData();
					this.localStorage.getItem('premiumJson').subscribe((data) => {
						this.premiumJson = data;
						this.apiService.getKycDocOptions(this.premiumJson.PROVIDER_ID).subscribe((kycOpt: any) => {
							if(kycOpt!==''){
								let kycOptdata = (kycOpt);
								this.custDocType= kycOptdata.default_option;
								this.docTypeArr= kycOptdata.options;
							}
							else{
								this.custDocType='Pan card';
								this.docTypeArr= ["Pan card","Voter Id","Driving license","Aadhaar number","Passport number"];
							}
								this.initialCalls();
						});
					});

			}
			else {
				let getquoteJson = {
					"QID": params.QID,
					"serviceUrl": ""
				};

				this.apiService.getSUBProposal(getquoteJson).subscribe((subProposalDataRes: any) => {
					let subProposalData = (subProposalDataRes);
					this.premiumJson = subProposalData.premiumJson;
					this.quoteJson = subProposalData.quoteJson;
					this.proposalJson = subProposalData.proposalJson;
					this.handleLocalStorageData();
				});
			}
		});
	}
	handleLocalStorageData() {
		this.localStorage.setItem('proposalJson', this.proposalJson).subscribe(() => {
			this.localStorage.setItem('premiumJson', this.premiumJson).subscribe(() => {
				this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
					this.localStorage.getItem('userJson').subscribe((userData) => {
						this.userJson = userData;
						this.router.navigate(['/proposal']);
					});
				});
			});
		});
	}
	saveJourneyData() {
		this.localStorage.getItem('proposalJson').subscribe((proposalData) => {
			this.proposalJson = proposalData;
			this.localStorage.getItem('quoteJson').subscribe((quoteData) => {
				this.quoteJson = quoteData;
				this.localStorage.getItem('premiumJson').subscribe((premiumData) => {
					this.premiumJson = premiumData;
					this.localStorage.getItem('userJson').subscribe((userData) => {
						this.userJson = userData;

						this.proposalConfirmationJson.userJson = this.userJson;
						this.proposalConfirmationJson.quoteJson = this.quoteJson;
						this.proposalConfirmationJson.premiumJson = this.premiumJson;
						this.proposalConfirmationJson.proposalJson = this.proposalJson;

						this.apiService.updateStepProposalPHP(this.proposalConfirmationJson).subscribe(saveData => {
							let saveDataResp = saveData;
						});
					});
				});
			});
		});
	}
	initialCalls() {
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson = data;
			this.UserTrackData(this.quoteJson);
			this.cpaCover = this.quoteJson.cpaCover;
			this.localStorage.getItem('premiumJson').subscribe((data) => {
				this.premiumJson = data;
				this.setPremiumID(this.quoteJson.quoteID, this.premiumJson.PROVIDER_ID, this.premiumJson.NET_PREMIUM);
				this.PROVIDER_ID = this.premiumJson.PROVIDER_ID;
				let new_prev_insurer = [];
				this.prevInsurer.forEach(el => {
					if (el.id.toString() != this.PROVIDER_ID.toString() || el.id.toString() == '18') {
						new_prev_insurer.push(el);
					}
				});
				this.prevInsurer = new_prev_insurer;

				this.filteredOptionsPrevInsurer = this.myControl.valueChanges
					.pipe(
						startWith(''),
						map(value => this._filter(value))
					);

				this.COMPANY_LOGO = this.premiumJson.COMPANY_LOGO;
				this.idv = this.premiumJson.IDV;
				this.COMPANY_NAME = this.premiumJson.COMPANY_NAME;
				this.SERVICE_TAX = this.premiumJson.SERVICE_TAX;
				this.TOTAL_PREMIUM = this.premiumJson.TOTAL_PREMIUM;
				this.NET_PREMIUM = this.premiumJson.NET_PREMIUM;
				this.PREMIUM_YEAR = this.premiumJson.PREMIUM_YEAR;
				this.showData = true;
				if (this.premiumJson.PROVIDER_ID == 12 || this.premiumJson.PROVIDER_ID == 28 || this.premiumJson.PROVIDER_ID == 17 || this.premiumJson.PROVIDER_ID == 6 ||
					this.premiumJson.PROVIDER_ID == 10) {
					this.personalDetailForm.get('custName').setValidators([Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)+$/)]);
					this.name_place_holder = "Enter your first name and last name";
				}
				else {
					this.name_place_holder = "Enter your fullname";
				}
				if (this.premiumJson.PROVIDER_ID == 28) {
					this.kotakJson = kotakjson;
				}
				if (this.premiumJson.PROVIDER_ID == 6) {
					this.hdfcJson = hdfcjson;
				}
				if (this.premiumJson.PROVIDER_ID == 10) {
					this.nationalJson = nationaljson;
				}
				if (this.premiumJson.PROVIDER_ID == 7) {
					this.getHypoMagmaJson('7');
				}
				if (this.premiumJson.PROVIDER_ID == 4) {
					this.getHypoMagmaJson('4');
				}
				if (this.premiumJson.PROVIDER_ID == 21) {
					this.getHypoMagmaJson();
					this.nomineeDetailForm.get('nomineeDOBDD').setValidators([Validators.required]);
					this.nomineeDetailForm.get('nomineeDOBMM').setValidators([Validators.required]);
					this.nomineeDetailForm.get('nomineeDOBYY').setValidators([Validators.required]);
				}
				else {
          this.personalDetailForm.get('isOwnerCompany').setValidators([Validators.required]);
          // isOwnerCompany: ['0', [Validators.required]],
					//this.nomineeDetailForm.get('nomineeAge').setValidators([Validators.required,Validators.pattern(/^\d*$/), this.ageRangeValidator(18, 120)]);
					// FOR HDFC CPA CHECK AND NOMINEE Optional
					if (this.quoteJson.pa_owner <= 0 && this.premiumJson.PROVIDER_ID == 6) {
						this.nomineeDetailForm.get('nomineeName').setValidators([Validators.pattern(/^(?=.*[a-zA-Z].*)([a-zA-Z\s]*)$/)]);
						this.nomineeDetailForm.get('nomineeRelation').setValidators([]);
						this.nomineeDetailForm.get('nomineeAge').setValidators([]);

						this.nomineeDetailForm.get('nomineeName').updateValueAndValidity();
						this.nomineeDetailForm.get('nomineeRelation').updateValueAndValidity();
						this.nomineeDetailForm.get('nomineeAge').updateValueAndValidity();
					}
					else {
						this.nomineeDetailForm.get('nomineeAge').setValidators([Validators.required, Validators.pattern(/^\d*$/), this.ageRangeValidator(18, 120)]);
					}
				}
				if (this.premiumJson.PROVIDER_ID == 28 && this.premiumJson.TOTAL_PREMIUM >= 100000) {
					this.personalDetailForm.get('custPancard').setValidators([Validators.required, Validators.pattern(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/)]);
					this.pan_place_holder = "Type Your PAN Number";
				}
				else {
					this.pan_place_holder = "Type Your PAN Number";
				}

				if (this.premiumJson.PROVIDER_ID == 3) {
					this.carDetailForm.get('pucStatus').setValidators([this.checkPUCStatus]);
				}

				this.personalDetailForm.get('custPancard').updateValueAndValidity();
				if (this.quoteJson.dont_have_prev_policy == true) {
					this.carDetailForm.get('prevPolicyNo').setValidators([]);
					this.carDetailForm.get('prevPolicyNo').updateValueAndValidity();
					this.myControl.setValidators([]);
					this.myControl.updateValueAndValidity();
					this.carDetailForm.get('prevInsurer').setValidators([]);
					this.carDetailForm.get('prevInsurer').updateValueAndValidity();
				}
			});

			this.isNew = this.quoteJson.form_premium_type;

			if (this.isNew == 0) {
				this.showRegistrationNumber=false;
				this.carDetailForm.get('rtoregNumber').setValidators([Validators.pattern(this.rtoPat)]);
				this.carDetailForm.get('rtoregNumber').updateValueAndValidity();
				this.carDetailForm.get('prevPolicyNo').setValidators([]);
				this.carDetailForm.get('prevPolicyNo').updateValueAndValidity();
				this.carDetailForm.get('prevInsurer').setValidators([]);
				this.carDetailForm.get('prevInsurer').updateValueAndValidity();
			}
			if (this.quoteJson.isThirdParty) {
				this.prev_policy_type = 'thirdParty';
			}
			else {
				this.prev_policy_type = 'Comprehensive';
			}
			this.car_fullname = this.quoteJson.car_fullname;
			this.personalDetailForm.patchValue({ "custPhone": this.quoteJson.cust_phone, "custEmail": this.quoteJson.cust_email });
			var rto = this.quoteJson.rto_code;
			var stringArray = rto.split(" ");
			rto = stringArray[0];
			this.carDetailForm.patchValue({ "rtoCode": stringArray[0].replace('-', '') });
			this.rtoCodeTmp = stringArray[0].replace('-', '');
		});

		this.editDetails();
	}
	setPremiumID(QUOTE_ID, PROVIDER_ID, NET_PREMIUM) {
		this.apiService.getpremiumdetails(QUOTE_ID, PROVIDER_ID, NET_PREMIUM).subscribe(data => {
			this.premiumJson.PREMIUM_ID = parseInt(data);
			this.localStorage.setItem('premiumJson', this.premiumJson).subscribe((data) => { });
		});
	}
	homepage() {
		this.router.navigate(['/']);
		// this.localStorage.getItem('userJson').subscribe((data: any) => {
		// 	if (data != null) {
		// 		if (data.role_type.toString() == "16" || data.role_type.toString() == "8") {
		// 			// window.location.href = "https://www.gibl.in/UI/Pages/mHome.aspx";
		// 			window.location.href = this.BASEURL + "/UI/Pages/mHome.aspx";
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

	UserTrackData(quoteJson) {
		let userTrackData = {
			"unique_id": quoteJson.uniqueID,
			"quote_id": quoteJson.quoteID,
			"page_id": "4",
			"created_by": quoteJson.source_user,

		};

		this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
			// console.log('Tracking data proposal', data);
		});
	}

	private _filter(value: string): any {
		const filterValue = value.toLowerCase();
		return this.prevInsurer.filter(option => option.name.toLowerCase().includes(filterValue));
	}
	private _filterState(value: string): any {
		const filterValue = value.toLowerCase();
		return this.stateJson.filter(option => option.sname.toLowerCase().includes(filterValue));
	}
	private _filterNational(value: string): any {
		const filterValue = value.toLowerCase();
		return this.nationalJson.filter(option => option.branch_name.toLowerCase().includes(filterValue));
	}
	private _filterCity(value: string): any {
		const filterValue = value.toLowerCase();
		return this.filtercityJson.filter(option => option.city_name.toLowerCase().includes(filterValue));
	}
	setInsurer(name, id) {
		this.carDetailForm.get('prevInsurer').setValue(name);
		this.carDetailForm.get('prevInsurer_id').setValue(id);
		this.prevInsuErr = false;
	}
	keyinputPrevInsurer(value) {
		this.prevInsuErr = true;
		this.carDetailForm.get('prevInsurer').setValue('');
	}
	resetStateErr(value) {
		this.myCityControl.setValue('');
		this.setStateErr = true;
		this.addressDetailForm.get('custState').setValue('');
	}
	resetNationalErr(value) {
		//this.myNationalControl.setValue('');
		this.setNationalErr = true;
		this.addressDetailForm.get('branch_name').setValue('');
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
	setNational(role_id, branch_name) {
		this.setNationalErr = false;
		this.addressDetailForm.get('role_id').setValue(role_id);
		this.addressDetailForm.get('branch_name').setValue(branch_name);
		this.filteredOptionsNational = this.myNationalControl.valueChanges
			.pipe(
				startWith(''),
				map(value => this._filterNational(value))
			);
	}
	setCity(id, name) {
		this.setCityErr = false;
		this.addressDetailForm.get('custCity').setValue(id);
		this.addressDetailForm.get('custCityLabel').setValue(name);
	}

	personalDetailSubmitted: boolean = false;
	carDetailSubmitted: boolean = false;
	nomineeDetailSubmitted: boolean = false;
	addressDetailSubmitted: boolean = false;

	getnerateDateList() {
		this.custDOBDD = [];
		for (let i = 1; i <= this.totalDay; i++) {
			if (i < 10) {
				var dd = "0" + i.toString();
			}
			else {
				var dd = i.toString();
			}
			this.custDOBDD.push(dd);
		}
	}

	getnerateDateListNominee() {
		this.nomineeDOBDD = [];
		for (let i = 1; i <= this.totalDay; i++) {
			if (i < 10) {
				var dd = "0" + i.toString();
			}
			else {
				var dd = i.toString();
			}
			this.nomineeDOBDD.push(dd);
		}
	}

	getnerateDateListAppointee() {
		//alert('f');
		this.appointeeDOBDD = [];
		for (let i = 1; i <= this.totalDay; i++) {
			if (i < 10) {
				var dd = "0" + i.toString();
			}
			else {
				var dd = i.toString();
			}
			this.appointeeDOBDD.push(dd);
		}
	}

	editDetails() {
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson1 = data;
			if (this.proposalJson1 != null) {

				this.proposalJson1.personalDetailForm.custPhone = this.quoteJson.cust_phone;
				this.proposalJson1.personalDetailForm.custEmail = this.quoteJson.cust_email;

				this.personalDetailForm.get('custTitle').setValue(this.proposalJson1.personalDetailForm.custTitle);
				this.personalDetailForm.get('custName').setValue(this.proposalJson1.personalDetailForm.custName);
				this.personalDetailForm.get('custGstNo').setValue(this.proposalJson1.personalDetailForm.custGstNo);
				this.personalDetailForm.get('custPancard').setValue(this.proposalJson1.personalDetailForm.custPancard);
				this.personalDetailForm.get('custDocType').setValue(this.proposalJson1.personalDetailForm.custDocType);
				this.personalDetailForm.get('custOtherDoc').setValue(this.proposalJson1.personalDetailForm.custOtherDoc);
				this.personalDetailForm.get('custPhone').setValue(this.proposalJson1.personalDetailForm.custPhone);
				this.personalDetailForm.get('custEmail').setValue(this.proposalJson1.personalDetailForm.custEmail);
				this.personalDetailForm.get('custDOBDD').setValue(this.proposalJson1.personalDetailForm.custDOBDD);
				this.personalDetailForm.get('custDOBMM').setValue(this.proposalJson1.personalDetailForm.custDOBMM);
				this.personalDetailForm.get('custDOBYY').setValue(this.proposalJson1.personalDetailForm.custDOBYY);
				this.personalDetailForm.get('custDOBYY').setValue(this.proposalJson1.personalDetailForm.custDOBYY);

				// FOR COMPANY

				this.personalDetailForm.get('isOwnerCompany').setValue(this.proposalJson1.personalDetailForm.isOwnerCompany);
				this.personalDetailForm.get('companyTitle').setValue(this.proposalJson1.personalDetailForm.companyTitle);
				this.personalDetailForm.get('companyName').setValue(this.proposalJson1.personalDetailForm.companyName);
				this.personalDetailForm.get('OrganizationContactPersonName').setValue(this.proposalJson1.personalDetailForm.OrganizationContactPersonName);
				this.personalDetailForm.get('panINCOPDD').setValue(this.proposalJson1.personalDetailForm.panINCOPDD);
				this.personalDetailForm.get('panINCOPMM').setValue(this.proposalJson1.personalDetailForm.panINCOPMM);
				this.personalDetailForm.get('panINCOPYY').setValue(this.proposalJson1.personalDetailForm.panINCOPYY);
				//console.log('this.proposalJson1.personalDetailForm.isOwnerCompany',this.proposalJson1.personalDetailForm.isOwnerCompany);

				if (this.proposalJson1.personalDetailForm.isOwnerCompany
					&& this.proposalJson1.personalDetailForm.isOwnerCompany == 1) {
					this.isOwnerCompanyTitleShow = true;
				}
				this.isOwnerCompanyVm(this.proposalJson1.personalDetailForm.isOwnerCompany);

				this.carDetailForm.get('rtoregNumber').setValue(this.proposalJson1.carDetailForm.rtoregNumber);
				this.carDetailForm.get('prevPolicyNo').setValue(this.proposalJson1.carDetailForm.prevPolicyNo);
				this.carDetailForm.get('isLoan').setValue(this.proposalJson1.carDetailForm.isLoan);
				this.carDetailForm.get('financierName').setValue(this.proposalJson1.carDetailForm.financierName);
				this.carDetailForm.get('financierBranchName').setValue(this.proposalJson1.carDetailForm.financierBranchName);
				this.carDetailForm.get('prevInsurer').setValue(this.proposalJson1.carDetailForm.prevInsurer);
				this.carDetailForm.get('prevInsurer_id').setValue(this.proposalJson1.carDetailForm.prevInsurer_id);
				//this.carDetailForm.get('role_id').setValue(this.proposalJson1.carDetailForm.role_id);
				//this.carDetailForm.get('branch_name').setValue(this.proposalJson1.carDetailForm.branch_name);
				this.myControl.setValue(this.proposalJson1.carDetailForm.prevInsurer);
				this.myNationalControl.setValue(this.proposalJson1.addressDetailForm.branch_name);

				this.carDetailForm.get('engineNo').setValue(this.proposalJson1.carDetailForm.engineNo);
				this.carDetailForm.get('chassisNo').setValue(this.proposalJson1.carDetailForm.chassisNo);

				this.addressDetailForm.get('custAddress').setValue(this.proposalJson1.addressDetailForm.custAddress);
				// this.getCity2(event, this.proposalJson1.addressDetailForm.custState);

				this.addressDetailForm.get('custState').setValue(this.proposalJson1.addressDetailForm.custState);
				this.addressDetailForm.get('custStateLabel').setValue(this.proposalJson1.addressDetailForm.custStateLabel);
				this.myStateControl.setValue(this.proposalJson1.addressDetailForm.custStateLabel);

				this.addressDetailForm.get('custCityLabel').setValue(this.proposalJson1.addressDetailForm.custCityLabel);
				this.addressDetailForm.get('custCity').setValue(this.proposalJson1.addressDetailForm.custCity);
				this.myCityControl.setValue(this.proposalJson1.addressDetailForm.custCityLabel);
				this.addressDetailForm.get('custPincode').setValue(this.proposalJson1.addressDetailForm.custPincode);

				this.nomineeDetailForm.get('nomineeTitle').setValue(this.proposalJson1.nomineeDetailForm.nomineeTitle);
				this.nomineeDetailForm.get('nomineeName').setValue(this.proposalJson1.nomineeDetailForm.nomineeName);
				this.nomineeDetailForm.get('nomineeAge').setValue(this.proposalJson1.nomineeDetailForm.nomineeAge);
				this.nomineeDetailForm.get('nomineeDOBDD').setValue(this.proposalJson1.nomineeDetailForm.nomineeDOBDD);
				this.nomineeDetailForm.get('nomineeDOBMM').setValue(this.proposalJson1.nomineeDetailForm.nomineeDOBMM);
				this.nomineeDetailForm.get('nomineeDOBYY').setValue(this.proposalJson1.nomineeDetailForm.nomineeDOBYY);
				this.nomineeDetailForm.get('nomineeRelation').setValue(this.proposalJson1.nomineeDetailForm.nomineeRelation);

				this.nomineeDetailForm.get('appointeeName').setValue(this.proposalJson1.nomineeDetailForm.appointeeName);
				this.nomineeDetailForm.get('appointeeRelation').setValue(this.proposalJson1.nomineeDetailForm.appointeeRelation);
				this.nomineeDetailForm.get('appointeeDOBDD').setValue(this.proposalJson1.nomineeDetailForm.appointeeDOBDD);
				this.nomineeDetailForm.get('appointeeDOBMM').setValue(this.proposalJson1.nomineeDetailForm.appointeeDOBMM);
				this.nomineeDetailForm.get('appointeeDOBYY').setValue(this.proposalJson1.nomineeDetailForm.appointeeDOBYY);
				//this.proposalJson1.nomineeDetailForm.NomineeBool = this.showNomineeDobError;
				this.checkNomineeAgeRestriction();
			}
			this.changecustDocType('e');

		});
	}
	changecustDocType(cf=''){
		// console.log('cf====>',cf);
		let idType = this.personalDetailForm.get('custDocType').value;
		// console.log('cf====>',idType);
		this.personalDetailForm.get('custPancard').setValidators([]);
		if(cf==''){
			this.personalDetailForm.get('custPancard').setValue('');
			this.personalDetailForm.get('custOtherDoc').setValue('');
		}

		this.personalDetailForm.get('custOtherDoc').setValidators([]);
		switch(idType){
			case 'Voter Id':
				this.custDocTypeEg='e.g.ABC3002623';
				this.personalDetailForm.get('custOtherDoc').setValidators([Validators.required,Validators.pattern(/^([a-zA-Z]{3})(\d{7})$/)]);
				break;
			case 'Pan card':
				this.personalDetailForm.get('custPancard').setValidators([Validators.required,Validators.pattern(/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/)]);
				break;
			case 'Driving license':
				this.custDocTypeEg='e.g.HR06 19850034761';
				this.personalDetailForm.get('custOtherDoc').setValidators([Validators.required,Validators.pattern(/^(([a-zA-Z]{2}[0-9]{2})( )|([a-zA-Z]{2}[0-9]{2})|([a-zA-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/)]);
				break;
			case 'Passport number':
				this.custDocTypeEg='e.g.A2096457';
				this.personalDetailForm.get('custOtherDoc').setValidators([Validators.required,Validators.pattern(/^([a-zA-Z]{1})([0-9]{7})$/)]);
				break;
			case 'Aadhaar number':
				this.custDocTypeEg='e.g.619850034761';
				this.personalDetailForm.get('custOtherDoc').setValidators([Validators.required,Validators.pattern(/^([2-9]{1})([0-9]{11})$/)]);
			break;
			default:
				this.personalDetailForm.get('custOtherDoc').setValidators([Validators.required]);
				this.checkAgeRestriction();
        	break;
		}
		this.personalDetailForm.get('custPancard').updateValueAndValidity();
		this.personalDetailForm.get('custOtherDoc').updateValueAndValidity();

	}
	ageRangeValidator(min: number, max: number): any {
		return (control: any): { [key: string]: boolean } | null => {
			if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
				return { 'ageRange': true };
			}
			return null;
		};
	}
	cannotSpace(control: AbstractControl): ValidationErrors | null {
		if ((control.value as string).indexOf(' ') >= 0) {
			return { cannotContainSpace: true }
		}

		return null;
	}
	getCity2(event, cl = '') {
		var target;
		var custState;
		if (cl != '') {
			custState = cl;
		}
		else {
			console.log('qqqq', event.source)
			custState = event.value;
			target = event.source.selected._element.nativeElement;
			this.custStateLabel = target.innerText.trim();
			this.addressDetailForm.get('custCityLabel').setValue(target.innerText.trim());
		}
		var filter_city = [];
		this.cityJson.forEach(el => {
			if (el.state_id == custState) {
				filter_city.push(el);
			}
		});
		this.filtercityJson = filter_city;
	}
	get f() { return (<FormGroup>this.registerForm.get('personalDetailForm')).controls; }
	get c() { return (<FormGroup>this.registerForm.get('carDetailForm')).controls; }
	get n() { return (<FormGroup>this.registerForm.get('nomineeDetailForm')).controls; }
	get a() { return (<FormGroup>this.registerForm.get('addressDetailForm')).controls; }

	get personalDetailForm() {
		return this.registerForm.get('personalDetailForm');
	}
	get carDetailForm() {
		return this.registerForm.get('carDetailForm');
	}
	get nomineeDetailForm() {
		return this.registerForm.get('nomineeDetailForm');
	}
	get addressDetailForm() {
		return this.registerForm.get('addressDetailForm');
	}
	tabChanged(event: MatTabChangeEvent) {
		// console.log(event)
		this.selectedIndex = event.index;
	}
	nextStep() {
		if (this.selectedIndex != this.maxNumberOfTabs) {
			this.selectedIndex = this.selectedIndex + 1;
		}
		// or this.tabGroup.selectedIndex+=1;
	}

	previousStep() {
		if (this.selectedIndex != 0) {
			this.selectedIndex = this.selectedIndex - 1;
		}
	}

	isLoanVm(flag)
	 {
		// console.log('Isloan',flag);
		if (flag == 1)
		{

			this.carDetailForm.get('financierName').setValidators([Validators.required]);
			if (this.premiumJson.PROVIDER_ID == 6 || this.premiumJson.PROVIDER_ID == 28) {

				this.carDetailForm.get('financierBranchName').setValidators([]);
			}
			else {
				this.carDetailForm.get('financierBranchName').setValidators([Validators.required]);
			}

		}
		else {
			this.carDetailForm.get('financierName').setValidators([]);
			this.carDetailForm.get('financierBranchName').setValidators([]);
		}
		this.carDetailForm.get('financierName').updateValueAndValidity();
		this.carDetailForm.get('financierBranchName').updateValueAndValidity();
	}
	financierCode(data:any){
		this.carDetailForm.get('financierCode').setValue(data);
	}

	isODVm(flag) {


		if (flag == 1) {

			this.carDetailForm.get('TPpolicyExpiryDate').setValidators([Validators.required]);
			if (this.premiumJson.PROVIDER_ID == 8) {

				this.carDetailForm.get('TPpolicyExpiryDate').setValidators([]);
			}
			else {
				this.carDetailForm.get('TPpolicyExpiryDate').setValidators([Validators.required]);
			}

		}
		else {
			this.carDetailForm.get('TPpolicyExpiryDate').setValidators([]);
			this.carDetailForm.get('tpPolicyNo').setValidators([]);
		}
		this.carDetailForm.get('TPpolicyExpiryDate').updateValueAndValidity();
		this.carDetailForm.get('tpPolicyNo').updateValueAndValidity();
	}
	isNewCar(val:any){
		if(val==0){
			this.carDetailForm.get('rtoregNumber').setValidators([Validators.pattern(this.rtoPat)]);
			this.carDetailForm.get('rtoregNumber').updateValueAndValidity();
			this.showRegistrationNumber=false;
		}else{
			this.carDetailForm.get('rtoregNumber').setValidators([Validators.required,Validators.pattern(this.rtoPat)]);
			this.carDetailForm.get('rtoregNumber').updateValueAndValidity();
			this.showRegistrationNumber=true;

		}
	}
	isOwnerCompanyVm(flag) {
		if (flag == 1) {

			this.isOwnerCompanyTitleShow = true;
			this.personalDetailForm.get('isOwnerCompany').setValue(flag);
			this.is_owner = flag;
			this.personalDetailForm.get('companyTitle').setValidators([Validators.required]);
			this.personalDetailForm.get('companyName').setValidators([Validators.required]);


			this.localStorage.getItem('premiumJson').subscribe((data) => {
				this.premiumJson = data;
				if (this.premiumJson.PROVIDER_ID == '28') {
					this.personalDetailForm.get('custGstNo').setValidators([Validators.required]);
					this.personalDetailForm.get('custGstNo').updateValueAndValidity();
					this.personalDetailForm.get('OrganizationContactPersonName').setValidators([Validators.required]);
					this.personalDetailForm.get('OrganizationContactPersonName').updateValueAndValidity();

				}
				else {
					this.personalDetailForm.get('custGstNo').setValidators([]);
					this.personalDetailForm.get('OrganizationContactPersonName').setValidators([]);
				}

			});

			this.name_place_holder = "Enter your first name and last name";
			this.personalDetailForm.get('custTitle').setValidators([]);
			this.personalDetailForm.get('custName').setValidators([]);
			this.personalDetailForm.get('custDOBDD').setValidators([]);
			this.personalDetailForm.get('custDOBMM').setValidators([]);
			this.personalDetailForm.get('custDOBYY').setValidators([]);
			this.personalDetailForm.get('panINCOPDD').setValidators([]);
			this.personalDetailForm.get('panINCOPMM').setValidators([]);
			this.personalDetailForm.get('panINCOPYY').setValidators([]);
			if(this.premiumJson.PROVIDER_ID == '8' && this.isOwnerCompanyTitleShow==true)
			{
				// console.log("IDDFCOCO");
				this.personalDetailForm.get('panINCOPDD').setValidators([Validators.required]);
				this.personalDetailForm.get('panINCOPMM').setValidators([Validators.required]);
				this.personalDetailForm.get('panINCOPYY').setValidators([Validators.required]);
				this.personalDetailForm.get('custName').setValidators([]);
			}

		} else {
			this.isOwnerCompanyTitleShow = false;
			this.is_owner = flag;
			this.personalDetailForm.get('companyTitle').setValidators([]);
			this.personalDetailForm.get('companyName').setValidators([]);
			this.personalDetailForm.get('OrganizationContactPersonName').setValidators([]);

			// ADD CUST NAME VALIDATION
			this.personalDetailForm.get('custTitle').setValidators([Validators.required]);
			this.personalDetailForm.get('custName').setValidators([Validators.required, Validators.pattern(/^(?=.*[a-zA-Z].*)([a-zA-Z\s]*)$/)]);

			// ADD DOB VALIDATION
			this.personalDetailForm.get('custDOBDD').setValidators([Validators.required]);
			this.personalDetailForm.get('custDOBMM').setValidators([Validators.required]);
			this.personalDetailForm.get('custDOBYY').setValidators([Validators.required]);

			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
			});
		}
		this.personalDetailForm.get('companyTitle').updateValueAndValidity();
		this.personalDetailForm.get('companyName').updateValueAndValidity();
		this.personalDetailForm.get('OrganizationContactPersonName').updateValueAndValidity();

		this.personalDetailForm.get('custDOBDD').updateValueAndValidity();
		this.personalDetailForm.get('custDOBMM').updateValueAndValidity();
		this.personalDetailForm.get('custDOBYY').updateValueAndValidity();

		this.personalDetailForm.get('custTitle').updateValueAndValidity();
		this.personalDetailForm.get('custName').updateValueAndValidity();
	}


	getHypoMagmaJson(provider = '') {
		this.apiService.getMagmaHypoJson(provider).subscribe(data => {
			let resData = JSON.parse(JSON.stringify(data));
			this.MagmahypoJson = resData;
			var totalRTOListFilter = [];
			var output: any;

			output = { "id": 0, "name": "Select RTO (e.g. MH02)" };
			totalRTOListFilter.push(output);
			resData.forEach(el => {
				output = { "id": el.id, "insurer_code": el.insurer_code, "insurer_name": el.insurer_name };
				totalRTOListFilter.push(output);
			});
			this.totalMagmaHypoList = totalRTOListFilter;
		});
	}

	getCity(id) {
		var filter_city = [];
		this.cityJson.forEach(el => {
			if (el.state_id == id) {
				filter_city.push(el);
			}
		});
		this.filtercityJson = filter_city;
	}
	cityChanged(event) {
		let target = event.source.selected._element.nativeElement;
		this.custCityLabel = target.innerText.trim();
		this.addressDetailForm.get('custCityLabel').setValue(target.innerText.trim());
	}
	checkLength(value, l) {
		if (value.length == l && l == 6) {

			let pinCode = value;
			let pincodeData;
			this.apiService.pinCodeCheck(pinCode, this.PROVIDER_ID).subscribe(data => {

				pincodeData = data;
				if (pincodeData.success == false) {
					//this.openSnackBar(pincodeData.message, '');
					this.pincodeValid = true;

				} else {
					this.pincodeValid = false;
				}


			});
		}
		if (value.length > l && l == 6) {
			this.addressDetailForm.get('custPincode').setValue(parseInt(value.substring(0, l)));
		}
		if (value.length > l && l == 2) {
			this.nomineeDetailForm.get('nomineeAge').setValue(parseInt(value.substring(0, l)));
		}
	}
	configureProposalFormData() {
		this.registerForm.value.addressDetailForm.custAddress = this.registerForm.value.addressDetailForm.custAddress.replace(/  +/g, ' ');
		this.registerForm.value.addressDetailForm.custAddress = this.registerForm.value.addressDetailForm.custAddress.replace(/[\n\r\t]/g, ' ');
		let cust_name = this.registerForm.value.personalDetailForm.custName;
		//cust_name = cust_name.trim();
		if (!/\s/g.test(cust_name)) {
			if (this.premiumJson.PROVIDER_ID == '6') {
				cust_name = cust_name.slice(0, 1) + " " + cust_name.slice(1);
			}
			if (this.premiumJson.PROVIDER_ID == '12') {
				cust_name = cust_name.slice(0, 1) + " " + cust_name.slice(1);
			}
		}
		this.registerForm.value.personalDetailForm.custName = cust_name;

		// UPDATE STEP WISE PROPOSAL DATA
		this.proposalJson = this.registerForm.value;
		this.localStorage.setItem('proposalJson', this.proposalJson).subscribe(() => {
			this.saveJourneyData();
		});
	}
	personalDetailSubmit(i:any) {
		this.personalDetailSubmitted = false;
		if (this.personalDetailForm.invalid) {

			return;
		}
		else if (this.showCustDobError) {
    //   console.log('this.showCustDobError==>',this.showCustDobError)
			return;
		}
		else {
			this.personalDetailComplete = true;
			this.configureProposalFormData();
			this.quoteJson.cust_phone = this.personalDetailForm.get('custPhone').value;
			this.quoteJson.cust_email = this.personalDetailForm.get('custEmail').value;
			this.localStorage.setItem('quoteJson', this.quoteJson).subscribe((data) => { });
			this.personalDetailSubmitted = true;
			this.activecarDetail()
			this.nextStep();
		}
	}
	carDetailSubmit() {
		console.log(this.carDetailForm,123)
		this.carDetailSubmitted = false;
		if (this.carDetailForm.invalid) {
			return;
		}
		else {
			this.carDetailComplete = true
			this.configureProposalFormData();
			this.carDetailSubmitted = true;
			this.activeaddressDetail() 
			this.nextStep();
		}
	}
	addressDetailSubmit() {
		this.addressDetailSubmitted = false;
		if (this.addressDetailForm.invalid) {
			return;
		}
		else {
			if (this.pincodeValid == true) {
				return;
			} else {
				this.addressDetailComplete = true
				this.configureProposalFormData();
				this.activenomineeDetail() 
				this.addressDetailSubmitted = true;
				if (this.quoteJson.pa_owner <= 0
					&& this.premiumJson.PROVIDER_ID == 6) {

					this.nomineeDetailSubmit();
				} else {
					this.nextStep();
				}
			}
		}
	}
	nomineeDetailSubmit() {

		if (this.nomineeDetailForm.invalid) {
			return;
		}
		else {
			/* this.nomineeDetailSubmitted = true;
			this.localStorage.setItem('proposalJson', this.registerForm.value).subscribe(() => {
			  this.router.navigate(['/proposal-confirmation']);
			}) */
			this.configureProposalFormData();

			let newDD = this.nomineeDetailForm.get('nomineeDOBDD').value;
			let newMM = this.nomineeDetailForm.get('nomineeDOBMM').value;
			let newYY = this.nomineeDetailForm.get('nomineeDOBYY').value;
			let selDOB = new Date(`${newYY}-${newMM}-${newDD}`);
			let cur_date = new Date();

			if (selDOB.getTime() > cur_date.getTime()) {
				this.agediffDobError = true;
			}
			else {
				this.agediffDobError = false;
				dht('GIBL_PROPOSAL_SUBMIT', this.registerForm.value);
				this.nomineeDetailSubmitted = true;
				this.localStorage.setItem('proposalJson', this.registerForm.value).subscribe(() => {
					this.navigateURL('proposal-confirmation');
				});
			}
		}
	}

	getDayByMonthAndYear(custyear, custmonth, custDay) {
		let changeDay: number = new Date(custyear, custmonth, 0).getDate();
		this.totalDay = changeDay;
		if (custDay > changeDay) {
			this.personalDetailForm.get('custDOBDD').setValue(changeDay.toString());
		}
		this.getnerateDateList();
	}

	checkAgeRestriction() {

		let newDD = this.personalDetailForm.get('custDOBDD').value;
		let newMM = this.personalDetailForm.get('custDOBMM').value;
		let newYY = this.personalDetailForm.get('custDOBYY').value;
    	let custDocType=this.personalDetailForm.get('custDocType').value;
    	let custOtherDoc=this.personalDetailForm.get('custOtherDoc').value;
		let selDOB = new Date(`${newYY}-${newMM}-${newDD}`);
		let timeDiff = Math.abs(Date.now() - selDOB.getTime());
		let custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
		// console.log('custDocType'+custDocType);
		// console.log('custDocType'+custDocType);
    if ((custAge < 18) && (["CIN","Corporate Pan Card"].indexOf(custDocType)<0)) {
      this.showCustDobError = true;
      this.errorCustDobmsg = " (Minimum age should be 18)";
		}
		else {
			this.showCustDobError = false;
		}
	}

	checkNomineeAgeRestriction() {
		let newDD = this.nomineeDetailForm.get('nomineeDOBDD').value;
		let newMM = this.nomineeDetailForm.get('nomineeDOBMM').value;
		let newYY = this.nomineeDetailForm.get('nomineeDOBYY').value;
		let selDOB = new Date(`${newYY}-${newMM}-${newDD}`);
		let timeDiff = Math.abs(Date.now() - selDOB.getTime());
		let custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
		//let current_month =  now.getMonth()+1;

		if (custAge < 18) {
			this.showNomineeDobError = true;
			//this.errorCustDobmsg = " (Minimum age should be 18)";
			this.nomineeDetailForm.get('appointeeName').setValidators([Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)+$/)]);
			this.nomineeDetailForm.get('appointeeRelation').setValidators([Validators.required]);
			this.nomineeDetailForm.get('appointeeDOBDD').setValidators([Validators.required]);
			this.nomineeDetailForm.get('appointeeDOBMM').setValidators([Validators.required]);
			this.nomineeDetailForm.get('appointeeDOBYY').setValidators([Validators.required]);
		}
		else {
			this.showNomineeDobError = false;

			this.nomineeDetailForm.get('appointeeName').setValidators([]);
			this.nomineeDetailForm.get('appointeeName').updateValueAndValidity();

			this.nomineeDetailForm.get('appointeeRelation').setValidators([]);
			this.nomineeDetailForm.get('appointeeRelation').updateValueAndValidity();
			this.nomineeDetailForm.get('appointeeDOBDD').setValidators([]);
			this.nomineeDetailForm.get('appointeeDOBDD').updateValueAndValidity();
			this.nomineeDetailForm.get('appointeeDOBMM').setValidators([]);
			this.nomineeDetailForm.get('appointeeDOBMM').updateValueAndValidity();
			this.nomineeDetailForm.get('appointeeDOBYY').setValidators([]);
			this.nomineeDetailForm.get('appointeeDOBYY').updateValueAndValidity();
		}
	}

	checkAppointeeAgeRestriction() {
		let newDD = this.nomineeDetailForm.get('appointeeDOBDD').value;
		let newMM = this.nomineeDetailForm.get('appointeeDOBMM').value;
		let newYY = this.nomineeDetailForm.get('appointeeDOBYY').value;
		let selDOB = new Date(`${newYY}-${newMM}-${newDD}`);
		let timeDiff = Math.abs(Date.now() - selDOB.getTime());
		let custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

		if (custAge < 18) {
			this.showAppointeeDobError = true;
			this.errorCustDobmsg = " (Minimum age should be 18)";
		}
		else {
			this.showAppointeeDobError = false;
		}
	}

	getMonthAndYear(event) {
		this.checkAgeRestriction();
		let newDD = this.personalDetailForm.get('custDOBDD').value;
		let newMM = this.personalDetailForm.get('custDOBMM').value;
		let newYY = this.personalDetailForm.get('custDOBYY').value;
		this.getDayByMonthAndYear(newYY, newMM, newDD);
	}
	/*----------chandra--------*/

	/*---------- Ruth  --------*/
	getDayByMonthAndYearNominee(nomineeyear, nomineemonth, custDay) {
		this.checkNomineeAgeRestriction();
		let changeDay: number = new Date(nomineeyear, nomineemonth, 0).getDate();
		this.totalDay = changeDay;
		if (custDay > changeDay) {
			this.nomineeDetailForm.get('nomineeDOBDD').setValue(changeDay.toString());

		}
		this.getnerateDateListNominee();

	}

	getDayByMonthAndYearAppointee(nomineeyear, nomineemonth, custDay) {
		this.checkAppointeeAgeRestriction();
		let changeDay: number = new Date(nomineeyear, nomineemonth, 0).getDate();
		this.totalDay = changeDay;
		if (custDay > changeDay) {
			this.nomineeDetailForm.get('appointeeDOBDD').setValue(changeDay.toString());

		}
		this.getnerateDateListAppointee();

	}

	getMonthAndYearNominee(event) {
		let newDD = this.nomineeDetailForm.get('nomineeDOBDD').value;
		let newMM = this.nomineeDetailForm.get('nomineeDOBMM').value;
		let newYY = this.nomineeDetailForm.get('nomineeDOBYY').value;
		this.getDayByMonthAndYearNominee(newYY, newMM, newDD);
	}

	getMonthAndYearAppointee(event) {
		let newDD = this.nomineeDetailForm.get('appointeeDOBDD').value;
		let newMM = this.nomineeDetailForm.get('appointeeDOBMM').value;
		let newYY = this.nomineeDetailForm.get('appointeeDOBYY').value;
		this.getDayByMonthAndYearAppointee(newYY, newMM, newDD);
	}

	track_button(buttonClassname) {
		let userTrackData = {
			"unique_id": this.quoteJson.uniqueID,
			"quote_id": this.quoteJson.quoteID,
			"page_id": "4",
			"btn_id": buttonClassname,
			"serviceUrl": ""
		};
		this.apiService.track_button(userTrackData).subscribe(data => {
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
	redirectTo(urlPath: any) {
		if (this.affiliateParam != '') {
			//this.router.navigate(['/'+this.affiliateParam+'/proposal-confirmation']);
			this.router.navigate([`/${this.affiliateParam}${urlPath}`]);
		} else {
			this.router.navigate([`${urlPath}`]);
		}
	}
	supportLink() {
		window.location.href = this.apiService.getDomainURL()+"contact-us/";
	}
	
	activepersonalDetail() {
		this.personalDetailTab = true;
		this.carDetailTab = false;
		this.nomineeDetailTab = false;
		this.addressDetailTab = false;
	}

	activecarDetail() {
		// console.log(this.personalDetailComplete)
		if (this.personalDetailComplete) {
			this.personalDetailTab = false;
			this.carDetailTab = true;
			this.nomineeDetailTab = false;
			this.addressDetailTab = false;
		}
	}
	activeaddressDetail() {
		if (this.carDetailComplete) {
			this.personalDetailTab = false;
			this.carDetailTab = false;
			this.nomineeDetailTab = false;
			this.addressDetailTab = true;
		}
	}

	activenomineeDetail() {
		if (this.addressDetailComplete) {
			this.personalDetailTab = false;
			this.carDetailTab = false;
			this.nomineeDetailTab = true;
			this.addressDetailTab = false;
		}
	}
	
	backTopersonalDetail(){
		this.personalDetailComplete = false
		this.activepersonalDetail();
		this.previousStep();
	}
	backToCarDetail(){
		this.carDetailComplete =false;
		this.activecarDetail();
		this.previousStep();
	}
	backToAddress(){
		this.addressDetailComplete=false;
		this.activeaddressDetail();
		this.previousStep();
	}
}