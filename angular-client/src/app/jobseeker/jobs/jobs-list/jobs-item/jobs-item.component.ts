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
  private userSub: Subscription;
  private job;
  private token: string;
  private isAuthenticated: boolean = false;
  private userId: string;
  private showModal: boolean;
  private toggleForm: boolean = false;
  private jobSaveStatus: string;

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService,
              private userService: UserService,
              private authService: AuthService) {}

  ngOnInit() {
    this.checkToken();
    this.authSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isAuthenticated = authStatus;
      }
    );
    this.jobsSub = this.jobsService.getJobsItemUpdateListener().subscribe(
      job => {
        this.job = job;
        this.jobSaveStatus = this.job.likedJob ? 'Unsave' : 'Save';
      }
    );
    this.userSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        // Update job item to show job was saved
        this.job.likedJob = true;
        this.jobSaveStatus = this.job.likedJob ? 'Unsave' : 'Save';
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
    if (this.isAuthenticated === false) {
      this.showModal = true;
    } else {
      
    }
  }

  onSaveJob(jobId) {
    if (this.isAuthenticated === false) {
      this.showModal = true;
    }
    this.userId = this.authService.getAuthData().userId;
    const likedJobs = this.authService.getAuthData().likedJobs;
    const likedJobsArray = likedJobs.split(',');
    let newLikedJobs;
    if (this.job.likedJob) {
      newLikedJobs = likedJobsArray.filter(id => id !== jobId);
    } else {
      newLikedJobs = [...likedJobsArray, jobId];
    }
    this.userService.likeJob(jobId, newLikedJobs, this.userId);
  }

  onOutsideModal() {
    this.showModal = false;
    this.toggleForm = false;
  }

}