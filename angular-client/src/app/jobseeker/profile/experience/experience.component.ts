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
              console.log(item.to_date)
              let fromDate = new Date(item.from_date);
              let toDate = item.to_date ? new Date(item.to_date) : 'Present';
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
              let toDate = item.to_date ? new Date(item.to_date) : 'Present';
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

  onAddExperience() {
    this.editMode = true;
    this.form.reset();
  }

  onDeleteExperience(e) {
    let formGroupId = e._id;
    this.userService.deleteExperience(formGroupId, this.userId);
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

  onFormEdit(e) {
    this.editMode = !this.editMode;
    if (this.editMode) {
      console.log(e);
      this.currentForm = e._id;
      let fromDate = new Date(e.from_date).toISOString().substring(0, 10);
      let toDate = new Date(e.to_date).toISOString().substring(0, 10);
      this.form.patchValue({
        'title': e.title,
        'company': e.company,
        'location': e.location,
        'description': e.description,
        'from_date': fromDate,
        'to_date': toDate,
        'currentRole': e.currentRole
      });
    }
  }

}