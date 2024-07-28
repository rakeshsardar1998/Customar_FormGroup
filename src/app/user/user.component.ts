import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { FormService } from '../../app/from-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  dynamicForm!: FormGroup;
  formFields: any[] = [];

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

  onSubmit() {
    if (this.dynamicForm.valid) {
      console.log(this.dynamicForm.value);
      // Process the form data here
    } else {
      // Trigger validation display for all fields
      Object.keys(this.dynamicForm.controls).forEach(field => {
        const control = this.dynamicForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
    }
  }
}
