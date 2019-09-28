import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { JobsService } from '../../../services/jobs.service';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { Job } from '../../jobs/job.model';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedJobsComponent implements OnInit, OnDestroy {
  private jobsSub: Subscription;
  private userSub: Subscription;
  private savedJobs: Job[];
  private jobStatus: boolean;
  private userId: string;

  constructor(private jobsService: JobsService,
              private authService: AuthService,
              private userService: UserService) { }

  ngOnInit() {
    const likedJobs = this.authService.getAuthData().likedJobs.split(',');
    this.jobsService.getMyJobs({ type: 'saved', myJobs: likedJobs });
    this.jobsSub = this.jobsService.getMyJobsUpdateListener().subscribe(
      myJobsData => {
        if (myJobsData.type === 'saved') {
          this.savedJobs = myJobsData.jobs;
        }
      }
    );
    this.userSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        this.savedJobs = this.savedJobs.filter(job => job._id !== userStatus.likedJobId);
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

  ngOnDestroy() {
    if (this.jobsSub) {
      this.jobsSub.unsubscribe();
    }
  }

}