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
  dynamicFormSecondFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private localStorage: LocalStorage,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.dynamicFormSecondFormGroup = this.fb.group({
      educationalQualification: ['Graduate', [Validators.required]],
      occupation: ['Salaried', [Validators.required]],
      // custPinCode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]]
    });
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
      });
    });
  }
  ngAfterViewInit() {
    // Ensure no changes occur after view initialization
    this.cdr.detectChanges();
  }

  setProposalFormValue() {
    this.dynamicForm.get('custName').setValue(this.quoteJson.custName || '');
    this.dynamicForm.get('custEmail').setValue(this.quoteJson.custEmail || '');
    this.dynamicForm.get('custCuntryCode').setValue(this.quoteJson.custCuntryCode || '');
    this.dynamicForm.get('custMob').setValue(this.quoteJson.custMob || '');

    if (this.quoteJson.custPincode) {
      const formattedPincode = this.quoteJson.custPincode.toString().padStart(6, '0').substring(0, 6);
      this.dynamicForm.get('custPincode').setValue(formattedPincode);
    }
  }


  submitProposalForm() {
    // console.log('this.dynamicForm,this.dynamicFormSecondFormGroup', this.dynamicForm,this.dynamicFormSecondFormGroup)
    this.isLoading = true;

    if (this.dynamicForm.invalid || this.dynamicFormSecondFormGroup.invalid) {
      this.isLoading = false;
      return;
    }

    const pinCode = this.dynamicForm.value.custPincode;

    this.proposalSubmitBtn = !this.proposalSubmitBtn;
    this.quoteJson.custName = this.dynamicForm.get('custName').value;
    this.quoteJson.custEmail = this.dynamicForm.get('custEmail').value;
    this.quoteJson.custCuntryCode = this.dynamicForm.get('custCuntryCode').value;
    this.quoteJson.custMob = this.dynamicForm.get('custMob').value;

    if (pinCode) {
      this.quoteJson.custPinCode = parseInt(pinCode, 10);
    }

    const proposalJson = {
      custName: this.quoteJson.custName,
      custEmail: this.quoteJson.custEmail,
      custCuntryCode: this.quoteJson.custCuntryCode,
      custMob: this.quoteJson.custMob,
      customerFormatDOB: this.quoteJson.customerFormatDOB,
      customerGender: this.quoteJson.customerGender,
      customerEmpStatus: this.quoteJson.customerEmpStatus,
      custPinCode: parseInt(pinCode, 10),
      educationalQualification: this.dynamicFormSecondFormGroup.get('educationalQualification').value,
      occupation: this.dynamicFormSecondFormGroup.get('occupation').value,
      custPremiumAmount: this.premiumJson.net_premium,
    };

    this.quoteJson.proposalJson = proposalJson;
    this.quoteJson.premiumJson = this.premiumJson;

console.log('this.quoteJson',this.quoteJson)
    this.localStorage.setItem('quoteJson', this.quoteJson).subscribe(() => {
      this.subscribeList.add(
        this.apiService.updateQuoteTerm(this.quoteJson).subscribe(insertResponse => {
          console.log('insertResponse',insertResponse)
          // insertResponse = parseInt('1');
          if (typeof insertResponse === 'number' && insertResponse > 0) {
            this.subscribeList.add(
              this.apiService.getAegonProposal(this.quoteJson).subscribe(proposalRes => {
                if (proposalRes.status === 'success' && proposalRes.redirect_url) {
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
    });
  }


  openErrorMessage(messages: any, arg1: string) {
    console.error('Error:', messages);
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
      return isValid ? null : { 'length': { value: control.value } };
    };
  }

  getValidationErrors(control: any, validations: any[]): string[] {
    if (control) {
      for (let validation of validations) {
        if (control.hasError(validation.validator)) {
          return [validation.message];
        }
      }
    }
    return [];
  }

  NoThanks(): void {
    this.router.navigate(['/listing']);
  }

  ngOnDestroy() {
    this.subscribeList.unsubscribe();
  }
}
