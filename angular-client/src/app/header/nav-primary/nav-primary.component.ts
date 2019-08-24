import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-nav-primary',
  templateUrl: './nav-primary.component.html',
  styleUrls: ['./nav-primary.component.scss']
})
export class NavPrimaryComponent implements OnInit {
  jobsSection: boolean;
  employerSection: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.jobsSection = event.url === '/jobs';
        this.employerSection = event.url === '/employer';
        console.log(this.jobsSection);
        console.log(this.employerSection);
        console.log(event.url);
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