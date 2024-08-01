import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router'; // Import Router
import { SubSink } from 'subsink';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient } from '@angular/common/http';

interface ForkJoinResult {
  quoteData: any; // Adjust the type as per your expected data structure
  premiumData: any; // Adjust the type as per your expected data structure
}

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.scss']
})
export class ProposalComponent implements OnInit {

  dynamicFormArray: any;

  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild('edLSubmitBtn', { static: false }) private edLSubmitBtn: ElementRef;
  @ViewChild('offLineSubmitBtn', { static: false }) private offLineSubmitBtn: ElementRef;

  customarItem: any;
  quoteJson: any;
  premiumJson: any;
  private subscribeList = new SubSink();
  public spinnerMode: any = 'indeterminate';
  public focusState: boolean = true;
  proposalSubmitBtn: boolean = false;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  secondProposalFormGroup: FormGroup;
  firstProposalFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    protected localStorage: LocalStorage,
    private router: Router,
    private apiService: ApiService,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.firstProposalFormGroup = this._formBuilder.group({
      custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)]],
      custEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      custMob: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      custCuntryCode: ['', [Validators.required, Validators.pattern(/^[0-9]\d{1}$/)]],
    });
    this.secondProposalFormGroup = this._formBuilder.group({
      // tslint:disable-next-line: max-line-length
      custAddress: ['', [Validators.required, Validators.minLength(6)]],
      custCity: ['', [Validators.required]],
      custCountry: ['India', [Validators.required]],
      custStateCode: ['', [Validators.required]],
      // custPanNo: ['', [ Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      custPinCode: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[1-9]\d{5}$/)]],
    });
    this.firstFormGroup = this._formBuilder.group({
      custName: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z ]*$/)]],
      custEmail: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      custMob: ['', [Validators.required, Validators.pattern(/^[1-9]\d{9}$/)]],
      custCuntryCode: ['', [Validators.required, Validators.pattern(/^[0-9]\d{1}$/)]]
    });
    this.secondFormGroup = this._formBuilder.group({
      custPinCode: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^[1-9]\d{5}$/)]],
      educationalQualification: ['Graduate', [Validators.required]],
      occupation: ['Salaried', [Validators.required]]
    });
    this.thirdFormGroup = this._formBuilder.group({
      annualIncome: ['', [Validators.required]],
      educationalQualification: ['', [Validators.required]],
      occupation: ['', [Validators.required]]
    });

    let quoteJson$ = this.localStorage.getItem('quoteJson') as Observable<any>;
    let premiumJson$ = this.localStorage.getItem('premiumJson') as Observable<any>;
    forkJoin([quoteJson$, premiumJson$]).subscribe((result: any) => {
      this.customarItem = result[0];
      this.quoteJson = result[0];
      this.premiumJson = result[1];
      this.setProposalFormValue();
      // console.log('Quote JSON:', this.quoteJson);
      // console.log('Premium JSON:', this.premiumJson);
    });
  }



  setProposalFormValue() {
    this.firstFormGroup.patchValue({
      custName: this.customarItem.custName,
      custEmail: this.customarItem.custEmail,
      custMob: this.customarItem.custMob,
      custCuntryCode: this.customarItem.custCuntryCode,
    });
  }
  // FUNCTION AFTER SUBMIT AEGON PROPOSAL FORM
  submitProposalForm() {
    if (this.firstFormGroup.invalid && this.secondFormGroup.invalid) {
      return;
    } else {
      this.proposalSubmitBtn = !this.proposalSubmitBtn;
      this.quoteJson = { ...this.quoteJson, ...this.firstFormGroup.value };
      const proposalJson = {
        custName: this.quoteJson.custName,
        custEmail: this.quoteJson.custEmail,
        custCuntryCode: this.quoteJson.custCuntryCode,
        custMob: this.quoteJson.custMob,
        customerFormatDOB: this.quoteJson.customerFormatDOB,
        customerGender: this.quoteJson.customerGender,
        customerEmpStatus: this.quoteJson.customerEmpStatus,
        custPinCode: this.secondFormGroup.get('custPinCode').value,
        educationalQualification: this.secondFormGroup.get('educationalQualification').value,
        occupation: this.secondFormGroup.get('occupation').value,
        custPremiumAmount: this.quoteJson.premiumJson.net_premium,
      };

      this.quoteJson.proposalJson = proposalJson;
      console.log("proposal",proposalJson);
      this.subscribeList.add(
        this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
          this.subscribeList.add(
            this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
              if (typeof insertResponse == "number" && insertResponse > 0) {
                this.subscribeList.add(
                  this.apiService.getAegonProposal(this.quoteJson).subscribe((proposalRes) => {
                    if (proposalRes.status === 'success' && proposalRes.redirect_url !== '') {
                      window.location.href = proposalRes.redirect_url;
                    } else {
                      this.openErrorMessage(proposalRes.messages, 'Close');
                    }
                    this.proposalSubmitBtn = !this.proposalSubmitBtn;
                  })
                );
              }
            })
          );
        })
      );
    }
  }
  openErrorMessage(messages: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
  checkLength(value, len: number, fldName: any) {
    if (value.length > len) {
      // tslint:disable-next-line: radix
      this.firstProposalFormGroup.get(fldName).setValue(parseInt(value.substring(0, len)));
    }
  }
  public checkLengthPinCode() {
    if (this.secondFormGroup.value.custPinCode.toString().length > 6) {
      this.secondFormGroup.controls['custPinCode'].setValue(parseInt(this.secondFormGroup.value.custPinCode.toString().substring(0, 6)));
    }
  }
  updateProposalForm(ev: any, idd: any, componentid: any) {
    if (ev.isUserInput) {
      if (componentid === 'custStateCode') {
        this.secondFormGroup.get('custStateCode').setValue(ev.source.value);
      } else {
        console.log('INVALID DATA');
      }
    }
  }
  checkFirstForm(stepper: MatStepper) {
    if (this.firstProposalFormGroup.invalid) {
      return;
    } else {
      this.stepper.next();
    }
  }
  calculateAge($event) {
    const selDOB = new Date($event.value);
    const timeDiff = Math.abs(Date.now() - selDOB.getTime());
    const custAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.firstProposalFormGroup.get('custAge').setValue(custAge);
  }
  checkProposalFormGroupFirst() {
    if (this.firstFormGroup.invalid)
      return;
    else
      this.stepper.next();
  }
  checkProposalFormGroupSecond() {
    if (this.firstFormGroup.invalid && this.secondFormGroup.invalid)
      return;
    else
      this.submitProposalForm();
  }
  onAddonsFormSubmit(): void {
    this.getPrrmium();
  }
  getPrrmium() {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy() {
    this.subscribeList.unsubscribe();
  }
}
