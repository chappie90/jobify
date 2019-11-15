import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from './user.model';

const API_URL = environment.API; 

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

  newJobseekerSession(userData: any) {
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
      const newNotifications = userData.newNotifications.toString();
      const summary = JSON.stringify(userData.summary);
      const experience = JSON.stringify(userData.experience);
      const education = JSON.stringify(userData.education);
      const avatar = userData.avatarPath;
      const cv = userData.cv;
      const cvName = userData.cvName;
      const date = new Date();
      const tokenExpireDate = new Date(
        date.getTime() + tokenExpiration * 1000
      );
      this.saveJobseekerAuthData(this.token, 
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
                        experience,
                        education,
                        avatar);
      this.router.navigate(['/']);
    }
  }

  newEmployerSession(employerData: any) {
    this.token = employerData.token;
    if (this.token) {
      const tokenExpiration = employerData.expiresIn;
      this.logoutOnTokenExpire(tokenExpiration);
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      this.userId = employerData.employerId;
      this.userEmail = employerData.employerEmail;
      const userType = employerData.userType;
      const postedJobs = JSON.stringify(employerData.postedJobs);
      const date = new Date();
      const tokenExpireDate = new Date(
        date.getTime() + tokenExpiration * 10000
      );
      this.saveEmployerAuthData(this.token,
                                tokenExpireDate,
                                this.userId,
                                this.userEmail,
                                userType,
                                postedJobs);
      this.router.navigate(['/']);
    }
  }

  createUser(email: string, password: string, type: string, company: string, ...args) {
    let route;
    if (type === 'jobseeker') {
      route = '/user/signup';
    }
    if (type === 'employer') {
      route = '/employer/signup';
    }
    const userData = { email: email, password: password, type: type, company: company };
    // this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any; appliedJobs: any; notifications: any}>
    this.http.post<any>
    (API_URL + route, userData).subscribe(
      response => {
        if (response.userType === 'employer') {
          this.newEmployerSession(response);
        }
        if (response.userType === 'jobseeker') {
          this.newJobseekerSession(response); 
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
    this.http.post<any>
      (API_URL + '/user' + '/login', loginData).subscribe(
      response => {
        this.newJobseekerSession(response);
      },
      error => {
        this.authStatusListener.next(false);
      }
    ); 
  }

  googleSignIn(email: string, token: string, type: string) {
    const googleSigninData = { email: email, token: token, type: 'jobseeker' };
    this.http.post<{ token: string; expiresIn: number; userId: string; likedJobs: any; appliedJobs: any; notifications: any }>
      (API_URL + '/user' + '/google-login', googleSigninData).subscribe(
        response => {
          this.newJobseekerSession(response);
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

  saveJobseekerAuthData(token: string, 
              tokenExpirationDate: Date, 
              userId: string, 
              userEmail: string, 
              userType: string,
              likedJobs: any, 
              appliedJobs: any, 
              notifications: any,
              newNotifications: string,
              cv: string,
              cvName: string,
              summary: any,
              experience: any,
              education: any,
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
    localStorage.setItem('experience', experience);
    localStorage.setItem('education', education);
    localStorage.setItem('avatar', avatar);
  }

  saveEmployerAuthData(token: string,
                       tokenExpirationDate: Date,
                       userId: string,
                       userEmail: string,
                       userType: string,
                       postedJobs) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenExpirationDate', tokenExpirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userType', userType);
    localStorage.setItem('postedJobs', postedJobs);
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
    const experience = localStorage.getItem('experience');
    const education = localStorage.getItem('education');
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
      experience: experience,
      education: education,
      avatar: avatar
    };
  }

  clearAuthData() {
    // All user types data
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userType');
    // Jobseeker user data
    localStorage.removeItem('likedJobs');
    localStorage.removeItem('appliedJobs');
    localStorage.removeItem('notifications');
    localStorage.removeItem('newNotifications');
    localStorage.removeItem('cv');
    localStorage.removeItem('cvName');
    localStorage.removeItem('summary');
    localStorage.removeItem('experience');
    localStorage.removeItem('education');
    localStorage.removeItem('avatar');
    localStorage.removeItem('skills');
    // Employer user data
    localStorage.removeItem('postedJobs');
  }


}