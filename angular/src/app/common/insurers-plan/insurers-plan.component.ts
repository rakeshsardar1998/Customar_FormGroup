import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
  public quoteFormSubmitBtn: boolean  = false;
  premiumJson: any;

  constructor(
    private router: Router,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private localStorage: LocalStorage
  ) { }

  ngOnInit(): void {
    this.loadPremiumJson();
  }

  loadPremiumJson(): void {
    this.localStorage.getItem('premiumJson').subscribe((data) => {
      this.premiumJson = data;
      console.log('Loaded premiumJson:', this.premiumJson);
    }, (error) => {
      console.error('Error loading premiumJson:', error);
    });
  }

  buyNow(): void {
    // this.localStorage.setItem('premiumJson', JSON.stringify(this.premiumData)).subscribe(() => {
    //   console.log("1234", this.premiumData);
    //   this.router.navigate(['/proposal-form']);
    // });
    // Storing data manually as a simple string
this.localStorage.setItem('premiumJson', this.premiumData).subscribe();
this.localStorage.getItem('premiumJson').subscribe((data: string) => {
  // console.log('this.premiumJson', this.premiumData)
  this.router.navigate(['/proposal-form']);
});

  }

  showPdfFromUrl(url: string): void {
    window.open(url, '_blank');
  }
}
