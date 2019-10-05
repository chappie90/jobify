import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.summary = event.url === '/profile/summary';
        this.cv = event.url === '/profile/cv';
        this.experience = event.url === '/profile/experience';
        this.education = event.url === '/profile/education';
        this.skills = event.url === '/profile/skills';
      }

      if (event instanceof NavigationEnd) {

      }

      if (event instanceof NavigationError) {
        console.log(event.error);
      }
    });
  }

}