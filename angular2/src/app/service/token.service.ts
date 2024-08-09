import { Injectable,Inject, PLATFORM_ID  } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorage } from '@ngx-pwa/local-storage';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(  private localStorage: LocalStorage, @Inject(PLATFORM_ID) private platformId: Object) { }
  signOut() {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.clear();
    }else{
      this.localStorage.removeItem(TOKEN_KEY);
    }
  }
  public saveToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.setItem(TOKEN_KEY, token);
    }else{
      this.localStorage.removeItem(TOKEN_KEY);
      this.localStorage.setItem(TOKEN_KEY, token);
    }
  }
  public getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem(TOKEN_KEY);
    }
    this.localStorage.getItem(TOKEN_KEY);
  }
}
