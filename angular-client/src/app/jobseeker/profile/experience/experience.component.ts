import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  form: FormGroup;
  userSub: Subscription;
  userId: string;
  formGroupId: number;
  experienceArray: any;
  editMode: boolean;
  currentForm: string;
  hideEndDate: boolean;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) {}

  ngOnInit() {
    this.hideEndDate = false;
    this.form = new FormGroup({
      title: new FormControl(null, {
         validators: [Validators.required]
      }),
      company: new FormControl(null, {
         validators: [Validators.required]
      }),
      location: new FormControl(null, {
         validators: [Validators.required]
      }),
      currentRole: new FormControl(null, {
         validators: []
      }),
      from: new FormControl(null, {
         validators: []
      }),
      to: new FormControl(null, {
         validators: []
      }),
      description: new FormControl(null, {
         validators: [Validators.required]
      })
    });
    this.experienceArray = JSON.parse(localStorage.getItem('experience'));
    this.experienceArray.map(
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
    this.userSub = this.userService.getUserExperienceUpdateListener().subscribe(
      experienceStatus => {
        if (experienceStatus) {
          this.editMode = false;
          this.currentForm = '';
          this.experienceArray = JSON.parse(localStorage.getItem('experience'));
          this.experienceArray.map(
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

  onFormSubmit() {
    if (this.form.invalid) {    
      return;
    }
    if (this.experienceArray.length !== 0 && !this.currentForm) {
      this.formGroupId = this.experienceArray.length + 1;  
    } else if (this.experienceArray.length !== 0) {
      this.formGroupId = this.experienceArray.find(form => form._id === this.currentForm);
      this.formGroupId = this.formGroupId.id;
    } else {
      this.formGroupId = 1;
      this.editMode = true;
    }
    let formGroupData = this.form.value;
    this.userService.updateExperience(this.formGroupId, formGroupData, this.userId);
  }

  toggleEndDate(e) {
    this.hideEndDate = e.target.checked ? true: false;
  }

}