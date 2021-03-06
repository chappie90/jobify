import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @ViewChild('imageForm') imageForm: FormGroupDirective;

  // Do cloudinary transformation 
  // https://res.cloudinary.com/dycqqk3s6/image/upload/c_thumb,w_400,g_face/image-source

  private form: FormGroup;
  private userId: string;
  private fname: boolean;
  private lname: boolean;
  private headline: boolean;
  private country: boolean;
  private city: boolean;
  private avatar: any;
  private avatarImg: any;
  private number: boolean;
  private editMode: boolean;
  private formSubmitted: boolean;
  private userSub: Subscription;
  private avatarSub: Subscription;
  countries: string[] = ['UK', 'USA', 'Germany', 'Italy'];

  constructor(private authService: AuthService,
              private userService: UserService) {}

  ngOnInit() {
    this.avatarImg = localStorage.getItem('avatar');
    this.imageForm = new FormGroup({
      avatar: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    if (!this.avatarImg) {
      this.avatarImg = './assets/images/avatar-2.svg';
    }
    this.form = new FormGroup({
      'fname': new FormControl(null, {
        validators: []
      }),
      'lname': new FormControl(null, {
        validators: []
      }),
      'headline': new FormControl(null, {
        validators: []
      }),
      'country': new FormControl(null, {
        validators: []
      }),
      'city': new FormControl(null, {
        validators: []
      }),
      'number': new FormControl(null, {
        validators: []
      })
    });
    const summaryString = this.authService.getAuthData().summary;
    if (summaryString) {
      const summaryObj = JSON.parse(summaryString);
      this.form.patchValue({
        'fname': summaryObj.fname,
        'lname': summaryObj.lname,
        'headline': summaryObj.headline,
        'country': summaryObj.country,
        'city': summaryObj.city,
        'number': summaryObj.number
      });
    }

    if (this.form.value.fname) {
      this.fname = true;
    }
    if (this.form.value.lname) {
      this.lname = true;
    }
    if (this.form.value.headline) {
      this.headline = true;
    }
    if (this.form.value.country) {
      this.country = true;
    }
    if (this.form.value.city) {
      this.city = true;
    }
    if (this.form.value.number) {
      this.number = true;
    }
    this.userId = this.authService.getAuthData().userId;

    this.avatarSub = this.userService.getAvatarUpdateListener().subscribe(avatarStatus => {
      if (avatarStatus) {
        this.avatarImg = this.authService.getAuthData().avatar;
      }
    });
    this.userSub = this.userService.getUserUpdateListener().subscribe(userStatus => {
      if (userStatus) {
        const summaryString = this.authService.getAuthData().summary;
        if (summaryString) {
          const summaryObj = JSON.parse(summaryString);
          this.form.patchValue({
            'fname': summaryObj.fname,
            'lname': summaryObj.lname,
            'headline': summaryObj.headline,
            'country': summaryObj.country,
            'city': summaryObj.city,
            'number': summaryObj.number
          });
          if (this.form.value.fname) {
            this.fname = true;
          }
          if (this.form.value.lname) {
            this.lname = true;
          }
          if (this.form.value.headline) {
            this.headline = true;
          }
          if (this.form.value.country) {
            this.country = true;
          }
          if (this.form.value.city) {
            this.city = true;
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

  onAvatarSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.imageForm.patchValue({
      avatar: file
    });
    this.imageForm.get('avatar').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);

    if (this.imageForm.invalid) {
      return;
    }
    this.userService.updateAvatar(this.imageForm.value, this.userId);
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