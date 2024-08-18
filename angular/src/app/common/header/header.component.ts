import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LocalStorage } from '@ngx-pwa/local-storage';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiService } from '../../services/api.service';
import { SeoService } from '../../services/seo.service';
import { SubSink } from 'subsink';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
	private subscribeList = new SubSink();
	source_user: string = "100173";
	isLoggedIn: boolean;
	isRollType8: boolean;
	POSP_URL: string;
	POSP_name: any;
	POSPshortname: string;
	isPospImg: boolean;
	POSP_img: any;
	public insuranceTypeMenuItem: any[] = [
		{ 'title': 'Car Insurance', 'link': 'https://www.gibl.in/car-insurance/' },
		{ 'title': 'Health Insurance', 'link': 'https://www.gibl.in/health-insurance/' },
		{ 'title': 'Two Wheeler Insurance', 'link': 'https://www.gibl.in/two-wheeler-insurance/' },
		{ 'title': 'Travel Insurance', 'link': 'https://www.gibl.in/travel-insurance/' },
		{ 'title': 'Personal Accident Insurance', 'link': 'https://www.gibl.in/personal-accident-insurance/' },
		{ 'title': 'Home Insurance', 'link': 'https://www.gibl.in/home-insurance/' },
		{ 'title': 'Commercial Vehicle Insurance', 'link': 'https://www.gibl.in/commercial-vehicle-insurance/' },
		{ 'title': 'Group Insurance', 'link': 'https://www.gibl.in/health-insurance/group-mediclaim-policy/' },
		{ 'title': 'Critical Illness Insurance', 'link': 'https://www.gibl.in/health-insurance/critical-illness-insurance/' },
		{ 'title': 'Gadget Insurance', 'link': 'https://www.gibl.in/gadget-insurance/' }
	];

	public supportMenuItem: any[]  =[
		{'title':'help@ginteja.com','link':''},
		{'title':'08069057777','link':''}
	];

	public dialogRef: any;
	public panelOpenState: boolean = false;

	public retailerLogin: any = {};

	uiStyle: any;
	isSponsored: boolean = false;
	logo: string = 'assets/quote/img/logo.png';
	hdrColor: string = '#055ba9';

	constructor(
		public dialog: MatDialog,
		private router: Router,
		protected localStorage: LocalStorage,
		private apiService: ApiService,
		private seoService: SeoService,
		private route: ActivatedRoute,
	) { }

	ngOnInit() {
		this.generateUi();
		setTimeout(()=>{this.setPospURL();},2000)
		
	}

	ngOnDestroy() {
		this.subscribeList.unsubscribe();
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
	setPospURL() {
		this.localStorage.getItem('userJson').subscribe((data: any) => {
			if (data != null) {
				this.isLoggedIn = true;
				if (data.role_type == '8') {
					this.isRollType8 = true;
					this.POSP_URL = this.apiService.getPospUrl();
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

	logout() {
		this.localStorage.removeItem('userJson').subscribe(() => {
			this.source_user = "100173";
			this.retailerLogin.isLoggedIn = false;
			this.retailerLogin.whileLabeled = false;
		});
	}

	openMenuPopup(content): void {
		this.dialogRef = this.dialog.open(content, {});
		this.dialogRef.afterClosed().subscribe(result => {
			// console.log('The dialog was closed');
		});
	}


	redirectTo(url: string) {
		window.location.href = url;
	}
}
