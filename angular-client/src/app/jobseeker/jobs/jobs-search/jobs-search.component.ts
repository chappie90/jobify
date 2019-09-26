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

  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {}
 
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let title = params.title;
      let location = params.location;
      let pageNumber = params.pageNumber;
      if (!title) {
        title = '';
      }
      if (!location) {
        location = '';
      }
      if (!pageNumber) {
        pageNumber = 1;
      }
      this.jobsService.getJobs({title: title, location: location}, pageNumber);
    });
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
                  
        }
      );
  }
}
