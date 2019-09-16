import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from './user.model';

const API_URL = environment.API + '/user'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient,
              private router: Router) {}

  getToken() {
    return this.token;
  }

  // getUserId() {
  //   return this.userId;
  // }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, type: string) {
    const userData = { email: email, password: password, type: 'jobseeker' };
    this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any}>
    (API_URL + '/signup', userData).subscribe(
      (response) => {
        this.token = response.token;
        if (this.token) {
          const tokenExpiration = response.expiresIn;
          this.logoutOnTokenExpire(tokenExpiration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId;
          const likedJobs = response.likedJobs;
          const date = new Date();
          const tokenExpireDate = new Date(
            date.getTime() + tokenExpiration * 1000
          );
          this.saveAuthData(this.token, tokenExpireDate, this.userId, likedJobs);
          this.router.navigate(['/'])
        }
      },
      error => {
        // console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    this.http.post<{ token: string; expiresIn: number; userId: string; }>
      (API_URL + '/login', loginData).subscribe(
      response => {
        this.token = response.token;
        if (this.token) {
          const tokenExpiration = response.expiresIn;
          this.logoutOnTokenExpire(tokenExpiration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId;
          const likedJobs = response.likedJobs;
          const date = new Date();
          const tokenExpireDate = new Date(
            date.getTime() + tokenExpiration * 1000
          );
          this.saveAuthData(this.token, tokenExpireDate, this.userId, likedJobs);
          this.router.navigate(['/']);
        }
      },
      error => {
        this.authStatusListener.next(false);
      }
    ); 
  }

  googleSignIn(email: string, token: string, type: string) {
    const googleSigninData = { email: email, token: token, type: 'jobseeker' };
    this.http.post<{ token: string; expiresIn: number; userId: string; }>
      (API_URL + '/google-login', googleSigninData).subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            const tokenExpiration = response.expiresIn;
            this.logoutOnTokenExpire(tokenExpiration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.userId;
            const likedJobs = response.likedJobs;
            const date = new Date();
            const tokenExpireDate = new Date(
              date.getTime() + tokenExpiration * 1000
            );
            this.saveAuthData(this.token, tokenExpireDate, this.userId, likedJobs);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  logoutOnTokenExpire(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  saveAuthData(token: string, tokenExpirationDate: Date, userId: string, likedJobs: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('likedJobs', likedJobs);
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    const userId = localStorage.getItem('userId');
    const likedJobs = localStorage.getItem('likedJobs');
    console.log(likedJobs);
    if (!token || !tokenExpirationDate || !likedJobs) {
      return;
    }
    return {
      token: token,
      tokenExpirationDate: new Date(tokenExpirationDate),
      userId: userId,
      likedJobs: likedJobs
    };
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('likedJobs');
  }


}