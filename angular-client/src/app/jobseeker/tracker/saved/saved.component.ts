import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { JobsService } from '../../../services/jobs.service';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { Job } from '../../job.model';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedJobsComponent implements OnInit {
  private jobsSub: Subscription;
  private userSub: Subscription;
  private savedJobs: Job[];
  private likedJobs: any;
  private jobStatus: boolean;
  private userId: string;

  constructor(private jobsService: JobsService,
              private authService: AuthService,
              private userService: UserService) { }

  ngOnInit() {
    this.likedJobs = this.authService.getAuthData().likedJobs.split(',');
    this.jobsService.getSavedJobs(this.likedJobs);
    this.jobsSub = this.jobsService.getSavedJobsUpdateListener().subscribe(
      savedJobs => {
        this.savedJobs = savedJobs.jobs;
      }
    );
    this.userSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        this.savedJobs = this.savedJobs.filter(job => job._id !== userStatus.likedJobId);
        console.log(this.savedJobs);
        // Update job item to show job was saved
        // this.job.likedJob = userStatus.jobStatus ? false : true;
        // this.jobSaveStatus = this.job.likedJob ? 'Unsave' : 'Save';
        // setTimeout(() => {
        //   this.showSaveNotification = false;
        // }, 3000);
      }
    );
  }

  onRemove(job) {
    const jobId = job._id;
    this.userId = this.authService.getAuthData().userId;
    const jobStatus = true;
    let newLikedJobs = this.likedJobs.filter(id => id !== job._id);
    this.userService.likeJob(jobId, jobStatus, newLikedJobs, this.userId);
  }

}