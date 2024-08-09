import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from "@angular/router";
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DOCUMENT } from '@angular/common';

declare var require: any;
const querystring = require('querystring');
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' })
};
@Injectable({
	providedIn: 'root'
})

export class AppService {
	private premiumLoaderCounterRef = 0;
	private premiumLoaderCounterSubject = new BehaviorSubject(this.premiumLoaderCounterRef);
	IS_LIVE = 3; // 0 for local ,1 for old uat and 2 for live, 3 for new uat
	IS_SHOW_CHAT = 0; // FOR LIVE CHAT
	localWindow: any;
	chatItem: any = {};
	affiliateParam: string = '';
	NODE_URL: string = "";
	NODE_URL_FW: string = "";
	NODE_URL_FW_BASE_URL: string = "";
	NODE_URL_FW_NATIONAL: string = "";
	BASEURL: string = "";
	USERAPIURL: string = "";
	APIURL: string = "";
	PREMIUM_PHP_SERVICE_URL = "";
	PREMIUM_PHP_SERVICE_URL_LIVEUAT = "";
	WALLET_UPDATE_SERVICE_URL = "";
	COM_NON_PSU_INSURER_IDS: any = [2, 3, 5, 6, 12, 16, 17, 21, 28, 29];
	COM_PSU_INSURER_IDS: any = [10, 18];
	TP_NON_PSU_INSURER_IDS: any = [2, 5, 6, 12, 29];
	TP_PSU_INSURER_IDS: any = [10];
	B2B_AND_B2C_USER_TYPE = [8, 12, 37];
	affiliateList: any[] = ['dailyhunt'];
	objroute: any;
	bannerData: any = {};
	DOMAIN: string = "";
	POSP_URL ='';
	SHOW_ALL_PREMIUM_FOR_WALLET_PARTNERS: any = [155217];
	CRMDOMAIN: string;

