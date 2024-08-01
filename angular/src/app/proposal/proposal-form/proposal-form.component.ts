import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { forkJoin, Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { ChangeDetectorRef } from '@angular/core';

export interface Root {
  form_field_list: FormFieldList[]
}

export interface FormFieldList {
  name: string
  label: string
  placeHolder: string
  options: any[]
  input_type: string
  default_value: string
  validations: Validation[]
}

export interface Validation {
  validator: string
  value: any
  message: string
}

@Component({
  selector: 'app-proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.scss']
})
export class ProposalFormComponent implements OnInit, AfterViewInit {
  dynamicForm: FormGroup;
  formFields: any[] = [];
  isLoading = false;
  errorMessages: { [key: string]: { [key: string]: string } } = {};
  customarItem: any;
  quoteJson: any;
  premiumJson: any;
  proposalSubmitBtn: boolean = false;
  private subscribeList = new SubSink();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private localStorage: LocalStorage,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.dynamicForm = this.fb.group({});

    this.apiService.getFormFields().subscribe(data => {
      this.formFields = data.form_field_list;
      this.formFields.forEach(field => {
        const control = this.fb.control(
          field.default_value,
          { validators: this.bindValidations(field.validations || []) }
        );
        this.dynamicForm.addControl(field.name, control);
      });

      let quoteJson$ = this.localStorage.getItem('quoteJson') as Observable<any>;
      let premiumJson$ = this.localStorage.getItem('premiumJson') as Observable<any>;
      forkJoin([quoteJson$, premiumJson$]).subscribe((result: any) => {
        this.customarItem = result[0];
        this.quoteJson = result[0];
        this.premiumJson = result[1];
        this.setProposalFormValue();
        console.log('Quote JSON:', this.quoteJson);
        console.log('Premium JSON:', this.premiumJson);
      });
    });
  }

  ngAfterViewInit() {
    // Ensure no changes occur after view initialization
    this.cdr.detectChanges();
  }

  setProposalFormValue() {
    if (this.dynamicForm) {
      this.dynamicForm.patchValue({
        custName: this.customarItem.custName || '',
        custEmail: this.customarItem.custEmail || '',
        custMob: this.customarItem.custMob || '',
        custCuntryCode: this.customarItem.custCuntryCode || '',
        custPincode: this.customarItem.custPincode || ''
      });
    } else {
      console.error('dynamicForm is not initialized.');
    }
  }

  submitProposalForm() {
    if (this.dynamicForm.invalid) {
      return;
    } else {
      this.proposalSubmitBtn = !this.proposalSubmitBtn;
      this.quoteJson = { ...this.quoteJson, ...this.dynamicForm.value };
      const proposalJson = {
        custName: this.quoteJson.custName,
        custEmail: this.quoteJson.custEmail,
        custCuntryCode: this.quoteJson.custCuntryCode,
        custMob: this.quoteJson.custMob,
        customerFormatDOB: this.quoteJson.customerFormatDOB,
        customerGender: this.quoteJson.customerGender,
        customerEmpStatus: this.quoteJson.customerEmpStatus,
        custPinCode: this.dynamicForm.get('custPinCode').value,
        educationalQualification: this.dynamicForm.get('educationalQualification').value,
        occupation: this.dynamicForm.get('occupation').value,
        custPremiumAmount: this.quoteJson.premiumJson.net_premium,
      };

      this.quoteJson.proposalJson = proposalJson;
      console.log("proposal", proposalJson);
      this.subscribeList.add(
        this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
          this.subscribeList.add(
            this.apiService.updateQuoteTerm(this.quoteJson).subscribe((insertResponse) => {
              // console.log('updateQuoteTerm',insertResponse)
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
      this.dynamicForm.get(fldName).setValue(parseInt(value.substring(0, len)));
    }
  }
  public checkLengthPinCode() {
    if (this.dynamicForm.value.custPinCode.toString().length > 6) {
      this.dynamicForm.controls['custPinCode'].setValue(parseInt(this.dynamicForm.value.custPinCode.toString().substring(0, 6)));
    }
  }
  updateProposalForm(ev: any, idd: any, componentid: any) {
    if (ev.isUserInput) {
      if (componentid === 'custStateCode') {
        this.dynamicForm.get('custStateCode').setValue(ev.source.value);
      } else {
        console.log('INVALID DATA');
      }
    }
  }

  bindValidations(validations: any[]): ValidatorFn[] {
    const validList: ValidatorFn[] = [];
    validations.forEach(valid => {
      if (valid.validator === 'required') {
        validList.push(Validators.required);
      }
      if (valid.validator === 'minLength') {
        validList.push(Validators.minLength(valid.value));
      }
      if (valid.validator === 'maxLength') {
        validList.push(Validators.maxLength(valid.value));
      }
      if (valid.validator === 'pattern') {
        validList.push(Validators.pattern(valid.value));
      }
      if (valid.validator === 'email') {
        validList.push(Validators.email);
      }
      if (valid.validator === 'length') {
        validList.push(this.exactLength(valid.value));
      }
    });
    return validList;
  }

  exactLength(length: number): ValidatorFn {
    return (control: any): { [key: string]: any } | null => {
      const isValid = control.value && control.value.length === length;
      if (!isValid) {
      }
      return isValid
        ? null
        : { 'length': { value: control.value } };
    };
  }

  getValidationErrors(control: any, validations: any[]): string[] {
    for (let validation of validations) {
      if (control.hasError(validation.validator)) {
        return [validation.message];
      }
    }
    return [];
  }

  onSubmit() {
    this.isLoading = true;
    if (this.dynamicForm.invalid) {
      Object.keys(this.dynamicForm.controls).forEach(field => {
        const control = this.dynamicForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      this.isLoading = false;
      return;
    }
    console.log(this.dynamicForm.value);
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
  NoThanks(): void {
    this.router.navigate(['/listing']);
  }
  ngOnDestroy() {
    this.subscribeList.unsubscribe();
  }
}
