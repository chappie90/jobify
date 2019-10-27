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
import { Subscription } from 'rxjs';

import { CompleterService, CompleterData } from 'ng2-completer';
import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  form: FormGroup;
  protected city: string;
  private title: string;
  private jobsSearch: boolean = false;
  private openDropdown: boolean = false;
  private filterDateActive: boolean = false;
  private filterTypeActive: boolean = false;
  private filterSalaryActive: boolean = false;
  private filtersCount: number = 0;
  private titlesSub: Subscription;
  private titles: any;

  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    // this.titlesSub = this.jobsService.getAutoCompleteTitles().subscribe(response => {
    //   this.titles = response.jobs.jobs.map(t => t.job_title);
    // });
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
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
      'title': new FormControl('', {
        validators: []
      }),
      'location': new FormControl('', {
        validators: []
      }),
      'date': new FormControl('all-time', {
        validators: []
      }),
      'full': new FormControl('', {
        validators: []
      }),
      'part': new FormControl('', {
        validators: []
      }),
      'contract': new FormControl('', {
        validators: []
      }),
      'temporary': new FormControl('', {
        validators: []
      }),
      'apprenticeship': new FormControl('', {
        validators: []
      }),
      'volunteer': new FormControl('', {
        validators: []
      }),
      'rangelow': new FormControl('', {
        validators: []
      }),
      'rangemedium': new FormControl('', {
        validators: []
      }),
      'range': new FormControl('', {
        validators: []
      }),
      'rangehigh': new FormControl('', {
        validators: []
      }),
    });
    this.route.queryParams.subscribe(params => {
      this.jobsSearch = this.router.url.includes('/jobs/search');
       if (this.jobsSearch && this.form) {
        let title = params.title;
        let location = params.location;
        let date = params.date;
        let pageNumber = params.pageNumber;
        if (!title) {
          title = '';
        }
        if (!location) {
          location = '';
        }
        if (!date) {
          date = 'all-time';
        }
        if (!pageNumber) {
          pageNumber = 1;
        }
        const jobsQueryData = { 
          title: title, 
          location: location, 
          date: date 
        }; 
        this.jobsService.getJobs(jobsQueryData, pageNumber);
        this.form.patchValue({
          'title': title,
          'location': location,
          'date': date
        });
      }
    });
  }

  onSearch() {
    if (this.form.invalid) {
      return;
    }
    // if (this.jobsSearch) {
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
   // }

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
      'full': '',
      'part': '',
      'contract': '',
      'temporary': '',
      'apprenticeship': '',
      'volunteer': '',
      'rangelow': '',
      'rangemedium': '',
      'range': '',
      'rangehigh': ''
    });
    this.filterDateActive = false;
    this.filterTypeActive = false;
    this.filterSalaryActive = false;
  }

  // cities = [
  //   'Birmingham', 
  //   'Bradford', 
  //   'Bristol', 
  //   'Edinburgh', 
  //   'Glasgow', 
  //   'Leeds', 
  //   'Liverpool', 
  //   'London', 
  //   'Manchester',
  //   'Newcastle',
  //   'Nottingham',
  //   'Portsmouth',
  //   'Sheffield',
  //   'Southhampton'
  // ];

  // getTitles(title) {
  //   this.jobsService.getJobTitles(title);
  // }

  // titleChanged(title) {
  //   this.form.patchValue({
  //     'title': title
  //   });
  // }

  // cityChanged(city) {
  //   this.form.patchValue({
  //     'location': city
  //   });
  // }

}
