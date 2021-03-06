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
  private avatarUpdated = new Subject<{ status: boolean }>();
  private userUpdated = new Subject<{ jobStatus: boolean, likedJobId: string, appliedJobs: string, cvPath: string, cvName: string, status: boolean}>();
  private notificationsUpdated = new Subject<boolean>();
  private userEducationUpdated = new Subject<boolean>();
  private userExperienceUpdated = new Subject<boolean>();
  private skillsUpdated = new Subject<boolean>();
  private savedJobsUpdated = new Subject<boolean>();
  private applyStatus: boolean;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthService) {}

  likeJob(jobId: string, jobStatus: boolean, likedJobs: any, userId: string) {
    const likeJobData = { likedJobs: likedJobs, userId: userId, jobId: jobId, jobStatus: jobStatus };
    // this.http.patch<{ user: any; likedJobs: any; jobStatus: boolean; jobId: string; updatedJobId: string }>
    this.http.patch<any> 
      (API_URL + '/like', likeJobData).subscribe(
        response => {
          const jobStatus = response.jobStatus;
          const updatedLikedJobs = JSON.stringify(response.user.myJobs.saved);
          const updatedJobId = response.jobId;
          localStorage.setItem('likedJobs', updatedLikedJobs);
          this.userUpdated.next({ jobStatus: jobStatus, likedJobId: updatedJobId });
        }
      );
  }

  removeSavedJob(jobId: string, userId: string) {
    const jobData = { jobId: jobId, userId: userId };
    this.http.post<any>(
      API_URL + '/like/remove', jobData
    ).subscribe(response => {
      const oldSavedJobs = JSON.parse(localStorage.getItem('likedJobs'));
      let newSavedJobs = oldSavedJobs.filter(job => job !== response.jobId);
      newSavedJobs = JSON.stringify(newSavedJobs);
      localStorage.setItem('likedJobs', newSavedJobs);
      this.savedJobsUpdated.next(true);
    });
  }

  uploadCv(cv: File, userId: string) {
    let cvData = new FormData();
    cvData.append('cv', cv);
    cvData.append('userId', userId);
    this.http.post<any>(
      API_URL + '/cv/upload', cvData
    ).subscribe(response => {
      localStorage.setItem('cv', response.cv);
      localStorage.setItem('cvName', response.cvName);
      this.router.navigate(['/profile/cv']);
    });
  }

  deleteCv(id: string) {
    const userId = { userId: id };
    this.http.patch<any>(
      API_URL + '/cv/delete', userId
    ).subscribe(response => {
      this.userUpdated.next({ cvPath: '', cvName: '' });
      localStorage.removeItem('cv');
      localStorage.removeItem('cvName');
    });
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
    this.http.post<any>(
      API_URL + '/apply', applicationData
    ).subscribe(response => {
      const queryParams = { apply: 'success'};
      this.applyStatus = true;
      localStorage.setItem('appliedJobs', JSON.stringify(response.appliedJobs));
      localStorage.setItem('notifications', JSON.stringify(response.notifications));
      localStorage.setItem('newNotifications', response.newNotifications);
      this.notificationsUpdated.next(true);
      this.router.navigate(
        ['/jobs/search'],
        {
          queryParams: queryParams,
          queryParamsHandling: 'merge'
        }
      );
    });  
  }

  updateSummary(formData: any, userId: string) {
    const summaryData = { formData: formData, userId: userId };
    this.http.post<any>(
      API_URL + '/profile/summary', summaryData
    ).subscribe(response => {
      localStorage.setItem('summary', JSON.stringify(response.summary));
      this.userUpdated.next({ status: true });
    });
  }

  updateAvatar(formData: any, userId: string) {
    let avatarData = new FormData();
    avatarData.append('avatar', formData.avatar);
    avatarData.append('userId', userId);
    this.http.post<any>(
      API_URL + '/profile/summary/avatar', avatarData
    ).subscribe(response => {
      localStorage.setItem('avatar', response.avatarPath);
      this.avatarUpdated.next({ status: true });
    });
  }

  updateExperience(formGroupId: string, formData: any,userId: string) {
    const experienceData = { formGroupId: formGroupId, formData: formData, userId: userId };
    console.log(experienceData);  
    this.http.post<any>(
      API_URL + '/profile/experience', experienceData
    ).subscribe(response => {
      localStorage.setItem('experience', JSON.stringify(response.experience));
      this.userExperienceUpdated.next(true);
    });
  }

  deleteExperience(formGroupId: string, userId: string) {
    const experienceData = { formGroupId: formGroupId, userId: userId };
    this.http.post<any>(
      API_URL + '/profile/experience/remove', experienceData
    ).subscribe(response => {
      localStorage.setItem('experience', JSON.stringify(response.experience));
      this.userExperienceUpdated.next(true);
    });
  }

  updateEducation(formGroupId: string, formData: any, userId: string) {
    const educationData = { formGroupId: formGroupId, formData: formData, userId: userId };
    this.http.post<any>(
      API_URL + '/profile/education', educationData
    ).subscribe(response => {
      localStorage.setItem('education', JSON.stringify(response.education));
      this.userEducationUpdated.next(true);
    });
  }

  deleteEducation(formGroupId: string, userId: string) {
    const educationData = { formGroupId: formGroupId, userId: userId };
    this.http.post<any>(
      API_URL + '/profile/education/remove', educationData
    ).subscribe(response => {
      localStorage.setItem('education', JSON.stringify(response.education));
      this.userEducationUpdated.next(true);
    });
  }

  clearNotifications(userId: string) {
    const userData = { userId: userId };
    this.http.post<any>(
      API_URL + '/notifications/clear', userData
    ).subscribe(response => {
      localStorage.setItem('newNotifications', response.newNotifications);
      this.notificationsUpdated.next(true);
    });
  }

  addSkill(formData: any, userId: string) {
    const skillsData = { formData: formData, userId: userId };
    this.http.post<any>(
      API_URL + '/profile/skills', skillsData
    ).subscribe(response => {
      const skills = JSON.stringify(response.skills);
      localStorage.setItem('skills', skills);
      this.skillsUpdated.next(true);
    });  
  }

  removeSkill(skillId: string, userId: string) {
    const skillsData = { skillId: skillId, userId: userId };
    this.http.post<any>(
      API_URL + '/profile/skills/remove', skillsData
    ).subscribe(response => {
      const oldSkills = JSON.parse(localStorage.getItem('skills'));
      let newSkills = oldSkills.filter(skill => skill._id !== skillId);
      newSkills = JSON.stringify(newSkills);
      localStorage.setItem('skills', newSkills);
      this.skillsUpdated.next(true);
    });
  }

  getUserEducationUpdateListener() {
    return this.userEducationUpdated.asObservable();
  }

  getUserExperienceUpdateListener() {
    return this.userExperienceUpdated.asObservable();
  }

  getSkillsUpdateListener() {
    return this.skillsUpdated.asObservable();
  }

  getSavedJobsUpdateListener() {
    return this.savedJobsUpdated.asObservable();
  }

  getNotificationsUpdateListener() {
    return this.notificationsUpdated.asObservable();
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable();
  }

  getAvatarUpdateListener() {
    return this.avatarUpdated.asObservable();
  }

  returnApplyStatus() {
    return this.applyStatus;
  }

}