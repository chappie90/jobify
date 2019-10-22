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
  educationData: any;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {}

  ngOnInit() {
    this.educationData = JSON.parse(localStorage.getItem('education'));
    console.log(this.educationData);
    this.form = this.formBuilder.group({
      education: this.formBuilder.array([ this.addEducation() ])
    });
    const educationObj = JSON.parse(localStorage.getItem('education'));
    if (educationObj.length !== 0) {
          this.form.get('education').patchValue([
            { 
              school: educationObj[0].school,
              degree: educationObj[0].degree,
              field: educationObj[0].field_study,
              grade: educationObj[0].grade,
              from: educationObj[0].from_date,
              to: educationObj[0].to_date,
              description: educationObj[0].description
            }
          ]);
        }
    this.userId = localStorage.getItem('userId');
    this.userSub = this.userService.getUserEducationUpdateListener().subscribe(
      educationStatus => {
        if (educationStatus) {
          const educationObj = JSON.parse(localStorage.getItem('education'));
          console.log(educationObj);
          console.log(this.form.get('education'));
          this.form.get('education').patchValue([
            { 
              school: educationObj[0].school,
              degree: educationObj[0].degree,
              field: educationObj[0].field_study,
              grade: educationObj[0].grade,
              from: educationObj[0].from_date,
              to: educationObj[0].to_date,
              description: educationObj[0].description
            }
          ]);
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
    let editMode = false;
    this.userService.updateEducation(formGroupId, formGroupData, editMode, this.userId);
  }

  onFormEdit() {
    this.userService.editModeEduction(true);
  }

  formGroupRef(btnId) {
    this.formGroupId = btnId;
  }

}