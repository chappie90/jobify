import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Job } from '../jobseeker/jobs/job.model';

const API_URL = environment.API + '/jobs';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private jobs: Job[] = [];
  private jobsCount: string;
  private currentPage: string;
  private jobsUpdated = new Subject<{ jobs: Job[]; count: number }>();
  private jobSelected = new Subject<{ job: Job }>();

  constructor(private http: HttpClient) {}

  getJobs(title: string, location: string, page: number) {
    console.log(title);
    console.log(location);
    const queryParams = `?page=${page}&title=${title}&location=${location}`;
    this.http.get<{ message: string; jobs: Job[]; totalJobs: string; currentPage: string; }>(
      // './assets/data/jobify-data.json'

      API_URL + queryParams
    )
    .pipe(
      map(jobsData => {
        return {
          message: jobsData.message,
          totalJobs: jobsData.totalJobs,
          currentPage: jobsData.currentPage,
          jobs: jobsData.jobs.map(job => {
            return {
              id: job._id,
              title: job.job_title,
              type: job.job_type,
              location: job.location,
              company: job.company_name,
              salary: job.salary,
              industry: job.industry,
              datePosted: job.date_posted,
              overview: job.job_overview,
              responsible: job.job_responsibilities,
              qualify: job.job_qualifications
            };
          })
        };
      })
    )
    .subscribe(transformedJobsData => {
      this.jobs = transformedJobsData.jobs;
      this.jobsCount = transformedJobsData.totalJobs; 
      this.currentPage = transformedJobsData.currentPage;
      this.jobsUpdated.next({
        jobs: [...this.jobs],
        count: this.jobsCount,
        currentPage: this.currentPage
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