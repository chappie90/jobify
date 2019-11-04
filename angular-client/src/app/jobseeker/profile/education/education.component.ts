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
  userSub: Subscription;
  userId: string;
  formGroupId: number;
  educationArray: any;
  editMode: boolean;
  currentForm: string;
 // imgArr: any;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {}

  ngOnInit() {
   // this.imgArr = ['scholarship-4.svg', 'scholarship-4.svg', 'school.svg'];
    this.form = new FormGroup({
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
      })
    });  
    this.educationArray = JSON.parse(localStorage.getItem('education'));
    this.educationArray.map(
            item => {
              let fromDate = new Date(item.from_date);
              let toDate = new Date(item.to_date);
              return {
                ...item,
                from_date: fromDate,
                to_date: toDate
              }
            }
    );
    this.userId = localStorage.getItem('userId');
    this.userSub = this.userService.getUserEducationUpdateListener().subscribe(
      educationStatus => {
        if (educationStatus) {
          this.editMode = false;
          this.currentForm = '';
          this.educationArray = JSON.parse(localStorage.getItem('education'));
          this.educationArray.map(
            item => {
              let fromDate = new Date(item.from_date);
              let toDate = new Date(item.to_date);
              return {
                ...item,
                  from_date: fromDate,
                  to_date: toDate
                }
            }
          );
        }
      }
    );
  }

  onAddEducation() {
    this.editMode = true;
    this.form.reset();
  }

  onDeleteEducation(e) {
    let formGroupId = e._id;
    this.userService.deleteEducation(formGroupId, this.userId);
  }

  onFormSubmit() {
    if (this.form.invalid) {    
      return;
    }
    if (this.educationArray.length !== 0 && !this.currentForm) {
      this.formGroupId = this.educationArray.length + 1;  
    } else if (this.educationArray.length !== 0) {
      this.formGroupId = this.educationArray.find(form => form._id === this.currentForm);
      this.formGroupId = this.formGroupId.id;
    } else {
      this.formGroupId = 1;
      this.editMode = true;
    }
    console.log(this.formGroupId);
    console.log(this.educationArray);
    console.log(this.currentForm);
    let formGroupData = this.form.value;
    this.userService.updateEducation(this.formGroupId, formGroupData, this.userId);
  }

  onFormEdit(e) {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.currentForm = e._id;
      let fromDate = new Date(e.from_date).toISOString().substring(0, 10);
      let toDate = new Date(e.to_date).toISOString().substring(0, 10);
      this.form.patchValue({
        'school': e.school,
        'degree': e.degree,
        'field': e.field_study,
        'grade': e.grade,
        'from': fromDate,
        'to': toDate,
        'description': e.description
      });
    }
  }
}