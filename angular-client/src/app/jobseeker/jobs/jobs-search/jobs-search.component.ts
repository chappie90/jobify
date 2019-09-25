import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-jobs-search',
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.scss']
})
export class JobsSearchComponent implements OnInit {
  private jobsSub: Subscription;
 
  ngOnInit() {
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          console.log(jobs);
          
        }
      );
  }
}
