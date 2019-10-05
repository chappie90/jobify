import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { mimeType } from '../jobs/apply/mime-type.validator';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-upload-cv',
  templateUrl: './upload-cv.component.html',
  styleUrls: ['./upload-cv.component.scss']
})
export class UploadCVComponent implements OnInit {
  @ViewChild('cvForm') cvForm: FormGroupDirective;

  private userId: string;

  constructor(private userService: UserService,
              private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      cv: new FormControl(null, {
        Validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.userId = this.authService.getAuthData().userId;
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
}