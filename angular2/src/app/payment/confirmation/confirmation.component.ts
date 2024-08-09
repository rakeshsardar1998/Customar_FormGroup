import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from '../../service/app.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-confirmation',
	templateUrl: './confirmation.component.html',
	styleUrls: ['./confirmation.component.scss', '../../../assets/tpOffline/css/main.css']
})
export class ConfirmationComponent implements OnInit {

	providerId: any = "";
	transactionStatus: any = "";
	transactionMsg: any = "";
	applicatioId:any = "";

	policyNo: any = "";
	agent_code:any;
	transactionNo: any = "";
	proposalNo: any = "";
	paymentMethod: any = "";
	orderStatus: any = "";
	productCode: any = "";
	parent_user_code: any = "";
	user_code: any = "";
	bhartiPolicyPdf: any	="";
	premiumData: any;
	premiumJson: any;
	paymentJson: any;
	quoteJson: any;
	userJson: any;
	commisionJson: any;
	showPremiumdata: boolean = false;
	paymentStatus: any;
	skvp_message='';
	//APIURL: string = "http://192.168.7.124/gibl-php/tw-services/";
	loading = false;
	proposalJson: any;
	custId: any = "";
	paymentId: any ="";
	COMPANY_LOGO = '';
	COMPANY_NAME = '';
	OWNER_NAME = '';
	APIURL: string = "";
	NODE_URL: string = "";
	PREMIUM_PHP_SERVICE_URL: string = "";
	TOTAL_PREMIUM: any = 0.0;
	downloadPolicyURL = '';
	BASEURL:any;
	randKey:any;
	IS_LIVE: any;

	uiStyle:any;
	isSponsored:boolean=false;
	logo:string='assets/quote/img/logo.png';
	@ViewChild('navBar', {static: false}) navBar:ElementRef;

	policyDownloadLoader:boolean	=false;

	constructor(private route: ActivatedRoute,
	public apiService: AppService,
	private _snackBar: MatSnackBar,
	protected localStorage: LocalStorage) { }
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
		this.getPremiumJson();
		this.BASEURL=this.apiService.getBaseURL();
		this.NODE_URL=this.apiService.getNodeURL();
		this.PREMIUM_PHP_SERVICE_URL = this.apiService.getPhpURL();
		this.IS_LIVE  = this.apiService.getIsLIVE();

