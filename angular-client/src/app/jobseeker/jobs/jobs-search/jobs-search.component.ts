import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Job } from '../job.model';
import { JobsService } from '../../../services/jobs.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-jobs-search',
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.scss']
})
export class JobsSearchComponent implements OnInit {
  private job: Job = {};
  private applyStatus: boolean;

  constructor(private jobsService: JobsService,
              private userService: UserService,
              private router: Router,
              private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
        let title = params.title;
        let location = params.location;
        let pageNumber = params.pageNumber;
        if (!title) {
          title = '';
        }
        if (!location) {
          location = '';
        }
        if (!pageNumber) {
          pageNumber = 1;
        }
        this.jobsService.getJobs({title: title, location: location}, pageNumber);
    });
  }
  
  ngOnInit() {
    this.applyStatus = this.userService.returnApplyStatus();
    if (this.applyStatus) {
      setTimeout(() => {
        this.applyStatus = false;
      }, 4000);
    }   
  }
}
