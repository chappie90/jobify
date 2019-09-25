import { Component, OnInit, ViewChild } from '@angular/core';
import { 
  Router, 
  Event, 
  NavigationStart, 
  NavigationEnd, 
  NavigationError, 
  ActivatedRoute, 
  Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @ViewChild ('searchForm', {static: false}) form;

  private jobsSearch: boolean = false;
  private openDropdown: boolean = false;
  private filterDateActive: boolean = false;
  private filterTypeActive: boolean = false;
  private filterSalaryActive: boolean = false;
  private filters: number;
  
  sForm = {
    date: 'all-time'
  };

  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.jobsSearch = this.router.url === ('/jobs/search');
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Show loading indicator
        this.jobsSearch = event.url === ('/jobs/search');
        console.log(this.jobsSearch);
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
  }

  onSearch(form: NgForm) {
  //  this.filterDateActive = form.value.date ? true : false;
    // this.filterDateActive = form.value.date === 'all-time' ? false : true;
    this.filterTypeActive = form.value.full || 
                            form.value.part ||
                            form.value.contract ||
                            form.value.temporary ||
                            form.value.apprenticeship ||
                            form.value.volunteer
                          ;
    this.filterSalaryActive = form.value.rangelow || 
                              form.value.rangemedium ||
                              form.value.range ||
                              form.value.rangehigh
                            ;
    this.jobsService.getJobs(form.value, 1);
    // Add search query parameters
    // Make sure all browsers support object spread operator
    let queryParams: Params = {};
    if (form.value.title) {
      queryParams = { ...queryParams, title: form.value.title };
    }
    if (form.value.location) {
      queryParams = { ...queryParams, location: form.value.location };
    }
    this.router.navigate(
      ['/jobs/search'],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    );
  }

  onClearFilters(form: NgForm) {
    // refactor!
    this.filterDateActive = false;
    this.filterTypeActive = false;
    this.filterSalaryActive = false;
    form.controls['full'].reset();
    form.controls['part'].reset();
    form.controls['contract'].reset();
    form.controls['temporary'].reset();
    form.controls['apprenticeship'].reset();
    form.controls['volunteer'].reset();
    form.controls['rangelow'].reset();
    form.controls['rangemedium'].reset();
    form.controls['range'].reset();
    form.controls['rangehigh'].reset();
  }

}
