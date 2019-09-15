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
  private job: Job;

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService,
              private userService: UserService,
              private authService: AuthService) {}

  ngOnInit() {
    this.jobsSub = this.jobsService.getJobsItemUpdateListener().subscribe(
      job => {
        this.job = job;
      }
    );
  }

  onLikeJob(jobId) {
    const userId = this.authService.getAuthData().userId;
    const likedJobs = this.authService.getAuthData().likedJobs;
    const likedJobsArray = likedJobs.split(',');
    const newLikedJobs = [...likedJobsArray, jobId];
    this.userService.likeJob(newLikedJobs, userId);
  }

}