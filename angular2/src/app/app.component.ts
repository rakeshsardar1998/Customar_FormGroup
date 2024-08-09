import { Component, Compiler, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Meta, Title } from '@angular/platform-browser';

import { DOCUMENT } from '@angular/common';
import { LocalStorage } from '@ngx-pwa/local-storage';

import {isPlatformBrowser} from '@angular/common';
import { AppService } from './service/app.service';
import { TokenService } from './service/token.service';
import { TokenAuthService } from './service/token-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showHeader: boolean= false;
  showFooter: boolean= false;
  affiliateParam:string	='';
  constructor(
	private _compiler: Compiler,
	private router: Router,
	private title: Title,
	private meta: Meta,
	private route: ActivatedRoute,
	@Inject(DOCUMENT) private document: Document,
	@Inject( DOCUMENT ) public htmlDocument: HTMLDocument,
	@Inject(PLATFORM_ID) private platformId: Object,
	private apiService: AppService,
	private tokenService: TokenService,
	private tokenAuthService: TokenAuthService,
	protected localStorage: LocalStorage) {
		this._compiler.clearCache();
		const curObj  = this;
		setTimeout(function() { curObj.showHeader = true; }, 100);

		this.router.events.subscribe((event: any) => {
		   if (event instanceof NavigationEnd) {
		   if (event.url.split('?')[0] === '/') {
			   this.showFooter= true;
			} else{
				this.showFooter= false;
			}
		  }
		});
	}

	ngOnInit() {
		let date = new Date();
		let day	=date.getDate();
		let month = date.toLocaleString('default', { month: 'long' });
		let year	=date.getFullYear();
		//let full_date	=`${day} ${month}, ${year}`;
		let full_date	='';

		let meta_desc	=`Car Insurance Online: Buy and renew car insurance instantly from the top insurance companies. Compare motor insurance and avail the best coverage now. ${full_date}`;

		let meta_keywords	=`car insurance, compare car insurance online, car insurance compare, car insurance companies, motor insurance online, online motor insurance, motor insurance, car insurance renewal, buy car insurance online, best car insurance in india, motor vehicle insurance, third party car insurance`;

		this.title.setTitle(`Car Insurance Online: Best Car Insurance Renewal Plans in India ${full_date}`);
		this.meta.updateTag({ name: 'description', content: meta_desc });
		this.meta.updateTag({ name: 'keywords', content: meta_keywords });

		// FOR FACEBOOK META TAGS
		this.meta.updateTag({ property: 'og:title', content: `Car Insurance Online: Best Car Insurance Renewal Plans in India ${full_date}` });
		this.meta.updateTag({ property: 'og:description', content: meta_desc});

		// FOR TWITTER META TAGS
		this.meta.updateTag({ property: 'twitter:title', content: `Car Insurance Online: Best Car Insurance Renewal Plans in India ${full_date}` });
		this.meta.updateTag({ property: 'twitter:description', content: meta_desc});

		let schema_item	=this.htmlDocument.querySelector('script[type="application/ld+json"]');
		if( schema_item ){
			let parent_item	=schema_item.parentNode;

			let json_led_schema	={
				"@context": "http://schema.org",
				"@type": "FinancialProduct",
				"name": "Car Insurance",
				"description": `${meta_desc} ${full_date}`,
				"brand":{
					"@type":"Thing",
					"name":"GIBL Car Insurance"
				}
			};
			let string_schema	=JSON.stringify(json_led_schema);
			schema_item.innerHTML	=string_schema;
		}
		this.tokenAuthService.getToken().subscribe(
			(data: any) => {
				this.tokenService.saveToken(data.token);
			}, err => {
				//   this.errorMessage = err.error.message;
				//   this.isLoginFailed = true;
			}
		);

		if (isPlatformBrowser(this.platformId))
		{
			if (this.document.referrer && this.document.referrer != ""){
				this.localStorage.setItem('referrerLink', this.document.referrer).subscribe(() => {});
			}
			else
			{
				this.localStorage.setItem('referrerLink', "").subscribe(() => {});
			}
		}

		this.router.events.subscribe((event: any) => {
			if (event instanceof NavigationEnd) {
				this.route.queryParams.subscribe(params => {
					if(params.utm_source!=null && params.utm_source=='dailyhunt')
					{
						this.apiService.loadAffiliateSource('dailyhunt');
					}
					else
					{
						this.apiService.loadAffiliateSource('other');
					}
				});
			}
		});
    }
}
