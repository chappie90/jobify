import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  private form: FormGroup;
  private userId: string;
  private fname: boolean;
  private lname: boolean;
  private country: boolean;
  private address: boolean;
  private number: boolean;
  private editMode: boolean;
  private formSubmitted: boolean;
  private userSub: Subscription;
  countries: string[] = ['UK', 'USA', 'Germany', 'Italy'];

  constructor(private authService: AuthService,
              private userService: UserService) {}

  ngOnInit() {
    this.form = new FormGroup({
      'fname': new FormControl(null, {
        validators: []
      }),
      'lname': new FormControl(null, {
        validators: []
      }),
      'country': new FormControl(null, {
        validators: []
      }),
      'address': new FormControl(null, {
        validators: []
      }),
      'number': new FormControl(null, {
        validators: []
      })
    });
    if (this.form.value.fname) {
      this.fname = true;
    }
    if (this.form.value.lname) {
      this.lname = true;
    }
    if (this.form.value.country) {
      this.country = true;
    }
    if (this.form.value.address) {
      this.address = true;
    }
    if (this.form.value.number) {
      this.number = true;
    }
    this.userId = this.authService.getAuthData().userId;
    this.userSub = this.userService.getUserUpdateListener().subscribe(userStatus => {
      if (userStatus) {
        const summaryString = this.authService.getAuthData().summary;
        if (summaryString) {
          const summaryObj = JSON.parse(summaryString);
          this.form.patchValue({
            'fname': summaryObj.fname,
            'lname': summaryObj.lname,
            'country': summaryObj.country,
            'address': summaryObj.address,
            'number': summaryObj.number
          });
          if (this.form.value.fname) {
            this.fname = true;
          }
          if (this.form.value.lname) {
            this.lname = true;
          }
          if (this.form.value.country) {
            this.country = true;
          }
          if (this.form.value.address) {
            this.address = true;
          }
          if (this.form.value.number) {
            this.number = true;
          }
          this.editMode = !this.editMode;
        }
      }
    })
    // if (!this.form.value.country) {
    //   this.form.patchValue({
    //     'country': 'UK'
    //   });
    // }
  }

  onFormEdit() {
    this.editMode = !this.editMode;
  }

  onFormSubmit() {
    if (this.form.invalid) {
      this.formSubmitted = true;
      return;
    }
    this.userService.updateSummary(this.form.value, this.userId);
  }

}