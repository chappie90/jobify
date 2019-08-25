import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const API_URL = environment.API + '/user'; 

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient,
              private router: Router) {}

  createUser(email: string, password: string) {
    const signupData = { email: email, password: password };
    this.http.post(API_URL + '/signup', signupData).subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);
      }
    );
  }
}