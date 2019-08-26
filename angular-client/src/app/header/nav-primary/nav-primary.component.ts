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
  jobsSection: boolean;
  employerSection: boolean;
  isAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(private router: Router,
              private authService: AuthService) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.jobsSection = event.url === '/jobs'
                          || event.url === '/cv' 
                          || event.url === '/market-insights' 
                          || event.url === '/premium';
        this.employerSection = event.url === '/employer/products' 
                              || event.url === '/employer/pricing' 
                              || event.url === '/employer/post-job';
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
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isAuthenticated = authStatus;
      }
    );
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}