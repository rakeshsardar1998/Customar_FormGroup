import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { FormService } from '../from-service.service'; // corrected import statement

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  dynamicForm!: FormGroup;
  formFields: any[] = [];
  isLoading = false;

  constructor(private fb: FormBuilder, private formService: FormService) { }

  ngOnInit() {
    this.dynamicForm = this.fb.group({}); // Initialize the FormGroup here
    this.formService.getFormFields().subscribe(data => {
      this.formFields = data.form_field_list;
      this.formFields.forEach(field => {
        const control = this.fb.control(
          field.default_value,
          { validators: this.bindValidations(field.validations || []) } // Use validators here
        );
        this.dynamicForm.addControl(field.name, control);
      });
    });
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
      return control.value && control.value.length === length
        ? null
        : { 'length': { value: control.value } };
    };
  }

  getValidationErrors(control: any, validations: any[]): string[] {
    const errors: string[] = [];
    validations.forEach(validation => {
      if (control.hasError(validation.validator)) {
        errors.push(validation.message);
      }
    });
    return errors;
  }
  onSubmit() {
    if (this.dynamicForm.valid) {
      this.isLoading = true;  // Set isLoading to true when submitting
      console.log(this.dynamicForm.value);
      // Simulate a form submission
      setTimeout(() => {
        this.isLoading = false;  // Reset isLoading after submission
      }, 2000); // Replace with actual submission logic
    } else {
      Object.keys(this.dynamicForm.controls).forEach(field => {
        const control = this.dynamicForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }

  onNoThanks() {
    console.log('No Thanks button clicked');
    // You can add more logic here if needed, such as resetting the form or navigating away
  }
}
