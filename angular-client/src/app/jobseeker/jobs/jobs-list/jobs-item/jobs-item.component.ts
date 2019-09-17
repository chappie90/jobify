import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../../job.model';
import { AuthService } from '../../../../auth/auth.service';
import { JobsService } from '../../../../services/jobs.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-jobs-item',
  templateUrl: './jobs-item.component.html',
  styleUrls: ['./jobs-item.component.scss']
})
export class JobsItemComponent implements OnInit {
  private jobsSub: Subscription;
  private authSub: Subscription;
  private job;
  private isAuthenticated: boolean = false;
  private userId: string;
  private showModal: boolean;
  private toggleForm: boolean = false;

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService,
              private userService: UserService,
              private authService: AuthService) {}

  ngOnInit() {
    this.checkToken();
    this.authSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isAuthenticated = authStatus;
        console.log(this.isAuthenticated, '21');
      }
    );
    this.jobsSub = this.jobsService.getJobsItemUpdateListener().subscribe(
      job => {
        this.job = job;
      }
    );
  }

  checkToken() {
    this.token = this.authService.getAuthData();
    if (this.token) {
      this.isAuthenticated = true;
    }
  }

  onApply(jobId) {
    console.log(this.isAuthenticated);
    if (this.isAuthenticated === false) {
      this.showModal = true;
    } else {
      
    }
  }

  onSaveJob(jobId) {
    console.log(this.isAuthenticated);
    if (this.isAuthenticated === false) {
      this.showModal = true;
    }
    this.userId = this.authService.getAuthData().userId;
    const likedJobs = this.authService.getAuthData().likedJobs;
    const likedJobsArray = likedJobs.split(',');
    const newLikedJobs = [...likedJobsArray, jobId];
    this.userService.likeJob(newLikedJobs, this.userId);
  }

}