import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Job } from '../job.model';
import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-jobs-search',
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.scss']
})
export class JobsSearchComponent implements OnInit {
  private jobsSub: Subscription;
  private job: Job = {};

  constructor(private jobsService: JobsService) {}
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const title = params.title;
      const location = params.location;
      this.jobsService.getJobs({title: title, location: location}, 1);
    });
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          console.log(jobs);          
        }
      );
  }
}
