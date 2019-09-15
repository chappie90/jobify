import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../auth/user.model';

const API_URL = environment.API + '/user';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {}

  likeJob(likedJobs: any, userId: string) {
    const likeJobData = { likedJobs: likedJobs, userId: userId };
    console.log(likeJobData);
    this.http.patch<{ message: string }>
      (API_URL + '/like', likeJobData).subscribe(
        response => {
          console.log(response);
        }
      );
  }
}