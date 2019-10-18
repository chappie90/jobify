import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  form: FormGroup;
  education: FormArray;
  formGroupId: string;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      education: this.formBuilder.array([ this.addEducation() ])
    });
  // Template access form {{ form.controls.education.controls[i].controls.school.value }}
  }

  addEducation(): FormGroup {
    return this.formBuilder.group({
      school: new FormControl(null, {
         validators: [Validators.required]
      }),
      degree: new FormControl(null, {
         validators: [Validators.required]
      }),
      field: new FormControl(null, {
         validators: [Validators.required]
      }),
      grade: new FormControl(null, {
         validators: [Validators.required]
      }),
      from: new FormControl(null, {
         validators: [Validators.required]
      }),
      to: new FormControl(null, {
         validators: [Validators.required]
      }),
      description: new FormControl(null, {
         validators: [Validators.required]
      }),
    });
  }


  onAddEducation():void {
    this.education = this.form.get('education') as FormArray;
    this.education.push(this.addEducation());
  }

  onFormSubmit() {
    let formGroupId = this.formGroupId;
    if (this.form.get('education').controls[formGroupId].invalid) {    
      console.log('invalid');
      console.log(this.form.value.education);
      return;
    }
    console.log('valid');
    console.log(this.form.value);
    console.log(this.form.get('education').valid);
  }

  formGroupRef(btnId) {
    this.formGroupId = btnId;
  }

}