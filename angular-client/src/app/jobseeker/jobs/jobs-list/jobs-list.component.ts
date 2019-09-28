import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../job.model';
import { JobsService } from '../../../services/jobs.service';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss']
})
export class JobsListComponent implements OnInit, OnDestroy {
  private jobs: Job[] = [];
  private jobsSub: Subscription;
  private userSub: Subscription;
  private selectedJob: Job;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private jobsService: JobsService,
              private authService: AuthService,
              private userService: UserService) {
    this.route.params.subscribe(val => {
      this.jobs = this.jobsService.returnAllJobsData().jobs;
      this.selectedJob = this.jobs[0];
      this.jobsService.getJobsItem(this.jobs[0]);
    });
  }

  ngOnInit() {
    this.jobs = this.jobsService.returnAllJobsData().jobs;
    this.selectedJob = this.jobs[0];
    this.jobsService.getJobsItem(this.jobs[0]);
   this.jobsSub = this.jobsService.getJobsUpdateListener()
    .subscribe(
      jobs => {
        this.jobs = jobs.jobs;
        this.selectedJob = this.jobs[0];
        this.jobsService.getJobsItem(this.jobs[0]);
     //   console.log(document.getElementById('jobs-list').scrollTop);
      }
    );
    this.userSub = this.userService.getUserUpdateListener().subscribe(
      userStatus => {
        // // Update jobs array to show job was saved
        // NOT SURE WHY I DON'T NEED THIS TO UPDATE THE UI??
        // let obj = this.jobs.find(o => o.id === userStatus.likedJobId);
        // let index = this.jobs.indexOf(obj);
        // this.jobs.fill(obj.likedJob = true, index, index++);     
      }
      );
  }

  onGetJobsItem(job) {
    this.selectedJob = job;
    this.jobsService.getJobsItem(job);
  }

  ngOnDestroy() {
    if (this.jobsSub) {
      this.jobsSub.unsubscribe();
    }
  }

}