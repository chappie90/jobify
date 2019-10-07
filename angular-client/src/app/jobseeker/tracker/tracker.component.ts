import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit {
  private appliedJobs: boolean;
  private savedJobs: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.appliedJobs = this.route.snapshot._routerState.url === '/tracker/applied';
      this.savedJobs = this.route.snapshot._routerState.url === '/tracker/saved';
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.appliedJobs = event.url === '/tracker/applied';
        this.savedJobs = event.url === '/tracker/saved';
      }

      if (event instanceof NavigationEnd) {

      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }

}