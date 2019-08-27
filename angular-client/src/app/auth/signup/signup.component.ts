import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {
  private jobsSection: boolean = true;
  private emailInputEmptyJob: boolean;
  private emailInputEmptyEmp: boolean;
  private passInputEmptyJob: boolean;
  private passInputEmptyEmp: boolean;
  private authStatusSub: Subscription;

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        console.log(authStatus);
      }
    );  
  }

  switchTab() {
    this.jobsSection = !this.jobsSection;
    this.emailInputEmptyJob = false;
    this.passInputEmptyJob = false;
    this.passInputEmptyEmp = false;
    this.emailInputEmptyEmp = false;
  }

  getEmailValueJob(value) {
    this.emailInputEmptyJob = value ? true : false;
  }

  getEmailValueEmp(value) {
    this.emailInputEmptyEmp = value ? true : false;
  }

  getPassValueJob(value) {
    this.passInputEmptyJob = value ? true : false;
  }

  getPassValueEmp(value) {
    this.passInputEmptyEmp = value ? true : false;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password, form.value.terms);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}