import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchPageCanActivateGuard implements  CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
		protected localStorage: LocalStorage
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      this.localStorage.getItem('userJson').subscribe((data: any) => {
        if (data && data != '' && data.parent_user_code) {
          this.authService.searchPageCanActivate(data.parent_user_code).subscribe((data) => {
            let data2 = JSON.parse(data);
            if (data2.is_activate) {
              resolve(true);
            } else {
              this.router.navigate(['/']);
              resolve(false);
            }
          });
        } else {
          this.router.navigate(['/']);
          resolve(false);
        }
      });
    });
  }
}
