import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { environment } from "../../../environments/environment";

const googleAuthClientId = environment.googleAuthClientId;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
  public auth2: any;
  private jobsSection: boolean = true;
  private emailInputEmptyJob: boolean;
  private emailInputEmptyEmp: boolean;
  private passInputEmptyJob: boolean;
  private passInputEmptyEmp: boolean;
  private companyInputEmpty: boolean;
  private formSubmitted: boolean = false;
  private authStatusSub: Subscription;
  // private googleAuthStatusSub: Subscription;

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        console.log(authStatus);
      }
    );
    // this.googleAuthStatusSub = this.authService.getGoogleAuthStatusListener().subscribe(
    //   googleAuthStatus => {
    //     console.log('yay');
    //   }
    // );  
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: googleAuthClientId,
        fetch_basic_profile: false,
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }

  attachSignin(el) {
    this.auth2.attachClickHandler(el, {}, (googleUser) => {
      let profile = googleUser.getBasicProfile();
      let googleToken = googleUser.getAuthResponse().id_token;
      let googleEmail = profile.getEmail(); 
      this.authService.googleSignIn(googleEmail, googleToken);

        // console.log('Token || ' + googleUser.getAuthResponse().id_token);
         console.log('ID: ' + profile.getId());
        // // console.log('Name: ' + profile.getName());
        // // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
    });
    // console.log(this.auth2.isSignedIn.get());
    // this.authService.googleAuthStatusListener.next(true);
    // this.setGoogleAuthStatus();
  }

  // setGoogleAuthStatus() {
  //   if (this.auth2.isSignedIn.get()) {
  //     this.authService.checkGoogleAuth(true);
  //   } 
  // }

  // signOut() {
  //   if (this.auth2.isSignedIn.get()) {
  //     this.auth2.signOut().then(() => {
  //       console.log("User is signed out");
  //     });
  //   }
  // }

  switchTab() {
    this.jobsSection = !this.jobsSection;
    this.emailInputEmptyJob = false;
    this.passInputEmptyJob = false;
    this.passInputEmptyEmp = false;
    this.emailInputEmptyEmp = false;
    this.companyInputEmpty = false;
    this.formSubmitted = false;
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

  getCompanyValue(value) {
    this.companyInputEmpty = value ? true: false;
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      this.formSubmitted = true;
      return;
    }
    this.authService.createUser(form.value.email, form.value.password, form.value.type);
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}