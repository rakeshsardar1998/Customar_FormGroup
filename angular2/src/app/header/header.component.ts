import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppService } from '../service/app.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,AfterViewInit {
  // localStorage: any;
  isLoggedIn: boolean;
  isRollType8: boolean;
  POSP_URL: string;
  POSP_name: any;
  POSPshortname: string;
  isPospImg: boolean;
  POSP_img: any;

  domain_url="";
  carInsurUrl:any;
  bikeInsurUrl:any;
  cvInsurUrl:any;
  healthInsurUrl:any;
  travelInsurUrl:any;
  termInsurUrl:any;
  constructor(private apiService: AppService, private localStorage: LocalStorage,) { }

  ngOnInit() {
    this.domain_url = this.apiService.getDomainURL();
    this.carInsurUrl = `${this.domain_url}car-insurance/`;
    this.bikeInsurUrl = `${this.domain_url}two-wheeler-insurance/`;
    this.cvInsurUrl = `${this.domain_url}commercial-vehicle-insurance/`;
    this.healthInsurUrl = `${this.domain_url}health-insurance/`;
    this.travelInsurUrl = `${this.domain_url}travel-insurance/`;
    this.termInsurUrl = `${this.domain_url}term-insurance/`;
    this.setPospURL() ;
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
  supportLink() {
    window.location.href = this.apiService.getDomainURL()+"contact-us/";
    
  }
  ngAfterViewInit(): void {
    // this.setPospURL() ;
  }
}
