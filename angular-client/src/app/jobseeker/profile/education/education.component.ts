import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  form: FormGroup;
  education: FormArray;
  formGroupId: string;
  userSub: Subscription;
  userId: string;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      education: this.formBuilder.array([ this.addEducation() ])
    });
    this.userId = localStorage.getItem('userId');
    this.userSub = this.userService.getUserEducationUpdateListener().subscribe(
      educationStatus => {
        if (educationStatus) {
          const educationObj = JSON.parse(localStorage.getItem('education'));
          console.log(educationObj);
        }
      }
    );
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
      return;
    }
    let formGroupData = this.form.value.education[formGroupId];
    this.userService.updateEducation(formGroupData, this.userId);
  }

  onFormEdit() {

  }

  formGroupRef(btnId) {
    this.formGroupId = btnId;
  }

}