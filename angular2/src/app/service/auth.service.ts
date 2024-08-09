import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private IS_LIVE: String;
  private NODE_URL: String;
  private APIURL: String;
  private BASEURL: String;
  private DOMAIN: String;

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) {
    this.IS_LIVE = "Y";
    if (this.IS_LIVE == "N") {
      this.NODE_URL = 'http://uatnapptw.gibl.in/action/';
      this.APIURL = "http://uatnew.gibl.in/php-services/auth-services/index.php";
      this.BASEURL = "http://uatnew.gibl.in/two-wheeler-insurance/";
      this.DOMAIN = "http://uatnew.gibl.in/";
    } else if (this.IS_LIVE == "Y") {
      this.NODE_URL = 'https://napptw.gibl.in/action/';
      this.APIURL = "https://www.gibl.in/php-services/auth-services/";
      this.BASEURL = "https://www.gibl.in/two-wheeler-insurance/";
      this.DOMAIN = "https://www.gibl.in/";
    } else {
      this.NODE_URL = 'http://uat.gibl.in:8009/tw/action';
      this.APIURL = "http://uat.gibl.in/auth-services/";
      this.BASEURL = "http://uat.gibl.in/tw/";
      this.DOMAIN = "http://uat.gibl.in/";
    }
  }

  searchPageCanActivate(master_code): Observable<any> {
    var payload = {
      master_code: master_code,
      serviceUrl: this.APIURL + "?action=SEARCH_PAGE_CAN_ACTIVATE"
    };
    return this.httpClient.post(`${this.NODE_URL}`, payload);
  }
}
