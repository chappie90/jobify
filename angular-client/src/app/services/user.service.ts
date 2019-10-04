import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../auth/user.model';
import { AuthService } from '../auth/auth.service';

const API_URL = environment.API + '/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userUpdated = new Subject<{ jobStatus: boolean, likedJobId: string, appliedJobs: string }>();
  private applyStatus: boolean;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

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

  applyJob(name: string, 
           email: string, 
           number: string, 
           cv: File,
           userId: string, 
           appliedJobs: any, 
           jobId: string,
           jobTitle: string,
           company: string,
           location: string,
           salary: string) {
    let applicationData = new FormData();
    applicationData.append('name', name);
    applicationData.append('email', email);
    applicationData.append('number', number);
    applicationData.append('cv', cv);
    applicationData.append('userId', userId);
    applicationData.append('appliedJobs', appliedJobs);
    applicationData.append('jobId', jobId);
    applicationData.append('jobTitle', jobTitle);
    applicationData.append('company', company);
    applicationData.append('location', location);
    applicationData.append('salary', salary);
    this.http.post<{ user: User }>(
      API_URL + '/apply', applicationData
    ).subscribe(response => {
      const queryParams = { apply: 'success'};
      this.applyStatus = true;
      localStorage.setItem('appliedJobs', JSON.stringify(response.appliedJobs));
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