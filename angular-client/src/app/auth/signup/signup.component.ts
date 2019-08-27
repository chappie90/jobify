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
    console.log(this.jobsSection);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}