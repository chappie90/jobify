import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Job } from '../jobseeker/jobs/job.model';
import { AuthService } from '../auth/auth.service';

const API_URL = environment.API + '/jobs';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private jobs: Job[] = [];
  private jobsCount: string;
  private currentPage: string;
  private jobsUpdated = new Subject<{ jobs: Job[]; count: string; currentPage: string }>();
  private jobSelected = new Subject<{ job: Job }>();

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getJobs(title: string, location: string, page: number) {
    const queryParams = `?page=${page}&title=${title}&location=${location}`;
    this.http.get<{ message: string; jobs: any; totalJobs: string; currentPage: string; }>(
      // './assets/data/jobify-data.json'

      API_URL + queryParams
    )
    .pipe(
      map(jobsData => {
        const authData = this.authService.getAuthData();
        let likedJobs;
        if (authData) {
          likedJobs = authData.likedJobs.split(',');
        } else {
          likedJobs = [];
        }
        return {
          message: jobsData.message,
          totalJobs: jobsData.totalJobs,
          currentPage: jobsData.currentPage,
          jobs: jobsData.jobs.map(jobData => {
           if(likedJobs.includes(jobData._id)) {
            return {  
                id: jobData._id,
                title: jobData.job_title,
                type: jobData.job_type,
                location: jobData.location,
                company: jobData.company_name,
                salary: jobData.salary,
                industry: jobData.industry,
                datePosted: jobData.date_posted,
                overview: jobData.job_overview,
                responsible: jobData.job_responsibilities,
                qualify: jobData.job_qualifications,
                likedJob: true
             };
           } else {
            return {  id: jobData._id,
              title: jobData.job_title,
              type: jobData.job_type,
              location: jobData.location,
              company: jobData.company_name,
              salary: jobData.salary,
              industry: jobData.industry,
              datePosted: jobData.date_posted,
              overview: jobData.job_overview,
              responsible: jobData.job_responsibilities,
              qualify: jobData.job_qualifications,
              likedJob: false
            };
           }
          })
        }
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