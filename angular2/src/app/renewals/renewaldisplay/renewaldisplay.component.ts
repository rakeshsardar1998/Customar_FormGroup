import { Component, OnInit, ViewChild, Inject,ViewEncapsulation } from '@angular/core';
import { FormControl, Validators, FormBuilder,AbstractControl, ValidationErrors , FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { MatTabGroup } from '@angular/material';
import { MatTabChangeEvent } from '@angular/material';
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from '../../service/app.service';
import { DOCUMENT } from '@angular/common';
declare const dht: any;
@Component({
  selector: 'app-proposaldisplay',
  templateUrl: './renewaldisplay.component.html',
  styleUrls: ['./renewaldisplay.component.scss', '../../../assets/proposal/css/main.css'],
  //encapsulation: ViewEncapsulation.Native
})

export class RenewaldisplayComponent implements OnInit {
  @ViewChild('tabs', { static: false }) tabGroup: MatTabGroup;
  // DONE BY ARIT FOR LIVE CHAT
  localWindow:any;
  chatItem: any	={};
  renewalForm: FormGroup;
  progressLoader: boolean = false;
  loginStatus:string;
  submitted:boolean=false;
  selectedIndex: number = 0;
  maxNumberOfTabs: number = 3;
  registerForm: FormGroup;
  personalFormGroup: FormGroup;
  custDOBDD: any[] = [];
  custDOBMM: any[] = [];
  custDOBYY: any[] = [];
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
  PROVIDER_ID ='';
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
  prevInsuErr = false;
  setNationalErr = false;
  setStateErr = false;
  setCityErr = false;
  showCustDobError: boolean = false;
  showNomineeDobError: boolean = false;
  agediffDobError: boolean = false;
  showAppointeeDobError: boolean = false;
  NomineeBool: any;
  errorCustDobmsg:any;
  white_label = 0;
  USERURL = "";
  retailerID:any;
  BASEURL:any;
  APIURL:any;
  totalDay:any = 31;
  pincodeValid = false;

  fakeArray(length: number): Array<any> {
    if (length >= 0) {
      return new Array(length);
    }
  }
  affiliateParam:string	='';

  constructor(private apiService: AppService, private formBuilder: FormBuilder, private localStorage: LocalStorage, private router: Router, private route: ActivatedRoute,@Inject( DOCUMENT ) public document: Document,
	@Inject( DOCUMENT ) public htmlDocument: HTMLDocument) {
	this.localWindow = this.document.defaultView;
    this.USERURL = this.apiService.getUserServiceURL();

  }


  ngOnInit() {
	this.IS_LIVE  = this.apiService.getIsLIVE();
    this.BASEURL=this.apiService.getBaseURL();

	this.renewalForm = new FormGroup({
			prevPolicyNo: new FormControl('', [Validators.required]),
			vehicleNo: new FormControl('', [Validators.required]),
			prevInsurer: new FormControl('', Validators.required)
		});
    this.APIURL = this.apiService.getPhpURL();
    //alert(this.APIURL);
  }

	homepage()
	{
		this.localStorage.getItem('userJson').subscribe((data: any) => {
			if (data != null) {
				if(data.role_type.toString()=="16" || data.role_type.toString()=="8")
				{
					// window.location.href="https://www.gibl.in/UI/Pages/mHome.aspx";
					window.location.href = this.BASEURL + "/UI/Pages/mHome.aspx";
				}
				else
				{
					window.location.href = this.BASEURL;
				}
			}
			else
			{
				window.location.href = this.BASEURL;
			}
		});
	}


	renewal()
	{
		if (this.renewalForm.invalid){
			return;
		}
		this.progressLoader = true;
		this.submitted=true;
		const renewalData = this.renewalForm.value;
		let getquoteJson = {
			"prevPolicyNo": renewalData.prevPolicyNo,
			"vehicleNo": renewalData.vehicleNo,
			"prevInsurer": renewalData.prevInsurer,
			"serviceUrl": ""
		};
		let APIURL = "https://www.gibl.in/php-services/fw-services-uat/";
		getquoteJson.serviceUrl = APIURL + "service.php?action=RENEWAL_CREATE_QUOTE&PROVIDER_ID="+renewalData.prevInsurer+"&PREMIUM_TYPE=1";
		//alert(getquoteJson.serviceUrl);
		const curObj  = this;
		this.apiService.signIn(getquoteJson).subscribe(data => {
			let res:any=data;
			console.log(res);
			let rd=(res);
			if(rd.quote_id>0 && rd.status==1)
			{
				this.router.navigate(['/quote-compare'], { queryParams: { QID: rd.quote_id,ISRENEWAL:'Y'}});
			}
			else
			{
				this.loginStatus = rd.message;
			}

		});
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
	redirectTo(urlPath:any){
		if( this.affiliateParam!='' ){
			//this.router.navigate(['/'+this.affiliateParam+'/proposal-confirmation']);
			this.router.navigate([`/${this.affiliateParam}${urlPath}`]);
		}else{
			this.router.navigate([`${urlPath}`]);
		}
	}
}
