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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      education: this.formBuilder.array([ this.addEducation() ])
    });








    // this.form = new FormGroup({
    //   'education': new FormGroup({
    //     'school': new FormControl(null, {
    //       validators: [Validators.required]
    //     }),
    //     'degree': new FormControl(null, {
    //       validators: [Validators.required]
    //     }),
    //     'field': new FormControl(null, {
    //       validators: [Validators.required]
    //     }),
    //     'fromDate': new FormControl(null, {
    //       validators: [Validators.required]
    //     }),
    //     'toDate': new FormControl(null, {
    //       validators: [Validators.required]
    //     }),
    //     'grade': new FormControl(null, {
    //       validators: [Validators.required]
    //     }),
    //     'description': new FormControl(null, {
    //       validators: [Validators.required]
    //     })
    //   }),
    //    'test': new FormArray([])
    // });
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
      })
    });
  }


  onAddEducation():void {
    this.education = this.form.get('education') as FormArray;
    this.education.push(this.addEducation());
  }

  onFormSubmit() {
    if (this.form.invalid) {
      console.log(this.form.value);
      return;
    }
        console.log(this.form.value);
  }

}