import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { Job } from '../../../job.model';
import { JobsService } from '../../../services/jobs.service';


@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  form: FormGroup;
  private job: Job = {};
  private jobSub: Subscription;

  constructor(private jobsService: JobsService,
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
  }

  onChooseCVSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      cv: file
    });
    this.form.get('cv').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
  }

  onJobApply() {
    if (this.form.invalid) {
      return;
    }
    this.userService.applyJob(this.form.value.name, this.form.value.email, this.form.value.number, this.form.value.cv, 'test-userId', this.job._id);
  }

}