	constructor(
		private httpClient: HttpClient,
		private localStorage: LocalStorage,
		private router: Router,
		private route: ActivatedRoute,
		@Inject(DOCUMENT) public document: Document,
		@Inject(DOCUMENT) public htmlDocument: HTMLDocument
	) {
		this.localWindow = this.document.defaultView;
		if (this.IS_LIVE == 0) {
			// this.NODE_URL = 'http://172.19.5.10:8000/';
			// this.NODE_URL_FW = 'http://uat.gibl.in:8009/cv/fwaction';
			// this.BASEURL = "http://localhost:4200";
			// this.DOMAIN = "http://uatnew.gibl.in/";
			// this.USERAPIURL = "https://www.gibl.in/php-services/user-services/";
			// this.PREMIUM_PHP_SERVICE_URL = "http://uat.gibl.in/fw-services/";
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
			this.NODE_URL = 'http://192.168.7.22:3003/';
			this.NODE_URL_FW_BASE_URL = 'http://192.168.7.22:3003/';
			this.NODE_URL_FW = 'http://192.168.7.22:3003/action/MOTOR/';
			this.BASEURL = "http://192.168.7.22:4201";
			this.DOMAIN = "http://uatnew.gibl.in/";
			this.USERAPIURL = "https://uatnew.gibl.in/php-services/user-services/";
			this.PREMIUM_PHP_SERVICE_URL = "https://uatnew.gibl.in/php-services/fw-services/";
			this.PREMIUM_PHP_SERVICE_URL_LIVEUAT = "https://uatnew.gibl.in/php-services/fw-services/";


		} else if (this.IS_LIVE == 1) {
			/* /// old uat /// */
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
			this.DOMAIN = "http://uat.gibl.in/";
			this.NODE_URL = 'http://uat.gibl.in:8099/';
			this.NODE_URL_FW_BASE_URL = 'http://uat.gibl.in:8099/';
			this.NODE_URL_FW = 'http://uat.gibl.in:8009/cv/fwaction';
			this.BASEURL = "http://uat.gibl.in/car/";
			this.USERAPIURL = "https://www.gibl.in/php-services/user-services/";
			this.PREMIUM_PHP_SERVICE_URL = "http://uat.gibl.in/fw-services/";
			this.NODE_URL_FW_NATIONAL = 'https://napp-cv.gibl.in/fwaction';
			this.PREMIUM_PHP_SERVICE_URL_LIVEUAT = "https://www.gibl.in/php-services/fw-services-uat/";
			this.WALLET_UPDATE_SERVICE_URL = "http://uat.gibl.in/wallet/api/";

			/* /// old uat end /// */

			/* Build Query */
			/* ng build --prod --aot --output-hashing=all  --base-href /car/ */
		} else if (this.IS_LIVE == 2) {

			/* LIVE */
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
			this.DOMAIN = "https://www.gibl.in/";
			this.NODE_URL = 'https://nappfw.gibl.in/';
			this.NODE_URL_FW_BASE_URL = 'https://nappcv.gibl.in/';
			this.NODE_URL_FW = 'https://nappcv.gibl.in/fwaction';
			this.BASEURL = "https://www.gibl.in/car-insurance/";
			this.USERAPIURL = "https://www.gibl.in/php-services/user-services/";
			this.PREMIUM_PHP_SERVICE_URL = "https://www.gibl.in/php-services/fw-services/";
			this.WALLET_UPDATE_SERVICE_URL = "https://www.gibl.in/wallet/api/";
			this.PREMIUM_PHP_SERVICE_URL_LIVEUAT = "https://www.gibl.in/php-services/fw-services/";
			/* Build Query */
			/*	ng build --prod --aot --output-hashing=all  --base-href /motor-insurance/ car-insurance */
		} else if (this.IS_LIVE == 3) {
			/* /// new uat /// */
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
			this.DOMAIN = "http://gweb.ecelticgroup.com/";
			this.NODE_URL = 'http://gnappauth.ecelticgroup.com/';
			this.NODE_URL_FW_BASE_URL = 'http://gnappauth.ecelticgroup.com/';
			this.NODE_URL_FW = 'http://gnappauth.ecelticgroup.com/action/MOTOR/';

			// this.NODE_URL = 'http://uatnew.gibl.in:8099/';
			// this.NODE_URL_FW = 'http://uatnew.gibl.in:8009/cv/fwaction';
			this.BASEURL = "http://gweb.ecelticgroup.com/car-insurance/";
			this.USERAPIURL = "http://gweb.ecelticgroup.com/php-services/user-services/";
			this.PREMIUM_PHP_SERVICE_URL = "http://gweb.ecelticgroup.com/php-services/fw-services/";

			this.NODE_URL_FW_NATIONAL = 'http://uatnappfw.gibl.in/action/';
			// this.PREMIUM_PHP_SERVICE_URL_LIVEUAT= "https://www.gibl.in/php-services/fw-services-uat/";
			this.PREMIUM_PHP_SERVICE_URL_LIVEUAT = "http://gweb.ecelticgroup.com/php-services/fw-services/";
			this.WALLET_UPDATE_SERVICE_URL = "http://gweb.ecelticgroup.com/wallet/api/";
			this.CRMDOMAIN = "http://gcrm.ecelticgroup.com/";
			/* /// new uat end /// car-insurance */

			/* Build Query */
			/* ng build --prod --aot --output-hashing=all  --base-href /car/ */
		} else if (this.IS_LIVE == 4) {
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
			this.NODE_URL = 'http://localhost:3003/';
			this.NODE_URL_FW_BASE_URL = 'http://localhost:3003/';
			this.NODE_URL_FW = 'http://localhost:3003/action/MOTOR/';
			this.BASEURL = "http://localhost:4200";
			this.USERAPIURL = "http://gweb.ecelticgroup.com/php-services/user-services/";
			this.PREMIUM_PHP_SERVICE_URL = "http://gweb.ecelticgroup.com/php-services/fw-services/";
			this.PREMIUM_PHP_SERVICE_URL_LIVEUAT = "http://gweb.ecelticgroup.com/php-services/fw-services/";
			this.DOMAIN = "http://gweb.ecelticgroup.com/";
			this.CRMDOMAIN = "http://gcrm.ecelticgroup.com/";
		} else {
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
			this.NODE_URL = 'http://localhost:3003/';
			this.NODE_URL_FW_BASE_URL = 'http://localhost:3003/';
			this.NODE_URL_FW = 'http://localhost:3003/action/MOTOR/';
			this.BASEURL = "http://localhost:4200";
			this.USERAPIURL = "http://gweb.test/php-services/user-services/";
			this.PREMIUM_PHP_SERVICE_URL = "http://gweb.test/php-services/fw-services/";
			this.PREMIUM_PHP_SERVICE_URL_LIVEUAT = "http://gweb.test/php-services/fw-services/";
			this.DOMAIN = "http://gweb.test/";
			this.CRMDOMAIN = "http://gcrm.test/";
		}

		this.bannerData.banner_image = 'http://uatnew.gibl.in/php-services/email-assets/gibl_banner.jpg';
		this.bannerData.banner_link = 'http://uatnew.gibl.in/php-services/email-assets/banner_link.php';
	}
	public get premiumLoaderCounter(): Observable<number> {
		return this.premiumLoaderCounterSubject.asObservable();
	}
	premiumLoaderCounterIncrement(): void {
		this.premiumLoaderCounterRef += 1;
		this.premiumLoaderCounterSubject.next(this.premiumLoaderCounterRef > 5 ? 5 : this.premiumLoaderCounterRef);
	}
	premiumLoaderCounterDecrement(): void {
		this.premiumLoaderCounterRef -= 1;
		this.premiumLoaderCounterSubject.next(this.premiumLoaderCounterRef > 5 ? 5 : this.premiumLoaderCounterRef);
	}
	premiumLoaderCounterReset(): void {
		this.premiumLoaderCounterRef = 0;
		this.premiumLoaderCounterSubject.next(this.premiumLoaderCounterRef);
	}
	getNodeAPiURL() {
		return this.NODE_URL_FW_BASE_URL;
	}
	navigateURL(router_link) {
		this.objroute = this.route.queryParams.subscribe(params => {
			if (params.utm_source != null && params.utm_source == 'dailyhunt') {
				this.affiliateParam = "dailyhunt";
			}
			if (this.affiliateParam != '') {
				this.router.navigate(['/' + router_link], { queryParams: { utm_source: this.affiliateParam } });
			} else {
				this.router.navigate(['/' + router_link]);
			}
		});
		//this.router.navigate(['/'+router_link]);
	}

