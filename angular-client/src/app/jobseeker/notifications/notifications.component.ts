import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private notifications: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.notifications = JSON.parse(this.authService.getAuthData().notifications);
    
  }

  ngOnDestroy() {

  }

}