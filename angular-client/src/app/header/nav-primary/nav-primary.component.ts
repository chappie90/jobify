import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav-primary',
  templateUrl: './nav-primary.component.html',
  styleUrls: ['./nav-primary.component.scss']
})
export class NavPrimaryComponent implements OnInit, OnDestroy {
  private jobsSection: boolean;
  private employerSection: boolean;
  private token;
  private isAuthenticated = false;
  private openDropdown = false;
  private authStatusSub: Subscription;
  userType: string;

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.userType = localStorage.getItem('userType');
        this.jobsSection = event.url.includes('/jobs')
                          || event.url === '/cv' 
                          || event.url === '/market-insights' 
                          || event.url === '/premium'
                          || (event.url === '/notifications' && this.userType === 'jobseeker')
                          || (event.url.includes('/profile') && this.userType === 'jobseeker')
                          || (event.url.includes('/tracker') && this.userType === 'jobseeker')
                          || (event.url.includes('/account') && this.userType === 'jobseeker')
                          || event.url.includes('/apply');
        this.employerSection = event.url === '/employer/products' 
                              || event.url === '/employer/pricing' 
                              || event.url === '/employer/post-job'
                              || (event.url === '/notifications' && this.userType === 'employer')
                              || (event.url.includes('/profile') && this.userType === 'employer')
                              || (event.url.includes('/tracker') && this.userType === 'employer')
                              || (event.url.includes('/account') && this.userType === 'employer');
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
    this.checkToken();
  //  this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        console.log(authStatus);
        this.isAuthenticated = authStatus;
      }
    );
  }

  checkToken() {
    this.token = this.authService.getAuthData();
    if (this.token) {
      this.isAuthenticated = true;
    }
  }
  
  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
  }
}