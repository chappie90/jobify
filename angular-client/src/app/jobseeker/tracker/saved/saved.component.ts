import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { JobsService } from '../../../services/jobs.service';
import { AuthService } from '../../../auth/auth.service';
import { Job } from '../../job.model';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedJobsComponent implements OnInit {
  private jobsSub: Subscription;
  private savedJobs: Job[];

  constructor(private jobsService: JobsService,
              private authService: AuthService) { }

  ngOnInit() {
    this.likedJobs = this.authService.getAuthData().likedJobs.split(',');
    this.jobsService.getSavedJobs(this.likedJobs);
    this.jobsSub = this.jobsService.getSavedJobsUpdateListener().subscribe(
      savedJobs => {
        this.savedJobs = savedJobs.jobs;
        console.log(this.savedJobs);
      }
    );
  }

}