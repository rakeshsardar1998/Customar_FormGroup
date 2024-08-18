import { Injectable, Inject } from '@angular/core';
// tslint:disable-next-line: import-spacing
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { catchError, delay, map, retry, retryWhen, take, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DOCUMENT } from '@angular/common';
import { from } from 'rxjs'
import { error } from '@angular/compiler/src/util';

@Injectable({
	providedIn: 'root'
})
export class ApiService implements Resolve<any> {
	dynamicForm: any;
	localWindow: Window & typeof globalThis;
	POSP_URL: string;
	submitForm(value: any) {
		throw new Error('Method not implemented.');
	}
	private premiumLoaderCounterRef = 0;
	private premiumLoaderCounterSubject = new BehaviorSubject(this.premiumLoaderCounterRef);
	USERURL: string = "";
	IS_LIVE = 'U';
	LIC_SERVICE_URL = '';
	ICICI_SERVICE_URL = '';
	ICICI_PROPOSAL_URL = '';
	PNB_PROPOSAL_URL = '';
	MAX_SERVICE_URL = '';
	EDELWEISS_SERVICE_URL = '';
	BHARTI_AXA_SERVICE_URL = '';
	HDFC_LIFE_SERVICE_URL = '';
	PNB_LIFE_SERVICE_URL = '';
	TATA_AIA_LIFE_SERVICE_URL = '';
	HOST_NAME = '';
	OFFLINE_SERVICE_URL = '';
	OFFLINE_PAYMENT_URL = '';

	// tslint:disable-next-line: max-line-length
	aegonRedirectUrl: string = 'https://buynow.aegonlife.com/BA/index.aspx?source=gib1051';
	bhartiAxaRedirectUrl: string = 'https://buyonline.bharti-axalife.com/UIRevamp/FlexiTermPlan/Premium/PremiumCalculationFTP?s1=GIBL&s2=Portal';
	/*edelweissRedirectUrl: string  = 'http://gogo.edelweisstokio.in/zindagi-plus/buy?src=Pass_partner_code_here';*/
	edelweissRedirectUrl: string = 'http://gogo.edelweisstokio.in/zindagi-plus/buy?src=A3B9A005';

	offlineGiblPaymentBaseUrl: string = 'https://www.gintejainsurance.com/term-insurance/';
	offlinePaymentUrl: string = 'payment/offline/ccavRequestHandler.php';
	offlinePaymentReturnUrl: string = 'payment/offline/ccavResponseHandler.php';
	offlinePaymentCancelUrl: string = 'payment/offline/ccavResponseHandler.php';

	edelweissSrc: string = 'A3B9A005';
	public annualIncomeList: any[] = [
		{ id: '01', text: '< 5 Lac', edel_text: '3 - 5 Lakhs' },
		{ id: '02', text: '5-7 Lac', edel_text: '5 - 10 Lakhs' },
		{ id: '03', text: '7-10 Lac', edel_text: '10 - 15 Lakhs' },
		{ id: '04', text: '10-15 Lac', edel_text: '15 - 20 Lakhs' },
		{ id: '05', text: '> 15 Lac', edel_text: 'Above 20 Lakhs' }
	];

	ui = { "hdrColor": "#055ba9", "ftrColor": "#055ba9", "logoUrl": "assets/quote/img/logo.png", "isSponsored": false };
	private uiSub = new BehaviorSubject<any>(this.ui);
	readonly getUiColors$ = this.uiSub.asObservable();


	constructor(
		private httpClient: HttpClient,
		protected localStorage: LocalStorage,
		@Inject(DOCUMENT) public document: HTMLDocument
	) { }
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

	createLinkForCanonicalURL(URL: string) {
		let link: HTMLLinkElement = this.document.createElement('link');
		link.setAttribute('rel', 'canonical');
		this.document.head.appendChild(link);
		link.setAttribute('href', URL);
	}

	checkDomain() {
		this.HOST_NAME = document.location.hostname;

		switch (this.HOST_NAME) {
			case 'gweb.ecelticgroup.com':
				this.IS_LIVE = 'U';
				break;
			case 'gintejainsurance.com':
			case 'www.gintejainsurance.com':
				this.IS_LIVE = 'L';
				break;
			default:
				this.IS_LIVE = 'LOC';
				break;
		}

		return this.IS_LIVE;
	}

	getDomain() {
		let domain = "";
		this.IS_LIVE = this.checkDomain();
		switch (this.IS_LIVE) {
			case 'U':
				domain = 'http://gweb.ecelticgroup.com/';
				break;
			case 'L':
				domain = 'https://gintejainsurance.com/';
				break;
			default:
				domain = 'http://gweb.ecelticgroup.com/';
		}

		return domain;
	}

