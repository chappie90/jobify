import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { mimeType } from '../../jobs/apply/mime-type.validator';

@Component({
  selector: 'app-view-cv',
  templateUrl: './view-cv.component.html',
  styleUrls: ['./view-cv.component.scss']
})
export class ViewCVComponent implements OnInit, OnDestroy {
  @ViewChild('cvForm') cvForm: FormGroupDirective;
  private cv: string;
  private cvName: string;
  private userId: string;
  private authSub: Subscription;

  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit() {
    if (this.authService.getAuthData()) {
      this.userId = this.authService.getAuthData().userId;
      this.cv = this.authService.getAuthData().cv;
      this.cvName = this.authService.getAuthData().cvName;
    }
    this.form = new FormGroup({
      cv: new FormControl(null, {
        Validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.userId = this.authService.getAuthData().userId;
    this.authSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        this.cv = userStatus.cvPath;
        this.cvName = userStatus.cvName;
      }
    );
  }

  onCvSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      cv: file
    });
    this.form.get('cv').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);

    if (this.form.invalid) {
      return;
    }
    this.cvForm.ngSubmit.emit();
  }

  onFormSubmit() {
    this.userService.uploadCv(this.form.value.cv, this.userId);
  }

  onCvRemove() {
    this.userService.deleteCv(this.userId);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}