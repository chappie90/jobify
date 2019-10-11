import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      'education': new FormGroup({
        'school': new FormControl(null, {
          validators: []
        }),
        'degree': new FormControl(null, {
          validators: []
        }),
        'field': new FormControl(null, {
          validators: []
        }),
        'fromDate': new FormControl(null, {
          validators: []
        }),
        'toDate': new FormControl(null, {
          validators: []
        }),
        'grade': new FormControl(null, {
          validators: []
        }),
        'description': new FormControl(null, {
          validators: []
        })
      }),
       'test': new FormArray([])
    });
  }



  onAddEducation() {
    const control = new FormGroup({
      'name': new FormControl(null),
      'age': new FormControl(null)
    });
    (<FormArray>this.form.get('test')).push(control);
  }

}