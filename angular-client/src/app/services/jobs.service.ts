import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Job } from '../jobseeker/jobs/job.model';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private jobs: Job[] = [];
  private jobsUpdated = new Subject<{ jobs: Job[] }>();
  private jobSelected = new Subject<{ job: Job }>();

  constructor(private http: HttpClient) {}

  getJobs() {
    this.http.get<any>(
      './assets/data/jobify-data.json'
    ).subscribe(jobs => {
      this.jobs = jobs;
      this.jobsUpdated.next({
        jobs: [...this.jobs]
      });
    });
  }

  getJobsUpdateListener() {
    return this.jobsUpdated.asObservable();
  }

  getJobsItem(job) {
    this.jobSelected.next(job);
  }

  getJobsItemUpdateListener() {
    return this.jobSelected.asObservable();
  }
}