import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../job.model';
import { JobsService } from '../../../services/jobs.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private job: Job;
  private jobSub: Subscription;
  cvPreview: string;
  fileName: string;
  private userId: string;
  private userEmail: string;
  private authDataAppliedJobs: string;

  constructor(private jobsService: JobsService,
              private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const jobId = params.jobId;
      this.jobsService.getJobById(jobId);
    });
    this.jobSub = this.jobsService.getJobUpdateListener()
      .subscribe(job => {
       this.job = job;
      });
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required]
      }),
      'email': new FormControl(null, {
        validators: [Validators.required]
      }),
      'number': new FormControl(null, {
        validators: []
      }),
      cv: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.form.patchValue({
      'name': 'Stoyan Garov',
      'email': 'stoyan.garov@yahoo.com',
      'number': '07955443250'
    });
    this.userId = this.authService.getAuthData().userId;
    this.userEmail = this.authService.getAuthData().userEmail;
    console.log(this.userEmail);
    this.authDataAppliedJobs = this.authService.getAuthData().appliedJobs;
  }

  onChooseCVSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      cv: file
    });
    this.form.get('cv').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.cvPreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  onCVRemove() {
    this.form.patchValue({
      cv: ''
    });
  }

  onJobApply() {
    if (this.form.invalid) {
      return;
    }
    let newAppliedJobsArray = [];
    if (this.authDataAppliedJobs) {
      const appliedJobsArray = this.authDataAppliedJobs.split(',');
      newAppliedJobsArray = [...appliedJobsArray, this.job._id];
    } else {
      newAppliedJobsArray.push(this.job._id);
    }
    this.userService.applyJob(this.form.value.name, this.form.value.email, this.form.value.number, this.form.value.cv, this.userId, newAppliedJobsArray, this.job._id);
  }

  ngOnDestroy() {
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }

}
