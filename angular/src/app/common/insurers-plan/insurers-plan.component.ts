import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-insurers-plan',
  templateUrl: './insurers-plan.component.html',
  styleUrls: ['./insurers-plan.component.scss']
})
export class InsurersPlanComponent implements OnInit {
  @Input() premiumData: any;
  @Input() loadingStatus: boolean;
  @Input() allRidersStatus: boolean;

  compareStatus: FormControl = new FormControl(false);
  isScreenSmall: boolean = false;
  useDirectPremiumCall: boolean = true;

  constructor(
    private router: Router,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private localStorage: LocalStorage

  ) { }

  ngOnInit(): void {

  }
  buyNow(): void {
    this.localStorage.setItem('premiumjson',JSON.stringify(this.premiumData)).subscribe(()=>{});
    console.log("1234",this.premiumData)
    this.router.navigate(['/proposal']);
  }

  showPdfFromUrl(url: string): void {
    window.open(url, '_blank');
  }
}
