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
  private filters: number;

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
            'location': params.location
          });
      }
    });
  }

  onSearch() {
    if (this.form.invalid) {
      return;
    }
    if (this.jobsSearch) {
        //  this.filterDateActive = form.value.date ? true : false;
      // this.filterDateActive = form.value.date === 'all-time' ? false : true;
      // this.filterTypeActive = form.value.full || 
      //                         form.value.part ||
      //                         form.value.contract ||
      //                         form.value.temporary ||
      //                         form.value.apprenticeship ||
      //                         form.value.volunteer
      //                       ;
      // this.filterSalaryActive = form.value.rangelow || 
      //                           form.value.rangemedium ||
      //                           form.value.range ||
      //                           form.value.rangehigh
      //                         ;
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
    // this.filterDateActive = false;
    // this.filterTypeActive = false;
    // this.filterSalaryActive = false;
    // form.controls['full'].reset();
    // form.controls['part'].reset();
    // form.controls['contract'].reset();
    // form.controls['temporary'].reset();
    // form.controls['apprenticeship'].reset();
    // form.controls['volunteer'].reset();
    // form.controls['rangelow'].reset();
    // form.controls['rangemedium'].reset();
    // form.controls['range'].reset();
    // form.controls['rangehigh'].reset();
  }

}
