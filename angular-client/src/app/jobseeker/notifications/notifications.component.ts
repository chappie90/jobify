import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notifications: any;

  constructor() {}

  ngOnInit() {
    this.notifications = JSON.parse(localStorage.getItem('notifications'));
    this.notifications.sort((a, b) => b.date.localeCompare(a.date));
    console.log(this.notifications);
  }

  ngOnDestroy() {

  }

}