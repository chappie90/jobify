import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { mimeType } from '../../jobs/apply/mime-type';

@Component({
  selector: 'app-view-cv',
  templateUrl: './view-cv.component.html',
  styleUrls: ['./view-cv.component.scss']
})
export class ViewCVComponent implements OnInit, OnDestroy {
  private cv: string;
  private cvName: string;
  private userId: string;
  private authSub: Subscription;

  constructor(private authService: AuthService,
              private userService: UserService) { }

  ngOnInit() {
    if (this.authService.getAuthData()) {
      this.userId = this.authService.getAuthData().userId;
      this.cv = this.authService.getAuthData().cv;
      this.cvName = this.authService.getAuthData().cvName;
    }
    this.authSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        this.cv = userStatus.cvPath;
        this.cvName = userStatus.cvName;
      }
    );
  }

  onCvRemove() {
    this.userService.deleteCv(this.userId);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}