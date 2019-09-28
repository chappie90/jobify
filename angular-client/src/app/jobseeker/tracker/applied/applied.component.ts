import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { JobsService } from '../../../services/jobs.service';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import { Job } from '../../jobs/job.model';

@Component({
  selector: 'app-applied-jobs',
  templateUrl: './applied.component.html',
  styleUrls: ['./applied.component.scss']
})
export class AppliedJobsComponent implements OnInit, OnDestroy {
  private jobsSub: Subscription;
  private userSub: Subscription;
  private appliedJobs: Job[];
  private jobStatus: boolean;
  private userId: string;

  constructor(private jobsService: JobsService,
              private authService: AuthService,
              private userService: UserService) { }

  ngOnInit() {
    const appliedJobs = this.authService.getAuthData().appliedJobs.split(',');
    this.jobsService.getMyJobs({ type: 'applied', myJobs: appliedJobs });
    this.jobsSub = this.jobsService.getMyJobsUpdateListener().subscribe(
      myJobsData => {
        if (myJobsData.type === 'applied') {
          this.appliedJobs = myJobsData.jobs;
        }
      }
    );
    this.userSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        this.appliedJobs = this.appliedJobs.filter(job => job._id !== userStatus.applied);
        // Update job item to show job was saved
        // this.job.likedJob = userStatus.jobStatus ? false : true;
        // this.jobSaveStatus = this.job.likedJob ? 'Unsave' : 'Save';
        // setTimeout(() => {
        //   this.showSaveNotification = false;
        // }, 3000);
      }
    );
  }

  ngOnDestroy() {
    if (this.jobsSub) {
      this.jobsSub.unsubscribe();
    }
  }

}