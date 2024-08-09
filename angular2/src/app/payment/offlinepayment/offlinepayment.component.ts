import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from '../../service/app.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { $ } from 'protractor';

@Component({
	selector: 'app-offlinepayment',
	templateUrl: './offlinepayment.component.html',
	styleUrls: ['./offlinepayment.component.scss', '../../../assets/tpOffline/css/main.css']
})
export class OfflinepaymentComponent implements OnInit {
	policyDcoumentForm: FormGroup;
	providerId: any = "";
	transactionStatus: any = "";
	transactionMsg: any = "";
	policyDownloadURL: any = "";
	policyNo: any = "NA";
	transactionNo: any = "";
	proposalNo: any = "";
	paymentMethod: any = "";
	orderStatus: any = "";
	productCode: any = "";
	premiumJson: any;
	proposalJson: any;
	paymentJson: any;
	quoteJson:any;
	commisionJson:any;
	expiredpolicy: boolean = false;
	showPremiumdata: boolean = false;
	COMPANY_LOGO = '';
	COMPANY_NAME = '';
	OWNER_NAME = '';
	APIURL: string = "";
	TOTAL_PREMIUM: any = 0.0;
	paymentStatus = 0;
	showPaymentTable = true;
	uploadedFiles: Array<File>;
	public formData = new FormData();
	userCode:any;
	parent_user_code:any;
	user_code:any;
	quoteId:any;
	loading=false;
	public dialogRef: any;
	skvp_message='';
	documentDiv = true;
	BASEURL:any;
	thirdParty=false;
	userJson:any;
	IS_LIVE: any;

	uiStyle:any;
	isSponsored:boolean=false;
	logo:string='assets/quote/img/logo.png';

	@ViewChild('navBar', {static: false}) navBar:ElementRef;

	constructor(public dialog: MatDialog,
	private route: ActivatedRoute,
	public apiService: AppService,
	protected localStorage: LocalStorage,
	public fb: FormBuilder, ) {
		this.APIURL = this.apiService.getPhpServiceURL();
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
		this.BASEURL=this.apiService.getBaseURL();
		this.policyDcoumentForm = this.fb.group({
			doc1: ['',Validators.required],
			doc2: ['',Validators.required],
			doc3: ['',Validators.required]
		});
		this.getPremiumJson();
		this.IS_LIVE  = this.apiService.getIsLIVE();
		this.localStorage.getItem('quoteJson').subscribe((data:any) => {
			this.quoteId=data.quoteID;
			this.quoteJson=data;
			let quoteID=this.quoteJson.quoteID;
			if(this.IS_LIVE==2)
			{
				this.commisionJson = {'quoteid':quoteID,'serviceUrl':"https://www.gibl.in/wallet/api/vle-commission.php?quoteid="+quoteID};

				this.apiService.updatePayment(this.commisionJson).subscribe(data => {
					let resData=data;
				});
				this.commisionJson = {'quoteid':quoteID,'serviceUrl':"https://crm.gibl.in/policywise-pos-payout.php?quoteid="+quoteID};

				this.apiService.updatePayment(this.commisionJson).subscribe(data => {
					let resData=data;
				});
			}
		});
		this.localStorage.getItem('userJson').subscribe((data:any) => {
			this.userJson	=data;
			this.userCode=data.user_code;
			this.parent_user_code=data.parent_user_code;
			this.user_code=data.user_code;
			console.log(this.userCode);
			this.updateWalletbalance();
		});
	}

	updateWalletbalance(){
		this.apiService.callPHPWalletService(this.userJson).subscribe(data => {
			if( data != null && data!='' ){
				let wallet_response	=(data);
				this.userJson.wallet_balance	=wallet_response.wallet_balance;

				this.localStorage.setItem('userJson', this.userJson).subscribe(() => {});
			}
			console.log('response===>',this.userJson);
		},
		(error) =>{
			console.log('error===>',error);
		});
	}

