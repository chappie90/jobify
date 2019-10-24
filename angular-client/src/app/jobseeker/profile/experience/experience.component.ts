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
    this.experienceArray = JSON.parse(localStorage.getItem('experience'));
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

  toggleEndDate(e) {
    this.hideEndDate = e.target.checked ? true: false;
  }

}