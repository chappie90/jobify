import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from '../../environments/environment';
import { Job } from '../jobseeker/jobs/job.model';
import { AuthService } from '../auth/auth.service';

const API_URL = environment.API + '/jobs';

@Injectable({ providedIn: 'root' })
export class JobsService {
  private jobs: Job[] = [];
  private job: Job;
  private jobsCount: string;
  private currentPage: string;
  private jobsUpdated = new Subject<{ jobs: Job[]; count: string; currentPage: string }>();
  private myJobsUpdated = new Subject<{ type: string; jobs: Job[] }>();
  private jobSelected = new Subject<{ job: Job }>();
  private jobUpdated = new Subject<{ job: Job }>();

  constructor(private http: HttpClient,
              private authService: AuthService) {}

  getJobById(id) {
    const jobId = id;
    if (jobId) {
      const queryParams = `?id=${jobId}`;
      this.http.get<{ job: Job }>(
        API_URL + '/apply' + queryParams
      )
      .subscribe(job => {
        this.job = job.job[0];
        this.jobUpdated.next(this.job);
      });
    }
  }

  getJobs(form: any, page: number) {
    const searchData = { form: form, page: page };
    // let queryParams = `?page=${page}`;
    // if (title) {
    //   queryParams = queryParams.concat(`&title=${title}`);
    // }
    // if (location) {
    //   queryParams = queryParams.concat(`&location=${location}`);
    // }
    // const queryParams = `?page=${page}&title=${title}&location=${location}`;
    this.http.post<{ message: string; jobs: any; totalJobs: string; currentPage: string; }>(
      // './assets/data/jobify-data.json'

      API_URL, searchData
    )
    .pipe(
      map(jobsData => {
        const authData = this.authService.getAuthData();
        let likedJobs;
        let appliedJobs;
        if (authData) {
          likedJobs = JSON.parse(authData.likedJobs);
          appliedJobs = JSON.parse(authData.appliedJobs);
        } else {
          likedJobs = [];
          appliedJobs = [];
        }
        return {
          message: jobsData.message,
          totalJobs: jobsData.totalJobs,
          currentPage: jobsData.currentPage,
          jobs: jobsData.jobs.map(jobData => {
            let liked;
            let applied;
            if (likedJobs.includes(jobData._id)) {
              liked = true;
            } else {
              liked = false;
            }
            let checkApplication = appliedJobs.find(x => x.jobId === jobData._id);
            let applyDate;
            let appliedWhen;
            if (checkApplication) {
              applied = true;
              applyDate = moment(checkApplication.applyDate);
              let daysPassed: moment.Moment = moment().diff(applyDate, 'days');
              if (daysPassed == 0) {
                appliedWhen = 'today';
              } else {
                appliedWhen = daysPassed + ' days ago';
              }
            } else {
              applied = false;
            }
            return {  
                id: jobData._id,
                title: jobData.job_title,
                type: jobData.job_type,
                location: jobData.location,
                company: jobData.company_name,
                logo: jobData.company_logo,
                salary: jobData.salary,
                industry: jobData.industry,
                datePosted: jobData.date_posted,
                overview: jobData.job_overview,
                responsible: jobData.job_responsibilities,
                qualify: jobData.job_qualifications,
                likedJob: liked,
                applied: applied,
                dateApplied: appliedWhen
             };
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

  returnAllJobsData() {
    return {
      jobs: this.jobs,
      count: this.jobsCount,
      currentPage: this.currentPage
    }
  }

  getMyJobs(jobs: any) {
    let fetchMyJobs;
    if (jobs.type === 'saved') {
      fetchMyJobs = { type: 'saved', myJobs: jobs.myJobs };
    }
    if (jobs.type === 'applied') {
      fetchMyJobs = { type: 'applied', myJobs: jobs.myJobs };
    }
    this.http.post<{ type: string; myJobs: any }>(
      API_URL + '/my-jobs', fetchMyJobs
    ).subscribe(response => {
      console.log(response);
      this.myJobsUpdated.next({
        type: response.type,
        jobs: [...response.myJobs]
      });
    });
  }

  getJobUpdateListener() {
    return this.jobUpdated.asObservable();
  }

  getJobsUpdateListener() {
    return this.jobsUpdated.asObservable();
  }

  getMyJobsUpdateListener() {
    return this.myJobsUpdated.asObservable();
  }

  getJobsItem(job) {
    this.jobSelected.next(job);
  }

  getJobsItemUpdateListener() {
    return this.jobSelected.asObservable();
  }
}