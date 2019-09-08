import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Job } from '../jobseeker/jobs/job.model';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private jobs: Job[] = [];
  private jobsUpdated = new Subject<{ jobs: Job[] }>();

  constructor(private http: HttpClient) {}

  getJobs() {
    this.http.get<any>(
    //  '../../../express-server/media/data/jobify-data.json'
      './assets/data/jobify-data.json'
  //    'http://localhost:3000/api/jobs'
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
}