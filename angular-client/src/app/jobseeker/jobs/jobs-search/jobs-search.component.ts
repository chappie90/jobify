import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-jobs-search',
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.scss']
})
export class JobsSearchComponent implements OnInit {
  private jobsSearch: boolean = false;

  constructor(private jobsService: JobsService) { }

  ngOnInit() {

  }

  onSearch(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.jobsSearch = true;
    this.jobsService.getJobs(1);
  }

}