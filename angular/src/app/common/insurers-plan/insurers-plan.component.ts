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
  public quoteFormSubmitBtn: boolean = false;
  premiumJson: any;
  isLoading = false;
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
      // console.log('Loaded premiumJson:', this.premiumJson);
    }, (error) => {
      console.error('Error loading premiumJson:', error);
    });
  }
  buyNow(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.localStorage.setItem('premiumJson', this.premiumData).subscribe(() => {
        this.localStorage.getItem('premiumJson').subscribe((data: string) => {
          this.router.navigate(['/proposal-form']);
          this.isLoading = false;
        }, () => {
          this.isLoading = false;
        });
      }, () => {
        this.isLoading = false;
      });
    }, 2000);
  }
  showPdfFromUrl(url: string): void {
    window.open(url, '_blank');
  }
}
