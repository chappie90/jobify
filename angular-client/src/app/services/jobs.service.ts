import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Job } from '../jobseeker/jobs/job.model';

const API_URL = environment.API + '/jobs';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private jobs: Job[] = [];
  private jobsUpdated = new Subject<{ jobs: Job[] }>();
  private jobSelected = new Subject<{ job: Job }>();

  constructor(private http: HttpClient) {}

  getJobs(page: number) {
    const queryParams = `?page=${page}`;
    this.http.get<{ message: string; jobs: Job[] }>(
      // './assets/data/jobify-data.json'
      API_URL + queryParams
    ).subscribe(jobs => {
      this.jobs = jobs.jobs;
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