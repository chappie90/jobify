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
  private job: Job;
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
       console.log(this.job);
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
      })
    });
    this.form.setValue({
      'name': 'Stoyan Garov',
      'email': 'stoyan.garov@yahoo.com',
      'number': '07955443250'
    });
  }

}
