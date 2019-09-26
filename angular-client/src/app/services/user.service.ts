import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../auth/user.model';

const API_URL = environment.API + '/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userUpdated = new Subject<{ jobStatus: boolean, likedJobId: string }>();
  private applyStatus: boolean;

  constructor(private http: HttpClient,
              private router: Router) {}

  likeJob(jobId: string, jobStatus: boolean, likedJobs: any, userId: string) {
    const likeJobData = { likedJobs: likedJobs, userId: userId, jobId: jobId, jobStatus: jobStatus };
    this.http.patch<{ user: any; likedJobs: any; jobStatus: boolean; jobId: string; updatedJobId: string }>
      (API_URL + '/like', likeJobData).subscribe(
        response => {
          const jobStatus = response.jobStatus;
          const updatedLikedJobs = response.user.likedJobs;
          const updatedJobId = response.jobId;
          localStorage.setItem('likedJobs', updatedLikedJobs);
          this.userUpdated.next({ jobStatus: jobStatus, likedJobId: updatedJobId });
        }
      );
  }

  applyJob(name: string, email: string, number: string, cv: File, userId: string, jobId: string) {
    let applicationData = new FormData();
    applicationData.append('name', name);
    applicationData.append('email', email);
    applicationData.append('number', number);
    applicationData.append('cv', cv);
    applicationData.append('userId', userId);
    applicationData.append('jobId', jobId);
    this.http.post<{ message: string }>(
      API_URL + '/apply', applicationData
    ).subscribe(response => {
      const queryParams = { apply: 'success'};
      this.applyStatus = true;
      this.router.navigate(
        ['/jobs/search'],
        {
          queryParams: queryParams,
          queryParamsHandling: 'merge'
        }
      );
    });  
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  returnApplyStatus() {
    return this.applyStatus;
  }

}