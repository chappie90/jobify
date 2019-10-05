import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../job.model';
import { JobsService } from '../../../services/jobs.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';
import { mimeType } from './mime-type.validator';

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
  private userId: string;
  private userEmail: string;
  private authDataAppliedJobs: string;
  private formSubmitted: boolean;
  private cvSelected: boolean;

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
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.form.patchValue({
      'name': 'Stoyan Garov',
      'email': 'stoyan.garov@yahoo.com',
      'number': '07955443250'
    });
    this.userId = this.authService.getAuthData().userId;
    this.userEmail = this.authService.getAuthData().userEmail;
    this.authDataAppliedJobs = this.authService.getAuthData().appliedJobs;
  }

  onChooseCVSelected(event: Event) {
    this.cvSelected = true;
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
      this.formSubmitted = true;
      return;
    }
    let newAppliedJobsArray = [];
    const applyDate: Date = new Date();
    const application = { jobId: this.job._id, applyDate: new Date() };
    if (this.authDataAppliedJobs) {
      const appliedJobsArray = JSON.parse(this.authDataAppliedJobs);
      newAppliedJobsArray = [...appliedJobsArray, application];
    } else {
      newAppliedJobsArray.push(application);
    }
    const newAppliedJobsString = JSON.stringify(newAppliedJobsArray);
    this.userService.applyJob(this.form.value.name, 
                              this.form.value.email, 
                              this.form.value.number, 
                              this.form.value.cv,
                              this.userId, 
                              newAppliedJobsString, 
                              this.job._id,
                              this.job.job_title,
                              this.job.company_name,
                              this.job.location,
                              this.job.salary);
  }

  ngOnDestroy() {
    if (this.jobSub) {
      this.jobSub.unsubscribe();
    }
  }

}
