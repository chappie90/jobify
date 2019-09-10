import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { JobsService } from '../../services/jobs.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  private jobsSearch: boolean = false;
  private jobsSub: Subscription;

  constructor(private jobsService: JobsService) { }

  ngOnInit() {
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          this.jobsSearch = true;
        }
      );
  }

}