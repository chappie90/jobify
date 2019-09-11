import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../../job.model';
import { JobsService } from '../../../../services/jobs.service';

@Component({
  selector: 'app-jobs-item',
  templateUrl: './jobs-item.component.html',
  styleUrls: ['./jobs-item.component.scss']
})
export class JobsItemComponent implements OnInit {
  private jobsSub: Subscription;
  private job: Job;

  constructor(private route: ActivatedRoute,
              private jobsService: JobsService) { }

  ngOnInit() {
    this.jobsSub = this.jobsService.getJobsItemUpdateListener().subscribe(
      job => {
        this.job = job;
      }
    );
  }

}