	getUserServiceURL() {
		return this.USERAPIURL;
	}
	getPospURL(){
		return this.POSP_URL; 
	}
	bhartiGetPremium(data, url): Observable<any> {
		return this.httpClient.post<any>(url, data, httpOptions)
			.pipe(map(data => {
				return data;
			}));
	}

	getquotesdetails(QID): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let quoteJson = { "serviceUrl": "", "QID": QID };
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=GET_PROPOSAL&QID=' + QID;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);

		//let url = this.NODE_URL + 'motor/getquotesdetails?QuoteID='+QID;
		//return this.httpClient.post(url, QID);
	}

	getpremiumdetails(QUOTE_ID, PROVIDER_ID, NET_PREMIUM): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let quoteJson = { "serviceUrl": "" };
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=GET_PREMIUM_ID&QUOTE_ID=' + QUOTE_ID + "&PROVIDER_ID=" + PROVIDER_ID + "&NET_PREMIUM=" + NET_PREMIUM;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	saveQuote(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorsaveQuote/';
		return this.httpClient.post(url, quoteJson);
	}

	saveQuotePHP(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_SUBMIT';
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	updateStepProposalPHP(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=STORE_SUB_PROPOSAL';
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getSUBProposal(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=GET_SUB_PROPOSAL';
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	updateQuotePHP(quoteJson, quoteID): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_UPDATE&QUOTE_ID=' + quoteID;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	sendSmsEmailPHP(shareFormEmailData, quoteJson, globalAddonArray, globalPremAddonArray): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		shareFormEmailData.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=SEND_SMS_EMAIL';
		shareFormEmailData.quoteJson = quoteJson;
		shareFormEmailData.globalAddonArray = globalAddonArray;
		shareFormEmailData.globalPremAddonArray = globalPremAddonArray;
		return this.httpClient.post(this.NODE_URL_FW, shareFormEmailData);
	}

	track_button(userTrackData): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		userTrackData.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=TRACK_BUTTON';
		return this.httpClient.post(this.NODE_URL_FW, userTrackData);
	}

	sendSmsPHP(shareFormSmsData): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		shareFormSmsData.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=SEND_SMS_EMAIL';
		return this.httpClient.post(this.NODE_URL_FW, shareFormSmsData);
	}

	saveCustomer(customerJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorsaveCustomer/';
		return this.httpClient.post(url, customerJson);
	}

	getcarJson() {
		return this.httpClient.get('assets/quote/fourwheeler.json');
	}

	getrtoJson() {
		return this.httpClient.get('assets/quote/rto_master.json');
	}

	saveRawJson(confirmationJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorsaveRawJson/';
		return this.httpClient.post(url, confirmationJson);
	}

	getQuoteId(custemail) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorgetQuoteId/';
		return this.httpClient.post(url, custemail);
	}

	saveNominee(nomineeJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorsaveNominee/';
		return this.httpClient.post(url, nomineeJson);
	}

	saveCarData(carJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorsaveCar/';
		return this.httpClient.post(url, carJson);
	}

	pinCodeCheck(pinCode, PROVIDER_ID) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/pincodeCheck/?PROVIDER_ID=' + PROVIDER_ID + '&PINCODE=' + pinCode;
		return this.httpClient.post(url, pinCode);
	}

	getCommonNodePremium(quoteJson, PREMIUM_TYPE, PROVIDER_ID) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	// getPremium(quoteJson,providerID,PREMIUM_TYPE){
	hdfcgetrollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		// let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=6&CD=0&PREMIUM_TYPE=' + PREMIUM_TYPE;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=6&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getReliancePremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 12;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getKotakPremium(quoteJson, PREMIUM_TYPE, CD = 0) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 28;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
		//let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=28&PREMIUM_TYPE=' + PREMIUM_TYPE+'&CD=0';
		//return this.httpClient.post(url, quoteJson);
	}

	getKotakCDPremium(quoteJson, PREMIUM_TYPE) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=28&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=1';
		return this.httpClient.post(url, quoteJson);
	}
	getKotakNewPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorServiceNew/?action=PREMIUM_REQUEST&PROVIDER_ID=28&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}
	getKotakTPPremium(quoteJson, PREMIUM_TYPE, CD = 0) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 28;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
		//let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=28&PREMIUM_TYPE=' + PREMIUM_TYPE+'&CD=0';
		//return this.httpClient.post(url, quoteJson);
	}

	hdfcNewgetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=PREMIUM_REQUEST&PROVIDER_ID=6&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	cholaGetRollPremium(quoteJson, PREMIUM_TYPE) {
		// console.log("cholaGetRollPremium");

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 4;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=4&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getBajajRollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=2&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getTataRollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=17&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	relianceNewgetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=PREMIUM_REQUEST&PROVIDER_ID=12&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}


	getNationalPremium(quoteJson, PREMIUM_TYPE, cdStatus) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 10;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + cdStatus;
		// console.log('wwwww--->' + quoteJson.serviceUrl)
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getDigitCDPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 29;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL_LIVEUAT + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&CD=1&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getUnitedIndiaPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=21&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}


	getIciciNewPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 7;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=7&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	// CHANGE DONE BY ARIT
	getIciciPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 7;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getIffcoPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 8;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getNewIndiaPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 18;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getMagmaPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 21;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL_LIVEUAT + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;

		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	// CHANGE DONE BY ARIT FOR ROLL OVER OFFLINE
	getOfflineRolloverPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=1';
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getOfflineTPPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getSompoPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 16;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getFuturePremiumTP(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 5;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getFuturePremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 5;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	createProposalSompo(proposalJson, PROVIDER_ID, PREMIUM_TYPE, CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		proposalJson.providerId = 16;
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=CREATE_PROPOSAL_V&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;

		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	createProposalRenewal(proposalJson, PROVIDER_ID, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=RENEWAL_PROPOSAL_REQUEST&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE;

		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	createProposalMagma(proposalJson, PROVIDER_ID, PREMIUM_TYPE, CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		proposalJson.providerId = 21;
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=CREATE_PROPOSAL_V&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;

		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	createProposalPHP(proposalJson, PROVIDER_ID, PREMIUM_TYPE, CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.IS_LIVE == 2 ? this.PREMIUM_PHP_SERVICE_URL : this.PREMIUM_PHP_SERVICE_URL_LIVEUAT; // Nabendu Manna -> For uat / Live
		proposalJson.serviceUrl = url + 'service.php?action=CREATE_PROPOSAL_V&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;
		// alert('hi');
		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}
	createOfflineProposalPHP(proposalJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	createProposalPHPUAT(proposalJson, PROVIDER_ID, PREMIUM_TYPE, CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		//proposalJson.serviceUrl	= this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=CREATE_PROPOSAL_V&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE+ '&CD=' + CD;
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL_LIVEUAT + 'service.php?action=CREATE_PROPOSAL_V&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;
		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	getPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		this.premiumLoaderCounterIncrement();
		return this.httpClient.post(this.NODE_URL, quoteJson).pipe(tap((res) => {
			this.premiumLoaderCounterDecrement();
		}), catchError(() => {
			this.premiumLoaderCounterDecrement()
			return of([]);
		}));
	}
	saveQuotePremium(quotePremiumJson) {

		// console.log("quotePremiumJson == > ", quotePremiumJson);

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/saveQuotePremium/';
		return this.httpClient.post(url, quotePremiumJson);
	}

	tpGetTataAigPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=17&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	tpGetMagmaPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=21&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}
	getCholaNewPremium(quoteJson,PREMIUM_TYPE){
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 4;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=4&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getCholaPremium(quoteJson, PREMIUM_TYPE) {
		// console.log("cholaGetRollPremium");

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 4;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=4&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	tpGetCholaPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		//let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=4&PREMIUM_TYPE=' + PREMIUM_TYPE;
		//return this.httpClient.post(url, quoteJson);
		quoteJson.providerId = 4;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getSriRamPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=26&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	tpNationalGetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=10&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	tpRelianceGetPremium(quoteJson, PREMIUM_TYPE, cd_type) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=12&CD=' + cd_type + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	tpOffLineRelianceGetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=12&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}
	/*
	tpHDFCGetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=6&CD=0&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}
	*/

	tpGetDhflPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=37&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	tpHDFCGetPremium(quoteJson, PREMIUM_TYPE, CD: Number = 1) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		//let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=6&CD=1&PREMIUM_TYPE=' + PREMIUM_TYPE;
		//return this.httpClient.post(url, quoteJson);

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=6' + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	tpNewIndiaGetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=18&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	getBajajPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew?action=TP_PREMIUM_REQUEST&PROVIDER_ID=2&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	getFutureRollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=5&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	getOrientalRollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=11&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	getDhflRollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=37&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	getDigitRollPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=29&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	tpGetDigitPremium(quoteJson, PREMIUM_TYPE) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=29&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}
	iffcoGetPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 4;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=8&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	/// ----------- START * RUTH ---------------- //


	getRelianceCDPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 12;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&CD=1&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getBajajPremiumPHP(quoteJson, PREMIUM_TYPE, cdStatus) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 2;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&CD=' + cdStatus + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}
	getDigitPremiumPHP(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 29; // 'http://gibl.test/fw-services/'
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL_LIVEUAT + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&CD=0&PREMIUM_TYPE=' + PREMIUM_TYPE; //PREMIUM_PHP_SERVICE_URL_LIVEUAT
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getBajajCDPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 2;
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PREMIUM_REQUEST_V&PROVIDER_ID=' + quoteJson.providerId + '&CD=1&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getHDFCCDPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.providerId = 6;

		let url = this.NODE_URL + 'motor/motorService/?action=PREMIUM_REQUEST&PROVIDER_ID=6&CD=1&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	createProposalReliance(proposalJson, PROVIDER_ID, PREMIUM_TYPE, CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		proposalJson.providerId = 12;
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=CREATE_PROPOSAL_V&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;

		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	tpGetFutureGeneralPremium(quoteJson, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceNew/?action=TP_PREMIUM_REQUEST&PROVIDER_ID=5&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, quoteJson);
	}

	sendSmsEmail(formJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL, formJson);
	}

	createProposal(proposalJson, PROVIDER_ID, PREMIUM_TYPE, CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		var url;
		url = this.NODE_URL + 'motor/motorServiceProposal/?action=CREATE_PROPOSAL&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE + '&CD=' + CD;

		return this.httpClient.post(url, proposalJson);
	}

	createCDProposal(proposalJson, PROVIDER_ID, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		var url;
		/* console.log(PREMIUM_TYPE);
		if (PREMIUM_TYPE == 2) {
			url = 'http://192.168.7.160:8000/motor/motorServiceProposal/?action=CREATE_PROPOSAL&PROVIDER_ID=12&PREMIUM_TYPE=2';
			console.log('test')
		} else {} */
		url = this.NODE_URL + 'motor/motorServiceProposal/?action=CD_TP_CREATE_PROPOSAL&CD=1&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, proposalJson);
	}

	cdRedirection(cdData, PROVIDER_ID) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		var url;
		url = this.NODE_URL + 'cd-redirection/payment-confirmation/?PROVIDER_ID=' + PROVIDER_ID;
		return this.httpClient.post(url, cdData);
	}

	// CHANGE DONE BY ARIT
	createProposalByPHP(proposalJson, PROVIDER_ID, PREMIUM_TYPE = '1', CD) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		proposalJson.providerId = proposalJson.premiumJson.PROVIDER_ID;
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=CREATE_PROPOSAL_V&CD=' + proposalJson.premiumJson.CD + '&PROVIDER_ID=' + proposalJson.premiumJson.PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		// console.log(proposalJson.serviceUrl);

		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	// CHANGE DONE BY ARIT
	createCustomerByPHP(proposalJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=STORE_PROPOSAL_V';

		//let url = this.NODE_URL + 'motor/generalService/';
		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	getPriorityData(proposalJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		proposalJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=GET_PRIORITY_LIST';

		//let url = this.NODE_URL + 'motor/generalService/';
		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	}

	getServiceURL() {
		return this.APIURL;
	}
	getPhpServiceURL() {
		return this.PREMIUM_PHP_SERVICE_URL;
	}

	getBaseURL() {
		return this.BASEURL;
	}
	getDomainURL() {
		return this.DOMAIN;
	}

	getNodeURL() {
		return this.NODE_URL;
	}

	getIsLIVE() {
		return this.IS_LIVE;
	}

	offLineCreateProposal(proposalJson, PROVIDER_ID, PREMIUM_TYPE) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		let url = this.NODE_URL + 'motor/motorServiceProposal/?action=TP_CREATE_PROPOSAL&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		return this.httpClient.post(url, proposalJson);
	}

	/* offLineCreateProposal(proposalJson, PROVIDER_ID, PREMIUM_TYPE,OrderID) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		//let url = this.NODE_URL + 'motor/motorServiceProposal/?action=TP_CREATE_PROPOSAL&PROVIDER_ID=' + PROVIDER_ID + '&PREMIUM_TYPE=' + PREMIUM_TYPE;
		//return this.httpClient.post(url, proposalJson);
		proposalJson.serviceUrl	=this.PREMIUM_PHP_SERVICE_URL + "service.php?action=CREATE_PROPOSAL_OFFLINE&PROVIDER_ID="+PROVIDER_ID+"&PREMIUM_TYPE="+PREMIUM_TYPE+"&OrderID="+OrderID;
		return this.httpClient.post(this.NODE_URL_FW, proposalJson);
	} */

	updateQuote(proposalJson) {

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/updateQuote';
		return this.httpClient.post(url, proposalJson);
	}

	agent_submit(agent_submit) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/agentRequest';
		return this.httpClient.post(url, agent_submit);
	}

	getMagmaHypoJson(providerId) {
		if (providerId == '7') {
			return this.httpClient.get('assets/proposal/icici_finance.json');
		}
		else if (providerId == '4') {
			return this.httpClient.get('assets/proposal/chola_finance.json');
		}
		else {
			return this.httpClient.get('assets/proposal/magma_finance.json');
		}
	}

	getNationalPrevJson() {
		return this.httpClient.get('assets/json/national_branch.json');
	}

	TrackUserSubmit(userTrackData) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		userTrackData.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=TRACK_USER';
		//let url = this.NODE_URL + 'motor/MotorUserTrackData';
		return this.httpClient.post(this.NODE_URL_FW, userTrackData);
	}

	updatePaymentReliance(paymentJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/reliancepaymentsuccessupdate/';
		return this.httpClient.post(url, paymentJson);
	}

	download_policy(data) {
		// const httpOptions = {
		// 	headers: new HttpHeaders({
		// 		'Content-Type': 'application/pdf',
		// 		'Accept': 'application/pdf',
		// 		'Authorization': 'my-auth-token'
		// 	})
		// };

		let url = this.NODE_URL + 'downloadpolicy';
		return this.httpClient.post(url, data);
		// return this.httpClient.post(url, data);
	}

	bajaj_downloadPolicy(data) {
		let url = this.NODE_URL + 'bajajPolicyDownload';
		return this.httpClient.post(url, data);
	}

	kotak_downloadPolicy(data) {
		let url = this.NODE_URL + 'kotakpolicyDownload';
		return this.httpClient.post(url, data);
	}

	call_me_back_submit(callbackjson) {
		/* const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/call_me_back';
		return this.httpClient.post(url, callbackjson); */

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		callbackjson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=STORE_CALLBACK';
		return this.httpClient.post(this.NODE_URL_FW, callbackjson);
	}

	motor_policy_upload(callbackjson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=UPLOAD_FILE';
		return this.httpClient.post(url, callbackjson);
	}

	OflineFileUpload(postData) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=UPLOAD_FILE';
		return this.httpClient.post(serviceUrl, postData);
	}

	OnlineFileUpload(postData) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=UPLOAD_FILE';
		return this.httpClient.post(serviceUrl, postData);
	}

	device_info(callbackjson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/device_info';
		return this.httpClient.post(url, callbackjson);
	}

	send_mail(callbackjson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/device_info';
		var policy_email_url = this.NODE_URL + 'email-sent/?response_track_id=' + callbackjson.response_track_id + '&payment_status=' + callbackjson.payment_status + '&payment_type=' + callbackjson.payment_type;
		return this.httpClient.get(policy_email_url, callbackjson);
	}

	searchBrand(data) {
		const NODE_URL2 = 'http://192.168.7.127:3000/brands';
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(NODE_URL2, data);
	}

	signIn(callbackjson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		//return this.httpClient.post(this.NODE_URL + 'login', callbackjson);
		return this.httpClient.post(this.NODE_URL_FW, callbackjson);
	}

	mapAssoc(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=MAP_ACODE_WITH_QUOTE';
		let url = this.NODE_URL + 'motor/generalService/';
		return this.httpClient.post(url, quoteJson);
	}

	registration(callbackjson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		//return this.httpClient.post(this.NODE_URL + 'registration', callbackjson);
		return this.httpClient.post(this.NODE_URL_FW, callbackjson);
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('user_json');
	}

	isAuthenticated() {
		let token = localStorage.getItem('user_json');
		return token != null;
	}

	tata_downloadPolicy(data) {
		let url = this.NODE_URL + 'tatapolicyDownload';
		return this.httpClient.post(url, data);
	}

	paymentWallet(loginUserJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let url = this.NODE_URL + 'motor/paymentwallet/';
		return this.httpClient.post(url, loginUserJson);
	}

	getQuoteData(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=GET_PREMIUM_V';
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getGarageList(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=GET_GARAGE_LIST_V';
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getStatelist() {
		return this.httpClient.get('assets/json/state_master.json');
	}

	getCitylist() {
		return this.httpClient.get('assets/json/city_master.json');
	}

	getHDFCBreakinLocation() {
		return this.httpClient.get('assets/json/hdfc_breakin_location.json');
	}

	insertCRMQuote(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		quoteJson.serviceUrl = "https://www.gibl.in/php-services/crm-services/angular-quote-data-service.php";
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	getPhpURL() {
		return this.PREMIUM_PHP_SERVICE_URL;
	}

	callPHPWalletService(userJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		userJson.serviceUrl = this.WALLET_UPDATE_SERVICE_URL + 'wallet_balance_update.php?ucode=' + userJson.user_code + '&role_type=' + userJson.role_type;
		return this.httpClient.post(this.NODE_URL_FW, userJson);
	}

	getPriorityList(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	/*
	//DONE BY ARIT FOR LIVE CHAT
	openLiveChatbot() {
		console.log(" ======== CHATBOT ======== ");
		if (typeof this.localWindow.orientation === 'undefined') {
			setTimeout(() => {
				this.loadChat('chat_load_desktop_fw.js');
			}, 1000);
		} else {
			setTimeout(() => {
				this.loadChat('chat_load_mobile.js');
			}, 1000);
		}
	}

	loadChat(jsFile) {
		// IMPORT CHAT JS FILE
		let chatbot_src = "";
		let chat_src = "";
		// let chat_src	="https://www.gibl.in/chatbot/chat_iframe_src/inner/" + jsFile + "?tm="+new Date().getTime();

		if (this.IS_LIVE == 2) {
			chatbot_src = "https://www.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm=" + new Date().getTime();
		} else {
			// chatbot_src	="http://uatnew.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm="+new Date().getTime();
			chatbot_src = "http://uat.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm=" + new Date().getTime();
		}

		let elem1 = this.htmlDocument.getElementById("snackbar");

		let elem = this.htmlDocument.getElementById("chat_src");

		if (elem) {
			elem.parentNode.removeChild(elem);
			elem1.parentNode.removeChild(elem1);
		}

		let IS_SHOW_CHAT = this.IS_SHOW_CHAT;
		if (IS_SHOW_CHAT == 1 && this.IS_LIVE == 2) {
			this.localStorage.getItem('quoteJson').subscribe((data) => {
				let quote_data = JSON.parse(JSON.stringify(data));
				this.chatItem.chatName = "Guest";
				this.chatItem.chatEmail = quote_data.cust_email;
				this.chatItem.chatMob = quote_data.cust_phone;
				this.chatItem.quoteID = quote_data.quoteID;

				var parent_head = this.htmlDocument.getElementsByTagName('head')[0];
				var script = this.htmlDocument.createElement('script');
				script.id = "chat_src";
				script.setAttribute('domain_name', 'CHAT');
				script.setAttribute('domain_cust_name', this.chatItem.chatName);
				script.setAttribute('domain_cust_email', this.chatItem.chatEmail);
				script.setAttribute('domain_cust_mob', this.chatItem.chatMob);
				script.setAttribute('domain_cust_quoteid', this.chatItem.quoteID);
				script.type = 'text/javascript';
				script.src = chat_src;
				parent_head.appendChild(script);
			});
		}
	}

	// DONE BY ARIT FOR CHATBOT
	openMotorChatbot() {
		console.log(" ======== CHATBOT ======== ");
		if (typeof this.localWindow.orientation === 'undefined') {
			setTimeout(() => {
				this.loadChatMotor('chat_load_desktop.js');
			}, 1000);
		} else {
			setTimeout(() => {
				this.loadChatMotor('chat_load_mobile.js');
			}, 1000);
		}
	}
	loadChatMotor(jsFile) {
		// IMPORT CHAT JS FILE
		let chatbot_src = "";
		let chatbot_src2 = "";
		if (this.IS_LIVE == 2) {
			chatbot_src = "https://www.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm=" + new Date().getTime();
		} else {
			// chatbot_src	="http://uatnew.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm="+new Date().getTime();
			chatbot_src = "http://uat.gibl.in/chatbot/chat_iframe_src/motor/" + jsFile + "?tm=" + new Date().getTime();
		}
		// chatbot_src	="https://uat.gibl.in/chatbot/?dmn=CHAT";
		let elem = this.htmlDocument.getElementById("chat_src");
		if (elem) {
			elem.parentNode.removeChild(elem);
		}

		let IS_SHOW_CHAT = this.IS_SHOW_CHAT;
		if (IS_SHOW_CHAT == 1) { // && this.IS_LIVE==2
			let parent_head = this.htmlDocument.getElementsByTagName('head')[0];

			var script = this.htmlDocument.createElement('script');
			script.id = "chat_src";
			script.setAttribute('domain_name', 'CHAT');
			script.type = 'text/javascript';
			script.src = chatbot_src;
			parent_head.appendChild(script);
		}
		// fullIF.setAttribute('src', base_url+'?dmn='+domain_name);
	}

	removeChatMotor() {
		let elem = this.htmlDocument.getElementById("chat_src");
		let chat_btn = this.htmlDocument.getElementById("chat_btn");
		if (elem) {
			elem.parentNode.removeChild(elem);
		}
		if (chat_btn) {
			chat_btn.parentNode.removeChild(chat_btn);
		}
	}
	*/

	updatePayment(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, quoteJson);
	}

	calculatePayoutPayment(jsonData): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		jsonData.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PAYOUT_PAYMENT';
		return this.httpClient.post(this.NODE_URL_FW, jsonData);
	}

	calculatePayoutPaymentPOS(jsonData): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		jsonData.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + 'service.php?action=PAYOUT_PAYMENT_POS';
		return this.httpClient.post(this.NODE_URL_FW, jsonData);
	}

	loadAffiliateSource(affiliateName: any) {
		let languageArr = {
			'dailyhunt': `(function(d,h,e,v,n,t,s) {
				if(d.dht)
					return;
				n=d.dht=function() {
					n.track?n.track.apply(n,arguments):n.queue.push(arguments)
				}
				n.queue=[];
				t=h.createElement(e);
				t.async=!0;
				t.src=v;
				t.id="dht";
				s=h.getElementsByTagName(e)[0];
				s.parentNode.insertBefore(t,s);
			}(window, document, 'script', 'https://assets-money.dailyhunt.in/dht.min.js'));
			dht('init', '');`,
			'other': `function dht(a,b){}`
		}

		let schema_item = this.document.querySelector('script#affiliate_code');
		if (schema_item) {
			schema_item.parentNode.removeChild(schema_item);
		}
		var parent_head = this.htmlDocument.getElementsByTagName('head')[0];
		var script = this.htmlDocument.createElement('script');
		script.id = "affiliate_code";
		script.type = 'text/javascript';
		script.innerHTML = languageArr[affiliateName];
		parent_head.appendChild(script);
	}

	bannerClick(payload) {
		payload.serviceUrl = this.USERAPIURL + "service.php?action=SAVE_BANNER_CLICK";
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, payload);
	}

	walletDeductedService(payload) {
		payload.serviceUrl = this.WALLET_UPDATE_SERVICE_URL + "quote-payment.php";

		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, payload);
	}

	getRelatedVehicle(payload): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'my-auth-token'
		});
		payload.serviceUrl = this.DOMAIN + "php-services/vehicle-search-api/service.php?action=SEARCH_CAR";
		return this.httpClient.post(this.NODE_URL_FW, payload, { headers: headers });
	}

	storeVehicleHistory(payload): Observable<any> {
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'my-auth-token'
		});
		payload.vehicle_type = "car";
		payload.serviceUrl = this.DOMAIN + "php-services/vehicle-search-api/service.php?action=STORE_CAR_SEARCH_HISTORY";
		return this.httpClient.post(this.NODE_URL_FW, payload, { headers: headers });
	}

	getVehicleInfo(reqJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		reqJson.serviceUrl = this.PREMIUM_PHP_SERVICE_URL + "service.php?action=VEHICLE_INFO";
		return this.httpClient.post(this.NODE_URL_FW, reqJson);
	}

	getKycDocOptions(insurer) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		let reqJson = {
			"insurer": insurer,
			"ptype": "Motor",
			"serviceUrl": this.PREMIUM_PHP_SERVICE_URL + "service.php?action=KYC_DOC_OPTION"
		}
		return this.httpClient.post(this.NODE_URL_FW, reqJson);
	}

	getUiColors(): Observable<any> {
		return this.localStorage.getItem<any>('userJson').pipe(map((userJson: any) => {
			let ui: any;
			ui = JSON.parse(JSON.stringify(userJson));
			if (ui && ui.ui) {
				ui = ui.ui;
			} else {
				ui = { "hdrColor": "#055ba9", "ftrColor": "#055ba9", "logoUrl": "assets/quote/img/logo.png", "isSponsored": false };
			}
			return ui;
		}))
	}

	getPospCertificationStatus(user_code: number): Observable<any> {
		const payload = {
			serviceUrl: this.DOMAIN + "php-services/user-services/service.php?action=POSP_CERTIFICATION_STATUS&user_code=" + user_code
		};
		return this.httpClient.post(this.NODE_URL_FW, payload);
	}
	apiPayoutCalculate(data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, data, httpOptions);
	}
	getPayoutList(data: any) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(this.NODE_URL_FW, data, httpOptions);
	}
}
