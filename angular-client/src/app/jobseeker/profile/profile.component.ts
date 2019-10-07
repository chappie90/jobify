import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivatedRoute, Params, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  private summary: boolean;
  private cv: boolean;
  private experience: boolean;
  private education: boolean;
  private skills: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute) {
    this.route.params.subscribe(params => { 
    this.summary = this.route.snapshot._routerState.url === '/profile/summary';
    this.cv = this.route.snapshot._routerState.url === '/profile/cv';
    this.experience = this.route.snapshot._routerState.url === '/profile/experience';
    this.education = this.route.snapshot._routerState.url === '/profile/education';
    this.skills = this.route.snapshot._routerState.url === '/profile/skills';
   });
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.summary = event.url === '/profile/summary';
        this.cv = event.url === '/profile/cv';
        this.experience = event.url === '/profile/experience';
        this.education = event.url === '/profile/education';
        this.skills = event.url === '/profile/skills';
        console.log(this.summary);
      }

      if (event instanceof NavigationEnd) {

      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }

}