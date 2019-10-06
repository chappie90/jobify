import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  jobsSection: boolean;
  employerSection: boolean;
  loginPage: boolean;
  signupPage: boolean;
  jobseekerType: boolean;
  employerType: boolean;
  userType: string;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.jobsSection = event.url.includes('/jobs')
                          || event.url === '/cv' 
                          || event.url === '/market-insights' 
                          || event.url === '/premium';
        this.employerSection = event.url === '/employer/products' 
                              || event.url === '/employer/pricing' 
                              || event.url === '/employer/post-job';
        this.loginPage = event.url ==='/login';
        this.signupPage = event.url === '/signup';
        this.userType = localStorage.getItem('userType');
        this.jobseekerType = event.url === '/notifications' && this.userType === 'jobseeker'
                            || (event.url === '/notifications' && this.userType === 'jobseeker')
                            || (event.url.includes('/profile') && this.userType === 'jobseeker')
                            || (event.url.includes('/tracker') && this.userType === 'jobseeker')
                            || (event.url.includes('/account') && this.userType === 'jobseeker');
         this.employerType = event.url === '/notifications' && this.userType === 'employer'
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
  }
}