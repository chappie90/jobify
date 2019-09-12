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
  private jobsCount: number;
  private currentPage: number;
  private jobsUpdated = new Subject<{ jobs: Job[]; count: number }>();
  private jobSelected = new Subject<{ job: Job }>();
  private pageSelected = new Subject<number>();

  constructor(private http: HttpClient) {}

  getJobs(page: number) {
    const queryParams = `?page=${page}`;
    this.http.get<{ message: string; jobs: Job[]; totalJobs: string; currentPage: string }>(
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
      this.pageSelected.next(this.currentPage);
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

  updatePage(page) {
    this.pageSelected.next(page);
  }

  getPageUpdateListener() {
    return this.pageSelected.asObservable();
  }
}