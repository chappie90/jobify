import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit, OnDestroy {
  private emailInputEmpty: boolean;
  private passInputEmpty: boolean;
  private formSubmitted: boolean = false;
  private authStatusSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
      }
    );
  }

  getEmailValue(value) {
    this.emailInputEmpty = value ? true : false;
  }

  getPassValue(value) {
    this.passInputEmpty = value ? true : false;
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.formSubmitted = true;
      return;
    }
    this.authService.login(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}