	homepage(){
		//alert('hi')
		window.location.href=this.BASEURL;
	}
	uploadPrevPolicycopy(file) {
		this.formData.append("prev_pol_no", file[0], file[0]['name']);
	}
	uploadRCcopyFront(file) {
		this.formData.append("rc_copy_front", file[0], file[0]['name']);
	}
	uploadRCcopyBack(file) {
		this.formData.append("rc_copy_back", file[0], file[0]['name']);
	}
	uploadPolicyDocSubmit() {
		this.onNoClick();
		if (this.policyDcoumentForm.invalid) {
			return;
		}
		else {
			this.formData.append('userCode',this.userCode);
			this.formData.append('quoteId',this.quoteId);
			this.formData.append('response_track_id',this.proposalNo);
			this.formData.append('for','OFFLINE');


			this.loading=true;
			this.apiService.motor_policy_upload(this.formData).subscribe(data => {
				var res:any=data;

				if(res.status){
					this.loading=false;
					this.documentDiv=false;
					//$('.document_upload').hide();
					//this.showPaymentTable=true;
				}
			});
		}
	}
	getPremiumJson() {
		this.localStorage.getItem('quoteJson').subscribe((data) => {
			this.quoteJson = data;
			this.thirdParty=this.quoteJson.isThirdParty;
			var expirydate = this.quoteJson.pre_policy_expiry_date.month+"/"+this.quoteJson.pre_policy_expiry_date.day+"/"+this.quoteJson.pre_policy_expiry_date.year;

			var d = new Date();
			var currentdate = new Date(d.getMonth()+1+"/"+d.getDate()+"/"+d.getFullYear());
			console.log(currentdate);
			let expirydateobj = new Date(expirydate);
			console.log(expirydateobj);
			if (currentdate>expirydateobj)
			{
				this.expiredpolicy = true;

			}

		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumJson = data;
			console.log('getPremiumJson',this.premiumJson.SKVP)
			this.TOTAL_PREMIUM = this.premiumJson.TOTAL_PREMIUM;
			this.COMPANY_LOGO = this.premiumJson.COMPANY_LOGO;
			this.COMPANY_NAME = this.premiumJson.COMPANY_NAME;
			this.showPremiumdata = true;
			this.route.params.subscribe(params => {
				this.providerId = params.id;
				this.offlinePaymentProcess();
			});
			if(this.premiumJson.SKVP == true){
				this.skvp_message = 'Thank You For Paying Through SKVPAY';

				console.log('skvp_message',this.skvp_message)
			}
		});
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson = data;
			this.OWNER_NAME = this.proposalJson.personalDetailForm.custTitle + ' ' + this.proposalJson.personalDetailForm.custName;
		});
	}
	offlinePaymentProcess() {
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.transactionNo = queryArr[0];
			this.proposalNo = queryArr[2]; //Or, Order No
			this.paymentStatus = queryArr[3];
			this.paymentMethod = queryArr[1];
			this.policyNo = queryArr[4];
			if(this.providerId==2 && this.policyNo && this.policyNo!='')
			{
				this.policyDownloadURL = this.APIURL+"bajaj_policy_copy.php?PolicyNumber="+this.policyNo;
			}

			if(this.providerId==29 && this.policyNo && this.policyNo!='')
			{
				this.policyDownloadURL = this.APIURL+"digit_policy_copy.php?PolicyNumber="+this.policyNo;
				this.documentDiv = false;
			}
			if(this.providerId==28 && this.policyNo && this.policyNo!='')
			{
				this.policyDownloadURL = this.APIURL+"kotak_policy_copy.php?PolicyNumber="+this.policyNo;
				this.documentDiv = false;
			}
			if(this.providerId==12 && this.policyNo && this.policyNo!='')
			{
				this.policyDownloadURL = this.APIURL+"reliance_policy_copy.php?PolicyNumber="+this.policyNo;
				this.documentDiv = false;
			}

			console.log('pay', this.paymentMethod)
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;

			})
			if(this.paymentStatus ==1){

					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"7",
						"created_by":this.quoteJson.source_user,

						};

						this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment success confirmation',data);
						});

			}else{

					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"8",
						"created_by":this.quoteJson.source_user,

						};

						this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment failed confirmation',data);
						});

			}
			if (this.paymentMethod == 'WALLET OFFLINE') {
				this.showPaymentTable = false;
			}
		});



	}
	onNoClick() {
		this.dialogRef.close();
	}
	openDialog(content): void {

		//this.dialogRef.updatePosition({ top: '50px' });
		this.dialogRef = this.dialog.open(content, {
			width: '200px',
			//height: '90%'
		});
		this.dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog was closed');
		});
	}

}
