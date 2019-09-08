import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../job.model';
import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss']
})
export class JobsListComponent implements OnInit {
  private jobs: Job[] = [];

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService) { }

  ngOnInit() {
   this.jobsService.getJobs();
   this.jobsSub = this.jobsService.getJobsUpdateListener()
    .subscribe(
      jobs => {
        this.jobs = jobs.jobs;
        console.log(this.jobs);
      }
    );
  }

}