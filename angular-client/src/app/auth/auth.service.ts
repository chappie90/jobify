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

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  newUserSession(userData: any) {
    console.log(userData);
    this.token = userData.token;
    if (this.token) {
      const tokenExpiration = userData.expiresIn;
      this.logoutOnTokenExpire(tokenExpiration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.userId = userData.userId;
      this.userEmail = userData.userEmail;
      const userType =userData.userType;
      const likedJobs = JSON.stringify(userData.myJobs.saved);
      const appliedJobs = JSON.stringify(userData.myJobs.applied);
      const notifications = JSON.stringify(userData.notifications);
      const newNotifications = userData.newNotifications;
      const summary = JSON.stringify(userData.summary);
      const avatar = userData.avatarPath;
      const cv = userData.cv;
      const cvName = userData.cvName;
      const date = new Date();
      const tokenExpireDate = new Date(
        date.getTime() + tokenExpiration * 1000
      );
      this.saveAuthData(this.token, 
                            tokenExpireDate, 
                            this.userId, 
                            this.userEmail, 
                            userType,
                            likedJobs, 
                            appliedJobs, 
                            notifications,
                            newNotifications,
                            cv,
                            cvName,
                            summary,
                            avatar);
      this.router.navigate(['/']);
    }
  }

  createUser(email: string, password: string, type: string) {
    const userData = { email: email, password: password, type: type };
    // this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any; appliedJobs: any; notifications: any}>
    this.http.post<any>
    (API_URL + '/signup', userData).subscribe(
      response => {
        this.newUserSession(response); 
      },
      error => {
        // console.log(error);
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const loginData = { email: email, password: password };
    this.http.post<any>
      (API_URL + '/login', loginData).subscribe(
      response => {
        console.log(response);
        this.newUserSession(response);
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
          this.newUserSession(response);
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

  saveAuthData(token: string, 
              tokenExpirationDate: Date, 
              userId: string, 
              userEmail: string, 
              userType: string,
              likedJobs: any, 
              appliedJobs: any, 
              notifications: any,
              newNotifications: number,
              cv: string,
              cvName: string,
              summary: any,
              avatar) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userType', userType);
    localStorage.setItem('likedJobs', likedJobs);
    localStorage.setItem('appliedJobs', appliedJobs);
    localStorage.setItem('notifications', notifications);
    localStorage.setItem('newNotifications', newNotifications);
    localStorage.setItem('cv', cv);
    localStorage.setItem('cvName', cvName);
    localStorage.setItem('summary', summary);
    localStorage.setItem('avatar', avatar);
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const userType = localStorage.getItem('userType');
    const likedJobs = localStorage.getItem('likedJobs');
    const appliedJobs = localStorage.getItem('appliedJobs');
    const notifications = localStorage.getItem('notifications');
    const newNotifications = localStorage.getItem('newNotifications');
    const cv = localStorage.getItem('cv');
    const cvName = localStorage.getItem('cvName');
    const summary = localStorage.getItem('summary');
    const avatar = localStorage.getItem('avatar');

    if (!token || !tokenExpirationDate) {
      return;
    }
    return {
      token: token,
      tokenExpirationDate: new Date(tokenExpirationDate),
      userId: userId,
      userEmail: userEmail,
      userType: userType,
      likedJobs: likedJobs,
      appliedJobs: appliedJobs,
      notifications: notifications,
      newNotifications: newNotifications,
      cv: cv,
      cvName: cvName,
      summary: summary,
      avatar: avatar
    };
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    localStorage.removeItem('likedJobs');
    localStorage.removeItem('appliedJobs');
    localStorage.removeItem('notifications');
    localStorage.removeItem('newNotifications');
    localStorage.removeItem('cv');
    localStorage.removeItem('cvName');
    localStorage.removeItem('summary');
    localStorage.removeItem('avatar');
  }


}