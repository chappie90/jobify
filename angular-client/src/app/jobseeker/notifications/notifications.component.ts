import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notifications: any;

  constructor() {}

  ngOnInit() {
    let notifications = JSON.parse(localStorage.getItem('notifications'));
    notifications.sort((a, b) => b.date.localeCompare(a.date));
    this.notifications = notifications.map(notification => {
      let dateReceived = moment(notification.date);
      let postedDaysAgo: moment.Moment = moment().diff(dateReceived, 'days');
      let postedHoursAgo: moment.Moment = moment().diff(dateReceived, 'hours');
      let postedMinutesAgo: moment.Moment = moment().diff(dateReceived, 'minutes');
      let postedTimeAgo;
      if (postedDaysAgo > 0) {
        postedTimeAgo = postedDaysAgo + 'd';
      } else if (postedHoursAgo > 0 ) {
        postedTimeAgo = postedHoursAgo + 'h';
      } else {
        postedTimeAgo = postedMinutesAgo + 'm';
      }
      return {
        type: notification.type,
        notification: notification.notification,
        datePosted: postedTimeAgo
      }
    });
  }

  ngOnDestroy() {

  }

}