		this.localStorage.getItem('quoteJson').subscribe((data) => {
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



		this.route.params.subscribe(params => {
			this.productCode = 2347;
			this.providerId = params.id;

			if (this.providerId == "12") {
				this.reliancePaymentProcess();
			}
			if (this.providerId == "6") {
				console.log('hdfc providerId',this.providerId)
				this.hdfcPaymentProcess();
			}
			if(this.providerId == "2"){
				console.log('bajaj providerId',this.providerId)
				this.bajajPaymentProcess();
			}
			if(this.providerId == "3"){
				console.log('bharti providerId',this.providerId)
				this.bhartiPaymentProcess();
			}
			if(this.providerId == "28"){
				console.log('kotak providerId',this.providerId)
				this.kotakPaymentProcess();
			}
			if(this.providerId == "17"){
				console.log('kotak providerId',this.providerId)
				this.tataPaymentProcess();
			}
			if(this.providerId == "5"){
				console.log('tata providerId',this.providerId)
				this.futurePaymentProcess();
			}
			if(this.providerId == "16"){
				console.log('sompo providerId',this.providerId)
				this.sompoPaymentProcess();
			}
			if(this.providerId == "21"){
				console.log('magma providerId',this.providerId)
				this.magmaPaymentProcess();
			}
			if(this.providerId == "10"){
				console.log('national providerId',this.providerId)
				this.nationalPaymentProcess();
			}
			if(this.providerId == "18"){
				console.log('newindia providerId',this.providerId)
				this.newindiaPaymentProcess();
			}
			if(this.providerId == "37"){
				this.dhflPaymentProcess();
			}
			if(this.providerId == "29"){
				this.digitPaymentProcess();
			}
			if(this.providerId == "7"){
				console.log('ICICI providerId',this.providerId)
				this.iciciPaymentProcess();
			}
			if(this.providerId == "4"){
				console.log('chola providerId',this.providerId)
				this.cholaPaymentProcess();
			}
			if(this.providerId == "8"){
				console.log('iffco providerId',this.providerId)
				this.iffcoPaymentProcess();
			}
		});

	}

	getPremiumJson() {
		this.localStorage.getItem('userJson').subscribe((data) => {
			this.userJson = data;
			this.parent_user_code = this.userJson!=null?this.userJson.parent_user_code:0;
			this.user_code =  this.userJson!=null?this.userJson.user_code:0;;
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumJson = data;
			this.TOTAL_PREMIUM = this.premiumJson.TOTAL_PREMIUM;
			this.COMPANY_LOGO = this.premiumJson.COMPANY_LOGO;
			this.COMPANY_NAME = this.premiumJson.COMPANY_NAME;
			this.showPremiumdata = true;
			this.route.params.subscribe(params => {
				this.providerId = params.id;
			});
		});
		this.localStorage.getItem('proposalJson').subscribe((data) => {
			this.proposalJson = data;
			this.OWNER_NAME = this.proposalJson.personalDetailForm.custTitle + ' ' + this.proposalJson.personalDetailForm.custName;
		});
	}

	homepage(){
		window.location.href=this.BASEURL;
	}

	hdfcPaymentProcess() {
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("dsasafcd", queryParms)
			let queryArr = queryParms.split("|");
			console.log('queryArr',queryArr);

			this.paymentStatus = queryArr[0];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[6];
			this.policyNo = queryArr[1];
			this.transactionNo = queryArr[3];
			//this.paymentStatus = queryArr[4];
			this.proposalNo = queryArr[5];

			console.log('gdfgdgfd',this.paymentStatus)
			if (this.transactionStatus == "0") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}

			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else{
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
			})
		});

		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumData = data;
			console.log("premium data", this.premiumData)
			this.agent_code = this.premiumData.AGENTCODE;
		});
	}

	kotakPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("kotak payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];

			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[6];
			this.policyNo = queryArr[1];
			//this.transactionNo = queryArr[3];
			this.paymentMethod = queryArr[4];
			//this.proposalNo = queryArr[3];

			if(queryArr[3] == 'null'){
				console.log('transactionNo',queryArr[3])
				this.transactionNo = 'NA';
			}else{
				this.transactionNo = queryArr[3];
			}

			if (this.transactionStatus == "0") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				if(this.paymentStatus ==1){
					console.log('gdfgdgfd',this.quoteJson);
					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"7",
						"created_by":this.quoteJson.source_user,
					};
					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment success confirmation',data);
					});
				}
				else
				{
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
			});
		});
	}

	bajajPaymentProcess(){

		this.localStorage.getItem('quoteJson').subscribe((data:any) => {
			this.quoteJson=data;
			console.log('bajaj quotjson',this.quoteJson);
			this.route.queryParams.subscribe(params => {
				this.policyNo =  params.p_policy_ref;
			this.proposalNo = params.order_id;
			this.transactionNo = params.response_track_id;
			this.paymentStatus=(params.vg_payStatus == 'Y')? 1:0;
				if (this.transactionStatus == "0") {
					this.orderStatus = "1";
				}
				else {
					this.orderStatus = "2";
				}
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
				}
				else{
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
			});
		});

		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumData = data;
			console.log("premium data", this.premiumData);
		});
	}

	tataPaymentProcess(){
		this.localStorage.getItem('quoteJson').subscribe((data:any) => {
			this.quoteJson=data;
			//console.log(this.quoteJson);
			console.log('tata quotjson',this.quoteJson);
			this.route.queryParams.subscribe(params => {
				let queryParms = params.Output;
				let queryParms2 = params.id;

				console.log("tata", queryParms)
				let queryArr = queryParms.split("|");
				console.log(queryArr);
				this.paymentStatus = queryArr[0];

				this.transactionStatus = queryArr[2];
				this.transactionMsg = queryArr[6];
				this.policyNo = queryArr[1];
				this.transactionNo = queryArr[3];
				this.randKey = queryArr[4];
				this.proposalNo = queryArr[5];
				console.log('gdfgdgfd',this.paymentStatus)
				if (this.transactionStatus == "0") {
					this.orderStatus = "1";
				}
				else {
					this.orderStatus = "2";
				}
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
			});
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumData = data;
			console.log("premium data", this.premiumData);
		});
	}

	sompoPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("future payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5];
			this.downloadPolicyURL = queryArr[6];

			if (this.transactionStatus == "Success") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else
				{
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
			})
		});
	}

	nationalPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("National payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5];
			//this.downloadPolicyURL = queryArr[6];

			if (this.transactionStatus == "Success") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else
				{
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
			})
		});
	}
	cholaPaymentProcess()
	{
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");

			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5];
			//console.log(this.transactionMsg);
			//return;
			if (this.transactionMsg == "Success") {
				this.paymentStatus = "1";
			}
			else {
				this.paymentStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else
				{
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
			})
			//this.policyDownloadURL = this.APIURL+"chola_policy_copy.php?PolicyNo="+this.proposalNo;
		});
	}
	iffcoPaymentProcess()
	{
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryArr = queryParms.split("|");

			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5];
			//console.log('QQQQ',this.paymentStatus);
			//return;
			if (this.transactionMsg == "Success") {
				this.paymentStatus = "1";
			}
			else {
				this.paymentStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else
				{
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
			})
			//this.policyDownloadURL = this.APIURL+"chola_policy_copy.php?PolicyNo="+this.proposalNo;
		});
	}


	magmaPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("magma payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionNo = queryArr[3];
			this.paymentId = queryArr[4];
			this.custId = queryArr[5];
			this.proposalNo = queryArr[6];

			if (this.transactionStatus == "Success") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else
				{
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
			})
		});
	}

	newindiaPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			//console.log("future payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5];
			this.downloadPolicyURL = queryArr[6];

			if (this.transactionStatus == "Success") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else
				{
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
			});
		});
	}

	futurePaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			//console.log("future payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.proposalNo = queryArr[2];
			this.transactionStatus = queryArr[3];
			this.transactionMsg = queryArr[4];
			this.transactionNo = queryArr[5];

			if (this.transactionStatus == "Success") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				if(this.paymentStatus ==1){
					console.log('gdfgdgfd',this.quoteJson);
					let userTrackData={
					"unique_id":this.quoteJson.uniqueID,
					"quote_id":this.quoteJson.quoteID,
					"page_id":"7",
					"created_by":this.quoteJson.source_user,
					};
					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment success confirmation',data);
					});
				}
				else
				{
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
			});
		});
	}

	bhartiPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("bharti payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5]; //order ID
			this.bhartiPolicyPdf = queryArr[6]; //policy pdf name

			if (this.transactionStatus == "Success")
			{
				this.orderStatus = "1";
			}
			else
			{
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				if(this.paymentStatus ==1){
					console.log('gdfgdgfd',this.quoteJson);
					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"7",
						"created_by":this.quoteJson.source_user,
					};
					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment success confirmation',data);
					});
				}
				else
				{
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
			})
		});
	}
	iciciPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("ICICI payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			// $status."|".$policy_number."|".$customerID."|".$response_track_id."|".$cor_id."|".$order_id
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.custId = queryArr[2];
			this.transactionMsg = queryArr[3];
			this.transactionNo = queryArr[4];
			this.proposalNo = queryArr[5]; //order ID


			if (this.transactionStatus == "Success")
			{
				this.orderStatus = "1";
			}
			else
			{
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				if(this.paymentStatus ==1){
					console.log('gdfgdgfd',this.quoteJson);
					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"7",
						"created_by":this.quoteJson.source_user,
					};
					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment success confirmation',data);
					});
				}
				else
				{
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
			})
		});
	}

	dhflPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			console.log("kotak payment confirmation", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];

			this.transactionStatus = queryArr[2];
			this.transactionMsg = queryArr[6];
			this.policyNo = queryArr[1];
			//this.transactionNo = queryArr[3];
			this.paymentMethod = queryArr[4];
			this.proposalNo = queryArr[3];

			if(queryArr[3] == 'null'){
				console.log('transactionNo',queryArr[3])
				this.transactionNo = 'NA';
			}else{
				this.transactionNo = queryArr[3];
			}

			if (this.transactionStatus == "0") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
				if(this.paymentStatus ==1){
					console.log('gdfgdgfd',this.quoteJson);
					let userTrackData={
					"unique_id":this.quoteJson.uniqueID,
					"quote_id":this.quoteJson.quoteID,
					"page_id":"7",
					"created_by":this.quoteJson.source_user,
					};
					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data payment success confirmation',data);
					});
				}
				else
				{
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
			});
		});
	}

	digitPaymentProcess(){
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			let queryParms2 = params.id;

			//console.log("dsasafcd", queryParms)
			let queryArr = queryParms.split("|");

			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionStatus = queryArr[2];
			this.transactionNo = queryArr[3];
			this.paymentMethod = queryArr[4];
			this.transactionMsg = queryArr[6];
      this.applicatioId = queryArr[7];


			this.proposalNo = queryArr[3];

			console.log('gdfgdgfd',this.paymentMethod)
			if (this.transactionStatus == "0") {
				this.orderStatus = "1";
			}
			else {
				this.orderStatus = "2";
			}

			this.localStorage.getItem('quoteJson').subscribe((data) => {
				this.quoteJson = data;
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
				}
				else{
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
			});
		});

		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumData = data;
			console.log("premium data", this.premiumData)
			this.agent_code = this.premiumData.AGENTCODE;
		});
	}

	reliancePaymentProcess() {
		this.route.queryParams.subscribe(params => {
			let queryParms = params.Output;
			console.log("dsasafcd", queryParms)
			let queryArr = queryParms.split("|");
			console.log(queryArr);
			this.paymentStatus = queryArr[0];
			this.policyNo = queryArr[1];
			this.transactionNo = queryArr[2];
			this.transactionStatus = queryArr[3];
			this.paymentMethod = queryArr[4];
			this.proposalNo = queryArr[5];
			this.transactionMsg = queryArr[6];


			if (this.transactionStatus == "0") {
				this.orderStatus = "1";

				this.localStorage.getItem('quoteJson').subscribe((data) => {
					this.quoteJson = data;
					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"7",
						"created_by":this.quoteJson.source_user,
					};

					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data proposal confirmation',data);
					});
				});
			}
			else {
				this.orderStatus = "2";
				this.localStorage.getItem('quoteJson').subscribe((data) => {
					this.quoteJson = data;
					let userTrackData={
						"unique_id":this.quoteJson.uniqueID,
						"quote_id":this.quoteJson.quoteID,
						"page_id":"8",
						"created_by":this.quoteJson.source_user,
					};

					this.apiService.TrackUserSubmit(userTrackData).subscribe(data => {
						console.log('Tracking data proposal confirmation',data);
					});
				});
			}

			this.downloadPolicyURL = "http://rzonews.reliancegeneral.co.in/API/Service/GeneratePolicyschedule?PolicyNo=" + this.policyNo + "&ProductCode=" + this.productCode;
		});
		this.localStorage.getItem('premiumJson').subscribe((data) => {
			this.premiumData = data;
			console.log("premium data", this.premiumData)
			this.productCode = this.premiumData.PRODUCT_CODE;
			console.log("product code", this.productCode);
		});
	}

	downloadPolicy(providerId) {
    console.log('providerId'+providerId);

		this.policyDownloadLoader	=true;
		if (providerId == 6) {
			let data = {
				"transaction_no": this.transactionNo,
				"policy_no": this.policyNo,
				"agent_code":this.agent_code
			}

			this.apiService.download_policy(data).subscribe(data => {
				this.policyDownloadLoader	=false;
				this.showPdf(data);
			});
		}
		if(providerId == 2){
			let pdata= {
				"policy_no": this.policyNo
			}
			window.location.href=this.PREMIUM_PHP_SERVICE_URL+'/bajaj_policy_copy.php?&PolicyNumber='+this.policyNo;
			this.policyDownloadLoader	=false;

			// this.apiService.bajaj_downloadPolicy(pdata).subscribe((data:any)=>{
			// 	if(data != 'Error'){
			// 		this.showPdf(data);
			// 	}else {
			// 		this.openSnackBar('Some error occured', '');
			// 		this.policyDownloadLoader	=false;
			// 	}
			// });
		}

		if(providerId == 28)
		{
			//console.log('@@@'+this.PREMIUM_PHP_SERVICE_URL+"kotak_policy_pdf_generate.php?ProposalNumber="+this.transactionNo+"&PolicyNumber="+this.policyNo);
			//window.location.href= this.NODE_URL+"kotakpolicyDownload?proposal_no="+this.transactionNo+"&policy_no="+this.policyNo;
			window.location.href= this.PREMIUM_PHP_SERVICE_URL+"kotak_policy_pdf_generate.php?ProposalNumber="+this.transactionNo+"&PolicyNumber="+this.policyNo;
			this.policyDownloadLoader	=false;
		}
		if(providerId == 17)
		{
			//window.location.href ='https://pipuat.tataaiginsurance.in/tagichubws/motor_policy.jsp?polno='+this.policyNo+'&src=app&key='+this.randKey;

			window.location.href ='https://inode.tataaig.com/tagicinodews/motor_policy.jsp?polno='+this.policyNo+'&src=app&key='+this.randKey;
		}
		if(providerId == 12)
		{
			window.location.href ='http://rzonews.reliancegeneral.co.in/API/Service/GeneratePolicyschedule?PolicyNo='+this.policyNo+'&ProductCode=2347';
		}
		if(providerId == 16)
		{
			window.location.href =this.downloadPolicyURL;
		}
		if(providerId == 5)
		{
			window.location.href= this.NODE_URL+"futurepolicyDownload?policy_no="+this.policyNo;
		}
		if(providerId == 29)
		{
      		window.location.href= this.paymentMethod;
			  this.policyDownloadLoader	=false;
        }
		if(providerId == 21)
		{
			window.location.href= this.PREMIUM_PHP_SERVICE_URL+"magma_policy_copy.php?PolicyNo="+this.policyNo+"&TransID="+this.transactionNo+"&CustID="+this.custId+"&ProposalNo="+this.proposalNo;
		}
		if(providerId == 10)
		{
			window.location.href= this.PREMIUM_PHP_SERVICE_URL+"national_policy_copy.php?PolicyNo="+this.policyNo;
			this.policyDownloadLoader	=false;
		}
		if(providerId == 3) // BHARTI
		{
			window.location.href= "https://awpservices.bhartiaxaonline.co.in/home/B2C/birt/reports/reportFiles/"+this.bhartiPolicyPdf;
		}
		if(providerId == 4)
		{
			window.location.href= this.PREMIUM_PHP_SERVICE_URL+"payment/chola/chola_policy_copy.php?PolicyNo="+this.proposalNo;
			this.policyDownloadLoader	=false;
		}
		if(providerId == 7 && this.premiumJson.SERVICE_MODE =='ONLINE')
		{
			console.log(this.PREMIUM_PHP_SERVICE_URL+"payment/chola/icici_policy_copy.php?PolicyNo="+this.policyNo+'&cId='+this.custId+'&corid='+this.transactionNo);
			//return false;
			window.location.href= this.PREMIUM_PHP_SERVICE_URL+"payment/icici/icici_policy_copy.php?PolicyNo="+this.policyNo+'&cId='+this.custId+'&corid='+this.transactionNo;
			this.policyDownloadLoader	=false;
		}
		if(providerId == 8 && this.premiumJson.SERVICE_MODE =='ONLINE')
		{

			window.location.href= this.PREMIUM_PHP_SERVICE_URL+"iffco_policy_copy.php?PolicyNo="+this.policyNo;
			console.log(this.PREMIUM_PHP_SERVICE_URL+"iffco_policy_copy.php?PolicyNo="+this.policyNo);
			this.policyDownloadLoader	=false;


		}

	}

	showPdf(data) {
		const linkSource = 'data:application/pdf;base64,' + data;
		const downloadLink = document.createElement("a");
		const fileName = "Policy_" + this.policyNo + ".pdf";

		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();
	}

}
