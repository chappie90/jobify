import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../auth/user.model';

const API_URL = environment.API + '/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private userUpdated = new Subject<{ status: boolean, likedJobId: string }>();

  constructor(private http: HttpClient) {}

  likeJob(jobId: string, likedJobs: any, userId: string) {
    const likeJobData = { likedJobs: likedJobs, userId: userId, jobId: jobId };
    this.http.patch<{ likedJobs: any; updatedJobId: string }>
      (API_URL + '/like', likeJobData).subscribe(
        response => {
          console.log(response);
          const updatedLikedJobs = response.user.likedJobs;
          const updatedJobId = response.jobId;
          localStorage.setItem('likedJobs', updatedLikedJobs);
          this.userUpdated.next({ status: true, likedJobId: updatedJobId });
        }
      );
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }
}