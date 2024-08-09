import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppService } from './app.service';



// const AUTH_API = 'http://localhost:3003/';
// const AUTH_API = 'https://uatnappauth.gibl.in/';




const headers = new HttpHeaders().set('Content-Type', 'application/json');
const httpOptions = {
  headers:headers,
  withCredentials: true
}

@Injectable({
  providedIn: 'root'
})
export class TokenAuthService {
  AUTH_API:string='';
  constructor(private http: HttpClient, private apiService: AppService) { 
    this.AUTH_API = this.apiService.getNodeAPiURL();
  }

  getToken() {
    return this.http.post(this.AUTH_API + 'api/v1/token', {
      unique_id: new Date().getTime()
    }, httpOptions);
  }

}
