import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { 
  Router, 
  Event, 
  NavigationStart, 
  NavigationEnd, 
  NavigationError, 
  ActivatedRoute, 
  Params } from '@angular/router';

import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  form: FormGroup;
  private jobsSearch: boolean = false;
  private openDropdown: boolean = false;
  private filterDateActive: boolean = false;
  private filterTypeActive: boolean = false;
  private filterSalaryActive: boolean = false;
  private filtersCount: number = 0;

  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log(event);
        // Show loading indicator
        this.jobsSearch = event.url.includes('/jobs/search');
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator

        // Present error to user
        console.log(event.error);
      }
    });
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: []
      }),
      'location': new FormControl(null, {
        validators: []
      }),
      'date': new FormControl(null, {
        validators: []
      }),
      'full': new FormControl(null, {
        validators: []
      }),
      'part': new FormControl(null, {
        validators: []
      }),
      'contract': new FormControl(null, {
        validators: []
      }),
      'temporary': new FormControl(null, {
        validators: []
      }),
      'apprenticeship': new FormControl(null, {
        validators: []
      }),
      'volunteer': new FormControl(null, {
        validators: []
      }),
      'rangelow': new FormControl(null, {
        validators: []
      }),
      'rangemedium': new FormControl(null, {
        validators: []
      }),
      'range': new FormControl(null, {
        validators: []
      }),
      'rangehigh': new FormControl(null, {
        validators: []
      }),
    });
    this.route.queryParams.subscribe(params => {
      this.jobsSearch = this.router.url.includes('/jobs/search');
        if (this.jobsSearch && this.form) {
          this.form.patchValue({
            'title': params.title,
            'location': params.location,
            'date': params.date
          });
      }
    });
  }

  onSearch() {
    if (this.form.invalid) {
      return;
    }
    if (this.jobsSearch) {
      this.filterDateActive = this.form.value.date !== 'all-time' ? true : false;
      this.filterTypeActive = this.form.value.full || 
                              this.form.value.part ||
                              this.form.value.contract ||
                              this.form.value.temporary ||
                              this.form.value.apprenticeship ||
                              this.form.value.volunteer;
      this.filterSalaryActive = this.form.value.rangelow || 
                                this.form.value.rangemedium ||
                                this.form.value.range ||
                                this.form.value.rangehigh;
      // if (this.filterDateActive) {
      //   this.filtersCount++;
      // }
      // if (this.filterTypeActive) {
      //   this.filtersCount++;
      // }
      // if (this.filterSalaryActive) {
      //   this.filtersCount++;
      // }
      this.jobsService.getJobs(this.form.value, 1);
    }

    // Add search query parameters
    // Make sure all browsers support object spread operator
    let queryParams: Params = {};
    if (this.form.value.title) {
      queryParams = { ...queryParams, title: this.form.value.title };
    }
    if (this.form.value.location) {
      queryParams = { ...queryParams, location: this.form.value.location };
    }
    if (this.form.value.date) {
      queryParams = { ...queryParams, date: this.form.value.date };
    }
    this.router.navigate(
      ['/jobs/search'],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    );
  }

  onClearFilters() {
    // refactor!
    this.form.patchValue({
      'date': 'all-time',
      'full': null,
      'part': null,
      'contract': null,
      'temporary': null,
      'apprenticeship': null,
      'volunteer': null,
      'rangelow': null,
      'rangemedium': null,
      'range': null,
      'rangehigh': null
    });
    this.filterDateActive = false;
    this.filterTypeActive = false;
    this.filterSalaryActive = false;
  }

}