	getBaseURL() {
		// tslint:disable-next-line: no-conditional-assignment
		this.IS_LIVE = this.checkDomain();

		if (this.IS_LIVE === 'U') {
			this.LIC_SERVICE_URL = 'http://gnapptl.ecelticgroup.com/';
		} else if (this.IS_LIVE === 'L') {
			this.LIC_SERVICE_URL = 'https://napptl.gintejainsurance.in/';
		} else {
			this.LIC_SERVICE_URL = 'http://127.0.0.1:3004/';
		}
		return this.LIC_SERVICE_URL;
	}
	getPospUrl(){
		this.IS_LIVE = this.checkDomain();

		if (this.IS_LIVE === 'U') {
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
		} else if (this.IS_LIVE === 'L') {
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
		} else {
			this.POSP_URL = "http://gcrm.ecelticgroup.com/posp-products.php";
		}
		return this.POSP_URL;

	}

	getBaseUserServiceUrl() {
		this.IS_LIVE = this.checkDomain();
		let USER_SERVICE_BASE_URL = '';
		if (this.IS_LIVE === 'U') {
			USER_SERVICE_BASE_URL = 'http://gweb.ecelticgroup.com/php-services/user-services/'; // http://uat.gibl.in/user-services/
		} else if (this.IS_LIVE === 'L') {
			USER_SERVICE_BASE_URL = 'https://www.gintejainsurance.com/php-services/user-services/';
		} else {
			USER_SERVICE_BASE_URL = 'http://gweb.test/php-services/user-services/';
		}
		return USER_SERVICE_BASE_URL;
	}

	getOfflineServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.OFFLINE_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=SAVE_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			this.OFFLINE_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=SAVE_PROPOSAL';
		} else {
			this.OFFLINE_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=SAVE_PROPOSAL';
		}
		return this.OFFLINE_SERVICE_URL;
	}

	getOfflinePaymentBaseUrl() {
		this.IS_LIVE = this.checkDomain();
		if (this.IS_LIVE === 'U') {
			this.offlineGiblPaymentBaseUrl = 'http://gweb.ecelticgroup.com/term-insurance/';
		} else if (this.IS_LIVE === 'L') {
			this.offlineGiblPaymentBaseUrl = 'https://www.gintejainsurance.com/term-insurance/';
		} else {
			this.offlineGiblPaymentBaseUrl = 'https://gweb.test/term-insurance/';
		}
		return this.offlineGiblPaymentBaseUrl;
	}

	getMaxServiceURL() {
		this.IS_LIVE = this.checkDomain();
		if (this.IS_LIVE === 'U') {
			this.MAX_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_MAX_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.MAX_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_MAX_QUOTE';
		} else {
			this.MAX_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_MAX_QUOTE';
		}
		return this.MAX_SERVICE_URL;
	}

	getICICIServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.ICICI_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_ICICI_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.ICICI_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_ICICI_QUOTE';
		} else {
			this.ICICI_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_ICICI_QUOTE';
		}
		return this.ICICI_SERVICE_URL;
	}

	getICICIProposalURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.ICICI_PROPOSAL_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			this.ICICI_PROPOSAL_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		} else {
			this.ICICI_PROPOSAL_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_ICICI_PROPOSAL';
		}
		return this.ICICI_PROPOSAL_URL;
	}

	getPnbProposalURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.PNB_PROPOSAL_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			this.PNB_PROPOSAL_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		} else {
			this.PNB_PROPOSAL_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_PNB_PROPOSAL';
		}
		return this.PNB_PROPOSAL_URL;
	}


	getAegonProposalURL() {
		this.IS_LIVE = this.checkDomain();
		let AEGON_PROPOSAL_URL = ""
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			AEGON_PROPOSAL_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		} else if (this.IS_LIVE === 'L') {
			AEGON_PROPOSAL_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		} else {
			AEGON_PROPOSAL_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_AEGON_PROPOSAL';
		}
		return AEGON_PROPOSAL_URL;
	}


	getEdelweissTokioServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.EDELWEISS_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.EDELWEISS_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		} else {
			this.EDELWEISS_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_EDELWEISS_TOKIO_QUOTE';
		}
		return this.EDELWEISS_SERVICE_URL;
	}

	getBhartiAxaServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.BHARTI_AXA_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/php-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.BHARTI_AXA_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		} else {
			this.BHARTI_AXA_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_BHARTI_AXA_QUOTE';
		}
		return this.BHARTI_AXA_SERVICE_URL;
	}

	getHdfcLifeServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.HDFC_LIFE_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.HDFC_LIFE_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		} else {
			this.HDFC_LIFE_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_HDFC_LIFE_QUOTE';
		}
		return this.HDFC_LIFE_SERVICE_URL;
	}

	getKotakLifeServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.HDFC_LIFE_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_KOTAK_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.HDFC_LIFE_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_KOTAK_QUOTE';
		} else {
			this.HDFC_LIFE_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_KOTAK_QUOTE';
		}
		return this.HDFC_LIFE_SERVICE_URL;
	}

	getAegonServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.PNB_LIFE_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_AEGON_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.PNB_LIFE_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_AEGON_QUOTE';
		} else {
			this.PNB_LIFE_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_AEGON_QUOTE';
		}
		return this.PNB_LIFE_SERVICE_URL;
	}

	getTataAiaServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.TATA_AIA_LIFE_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.TATA_AIA_LIFE_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		} else {
			this.TATA_AIA_LIFE_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_TATA_AIA_QUOTE';
		}
		return this.TATA_AIA_LIFE_SERVICE_URL;
	}

	getPnbServiceURL() {
		this.IS_LIVE = this.checkDomain();
		// tslint:disable-next-line: no-conditional-assignment
		if (this.IS_LIVE === 'U') {
			this.PNB_LIFE_SERVICE_URL = 'http://gweb.ecelticgroup.com/php-services/life-services/index.php?action=GET_PNB_QUOTE';
		} else if (this.IS_LIVE === 'L') {
			this.PNB_LIFE_SERVICE_URL = 'https://www.gintejainsurance.com/php-services/life-services/index.php?action=GET_PNB_QUOTE';
		} else {
			this.PNB_LIFE_SERVICE_URL = 'http://gweb.test/php-services/life-services/index.php?action=GET_PNB_QUOTE';
		}
		return this.PNB_LIFE_SERVICE_URL;
	}

	resolve(route: ActivatedRouteSnapshot) {
		const curObj = this;
		const quoteJson: any = '';

		const baseURL = this.getBaseURL();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		return this.httpClient.post(`${baseURL}api/resolveData`, quoteJson, httpOptions)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(10))));
	}

	callTest(quoteJson: any) {
		const baseURL = this.getBaseURL();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		return this.httpClient.post(`${baseURL}api/resolveDatan`, quoteJson, httpOptions).pipe(delay(1000));
	}

	signIn(callbackjson) {
		console.log("TEST signin");

		const baseURL = this.getBaseURL();
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};
		return this.httpClient.post(`${baseURL}api/signin/`, callbackjson, httpOptions)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(3))));
	}

	logout() {
		// remove user from local storage to log user out
		localStorage.removeItem('userJson');
	}

	isAuthenticated() {
		const token = localStorage.getItem('userJson');
		return token != null;
	}

	getMaxNyRegularPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getMaxServiceURL();
		quoteJson.providerId = 30;
		return this.httpClient.post(`${baseURL}maxny/api/getPremium/${quoteJson.providerId}`, quoteJson, httpOptions);
		// return this.httpClient.post(`${baseURL}maxny/api/getPremium/${quoteJson.providerId}`, quoteJson, httpOptions)
		// .pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getICICIPruRegularPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getICICIServiceURL();
		quoteJson.providerId = 31;
		return this.httpClient.post(`${baseURL}icicpru/api/getRegularQuote/${quoteJson.providerId}`, quoteJson, httpOptions);
		// return this.httpClient.post(`${baseURL}icicpru/api/getRegularQuote/${quoteJson.providerId}`, quoteJson, httpOptions)
		// .pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getICICIPruProposal(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getICICIProposalURL();
		quoteJson.providerId = 31;
		// return false;
		return this.httpClient.post(`${baseURL}icicpru/api/getProposal/${quoteJson.providerId}`, quoteJson);
	}

	getPnbProposal(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getPnbProposalURL();
		quoteJson.providerId = 40;
		return this.httpClient.post(`${baseURL}icicpru/api/getProposal/40`, quoteJson);
	}


	getAegonProposal(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getAegonProposalURL();
		quoteJson.providerId = 32;
		return this.httpClient.post(`${baseURL}common/api/getProposal/32`, quoteJson);
	}

	// old
	getAegonTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getICICIServiceURL();
		quoteJson.providerId = 32;
		return this.httpClient.post(`${baseURL}aegonlife/api/getPremium/${quoteJson.providerId}`, quoteJson);
		// .pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getHDFCTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getHdfcLifeServiceURL();
		quoteJson.providerId = 33;
		return this.httpClient.post(`${baseURL}hdfclife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getKotakermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getKotakLifeServiceURL();
		quoteJson.providerId = 39;
		return this.httpClient.post(`${baseURL}kotaklife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getPnbPremium(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getPnbServiceURL();
		quoteJson.providerId = 40;
		return this.httpClient.post(`${baseURL}common/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	// getAegonPremium(quoteJson): Observable<any> {
	// 	const httpOptions = {
	// 		headers: new HttpHeaders({
	// 			'Content-Type': 'application/json',
	// 			Accept: 'application/json',
	// 			Authorization: 'my-auth-token'
	// 		})
	// 	};
	// 	const baseURL = this.getBaseURL();
	// 	quoteJson.serviceUrl = this.getAegonServiceURL();
	// 	quoteJson.providerId = 32;
	// 	console.log('loader',this.premiumLoaderCounterIncrement.length)
	// 	return this.httpClient.post(`${baseURL}common/api/getPremium/${quoteJson.providerId}`, quoteJson)
	// 		.pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	// }
	getAegonPremium(quoteJson: any): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'my-auth-token'
			})
		};

		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getAegonServiceURL();
		quoteJson.providerId = 32;

		this.premiumLoaderCounterIncrement();
		return this.httpClient.post(`${baseURL}common/api/getPremium/${quoteJson.providerId}`, quoteJson, httpOptions)
			.pipe(
				retryWhen(errors => errors.pipe(delay(1000), take(5))),
				tap(() => {
					this.premiumLoaderCounterDecrement();
				}),
				catchError(() => {
					this.premiumLoaderCounterDecrement();
					return of([]);
				})
			);
	}
	getTataAiaPremium(quoteJson): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getTataAiaServiceURL();
		quoteJson.providerId = 41;

		return this.httpClient.post(`${baseURL}common/api/getPremium/${quoteJson.providerId}`, quoteJson)
			.pipe(retryWhen(errors => errors.pipe(delay(1000), take(5))));
	}

	getEdelweissTokioTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getEdelweissTokioServiceURL();
		quoteJson.providerId = 34;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getEdelweissTokioTermLink(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getEdelweissTokioServiceURL() + '&type=2';
		quoteJson.providerId = 34;

		return this.httpClient.post(`${baseURL}edelweisslife/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	getBhartiAxaTermPremium(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		quoteJson.serviceUrl = this.getBhartiAxaServiceURL();
		quoteJson.providerId = 35;
		return this.httpClient.post(`${baseURL}bhartiaxa/api/getPremium/${quoteJson.providerId}`, quoteJson);
	}

	submitQuoteTerm(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(`${baseURL}api/saveLifeQuote/`, quoteJson, httpOptions);
	}

	updateQuoteTerm(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		console.log(`${baseURL}api/updateLifeQuote/`)
		return this.httpClient.post(`${baseURL}api/updateLifeQuote/`, quoteJson, httpOptions);
	}

	getQuoteTerm(quoteId) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		let quoteData = { quoteId: quoteId };
		const baseURL = this.getBaseURL();
		return this.httpClient.post(`${baseURL}api/getQuoteDetails/`, quoteData, httpOptions);
	}

	savePaymentTerm(quoteJson) {
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'my-auth-token'
			})
		};
		const baseURL = this.getBaseURL();
		return this.httpClient.post(`${baseURL}api/savePayment/`, quoteJson, httpOptions);
	}

	toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}
	getUi(): Observable<any> {
		return this.localStorage.getItem('userJson').pipe(map((userJson: any) => {
			let ui: any;
			ui = JSON.parse(JSON.stringify(userJson));
			if (ui && ui.ui) {
				ui = ui.ui;
			} else {
				ui = { "hdrColor": "#055ba9", "ftrColor": "#055ba9", "logoUrl": "assets/quote/img/logo.png", "isSponsored": false };
			}
			this.uiSub.next(Object.assign([], ui));
			return ui;
		}));
	}

	getPospCertificationStatus(user_code: number): Observable<any> {
		const baseURL = this.getBaseURL();
		const domain = this.getDomain();
		const payload = {
			serviceUrl: domain + "php-services/user-services/service.php?action=POSP_CERTIFICATION_STATUS&user_code=" + user_code
		};
		return this.httpClient.post(`${baseURL}common/api`, payload);
	}
	getFormFields(provider_id): Observable<any> {
		const baseURL = this.getBaseURL();
		const domain = this.getDomain();
		const payload = {provider_id};
		return this.httpClient.post(`${baseURL}common/get-proposal-form`, payload);
	}

	pospLogin(sourceId: string): Observable<any> {
		const baseURL = this.getBaseURL();
		const domain = this.getDomain();
		const payload = {
			source: sourceId,
			serviceUrl: `${domain}php-services/user-services/login.php?TYPE=7`
		};
		return this.httpClient.post(`${baseURL}common/api/login`, payload);
	}

}

