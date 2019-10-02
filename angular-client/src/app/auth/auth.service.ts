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
  private userEmail: string;
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
    this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any; appliedJobs: any; notifications: any}>
    (API_URL + '/signup', userData).subscribe(
      (response) => {
        this.token = response.token;
        if (this.token) {
          const tokenExpiration = response.expiresIn;
          this.logoutOnTokenExpire(tokenExpiration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId;
          this.userEmail = response.userEmail;
          const likedJobs = response.likedJobs;
          const notifications = JSON.stringify(response.notifications);
          const appliedJobs = JSON.stringify(response.appliedJobs);
          const date = new Date();
          const tokenExpireDate = new Date(
            date.getTime() + tokenExpiration * 1000
          );
          this.saveAuthData(this.token, tokenExpireDate, this.userId, this.userEmail, likedJobs, appliedJobs, notifications);
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
    this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any; appliedJobs: any; notifications: any }>
      (API_URL + '/login', loginData).subscribe(
      response => {
        this.token = response.token;
        if (this.token) {
          const tokenExpiration = response.expiresIn;
          this.logoutOnTokenExpire(tokenExpiration);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.userId = response.userId;
          this.userEmail = response.userEmail;
          const likedJobs = response.likedJobs;
          const notifications = JSON.stringify(response.notifications);
          const appliedJobs = JSON.stringify(response.appliedJobs);
          const date = new Date();
          const tokenExpireDate = new Date(
            date.getTime() + tokenExpiration * 1000
          );
          this.saveAuthData(this.token, tokenExpireDate, this.userId, this.userEmail, likedJobs, appliedJobs, notifications);
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
    this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any; appliedJobs: any; notifications: any }>
      (API_URL + '/google-login', googleSigninData).subscribe(
        response => {
          this.token = response.token;
          if (this.token) {
            const tokenExpiration = response.expiresIn;
            this.logoutOnTokenExpire(tokenExpiration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.userId = response.userId;
            this.userEmail = response.userEmail;
            const likedJobs = response.likedJobs;
            const notifications = JSON.stringify(response.notifications);
            const appliedJobs = JSON.stringify(response.appliedJobs);
            const date = new Date();
            const tokenExpireDate = new Date(
              date.getTime() + tokenExpiration * 1000
            );
            this.saveAuthData(this.token, tokenExpireDate, this.userId, this.userEmail, likedJobs, appliedJobs, notifications);
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
    this.userEmail = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  logoutOnTokenExpire(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  saveAuthData(token: string, tokenExpirationDate: Date, userId: string, userEmail: string, likedJobs: any, appliedJobs: any, notifications: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('likedJobs', likedJobs);
    localStorage.setItem('appliedJobs', appliedJobs);
    localStorage.setItem('notifications', notifications);
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const likedJobs = localStorage.getItem('likedJobs');
    const appliedJobs = localStorage.getItem('appliedJobs');
    const notifications = localStorage.getItem('notifications');

    console.log(notifications); 

    if (!token || !tokenExpirationDate) {
      return;
    }
    return {
      token: token,
      tokenExpirationDate: new Date(tokenExpirationDate),
      userId: userId,
      userEmail: userEmail,
      likedJobs: likedJobs,
      appliedJobs: appliedJobs,
      notifications: notifications
    };
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('likedJobs');
    localStorage.removeItem('appliedJobs');
    localStorage.removeItem('notifications');
  }


}