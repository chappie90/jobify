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
  private searchPristine: boolean = true;
  private openDropdown: boolean = false;
  private filterDateActive: boolean = false;
  private filterTypeActive: boolean = false;
  private filterSalaryActive: boolean = false;
  private filtersCount: number = 0;
  private titlesSub: Subscription;
  private jobsSub: Subscription;
  private titles: any;
  private salaryMinVal: number;
  private salaryMaxVal: number;

  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    // this.titlesSub = this.jobsService.getAutoCompleteTitles().subscribe(response => {
    //   this.titles = response.jobs.jobs.map(t => t.job_title);
    // });
    this.salaryMinVal = 0;
    this.salaryMaxVal = 300000;
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
      'salaryMin': new FormControl(0, {

      }),
      'salaryMax': new FormControl(300000, {

      })
    });
    this.route.queryParams.subscribe(params => {
      this.jobsSearch = this.router.url.includes('/jobs/search');
       if (this.jobsSearch && this.searchPristine && this.form) {
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

  ngAfterViewInit() { 
    this.dropDown();
    this.rangeSlider();
    const rangeMin = document.getElementById('lower');
    const rangeMax = document.getElementById('upper');
    const tooltipMin = document.querySelector('.tooltip-min-wrapper');
    const tooltipMax = document.querySelector('.tooltip-max-wrapper');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    let ratioMin = (rangeMin.value - rangeMin.min) / (rangeMin.max - rangeMin.min);
    let ratioMax = (rangeMax.value - rangeMax.min) / (rangeMax.max - rangeMax.min);

    tooltipMin.style.left = ratioMin * 328 + 'px';
    tooltipMax.style.right = ratioMax + 12 + 'px';

    tooltipMinBar.style.left = ratioMin * 328 + 'px';
    tooltipMaxBar.style.right = ratioMax + 12 + 'px';
  }

  onSalaryMinChange(minValue, maxValue) {
    this.salaryMinVal = minValue.value;
    this.salaryMaxVal = maxValue.value;

    const thumbSize = 15;
    const tooltipMin = document.querySelector('.tooltip-min-wrapper');
    const tooltipMax = document.querySelector('.tooltip-max-wrapper');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');

    let ratioMin = (this.salaryMinVal - minValue.min) / (minValue.max - minValue.min);
    let ratioMax = (this.salaryMaxVal - maxValue.min) / (maxValue.max - maxValue.min);
    tooltipMin.style.left = ratioMin * 328 + 'px';
    tooltipMax.style.right = ratioMax + 12 + 'px';

    tooltipMinBar.style.left = ratioMin * 328 + 'px';
    tooltipMinBar.style.right = ratioMax + 12 + 'px';

    tooltipMaxBar.style.left = ratioMin * 328 + 'px'
    tooltipMaxBar.style.right = ratioMax + 12 + 'px';
  }

  onSalaryMaxChange(maxValue, minValue) {
    this.salaryMaxVal = maxValue.value;
    this.salaryMinVal = minValue.value;

    const thumbSize = 15;
    const tooltipMin = document.querySelector('.tooltip-min-wrapper');
    const tooltipMax = document.querySelector('.tooltip-max-wrapper');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    
    let ratioMin = (this.salaryMinVal - minValue.min) / (minValue.max - minValue.min);
    let ratioMax = (this.salaryMaxVal - maxValue.min) / (maxValue.max - maxValue.min);
    tooltipMin.style.left = ratioMin * 328 + 'px';
    tooltipMax.style.right = ratioMax + 12 + 'px';

    tooltipMinBar.style.left = ratioMin * 328 + 'px';
    tooltipMinBar.style.right = ratioMax + 12 + 'px';

    tooltipMaxBar.style.left = ratioMin * 328 + 'px'
    tooltipMaxBar.style.right = ratioMax + 12 + 'px';
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
      this.filterSalaryActive = this.form.value.salaryMin || 
                                this.form.value.salaryMax;
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
      this.searchPristine = false;
   // }

    // Add search query parameters
    // Make sure all browsers support object spread operator
    let queryParams: Params = {};
    let type = [];
    if (this.form.value.title) {
      queryParams = { ...queryParams, title: this.form.value.title };
    }
    if (this.form.value.location) {
      queryParams = { ...queryParams, location: this.form.value.location };
    }
    if (this.form.value.date) {
      queryParams = { ...queryParams, date: this.form.value.date };
    }
    if (this.form.value.full) {
      type.push('fullTime');
      queryParams = { ...queryParams, type: type };
    }
    if (this.form.value.part) {
      type.push('partTime');
      queryParams = { ...queryParams, type: type };
    }
    if (this.form.value.contract) {
      type.push('contract');
      queryParams = { ...queryParams, type: type };
    }
    if (this.form.value.temporary) {
      type.push('temporary');
      queryParams = { ...queryParams, type: type };
    }
    if (this.form.value.apprenticeship) {
      type.push('apprenticeship');
      queryParams = { ...queryParams, type: type };
    }
    if (this.form.value.volunteer) {
      type.push('volunteer');
      queryParams = { ...queryParams, type: type };
    }
    if (this.form.value.salaryMin) {
      queryParams = { ...queryParams, salaryMin: this.form.value.salaryMin };
    }
    if (this.form.value.salaryMax) {
      queryParams = { ...queryParams, salaryMax: this.form.value.salaryMax };
    }
    this.router.navigate(
      ['/jobs/search'],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    );
  }

  rangeSlider() {
    //  // const thumbSize = -240;
    // const thumbSize = 15;
    // const rangeMin = document.getElementById('lower');
    // const rangeMax = document.getElementById('upper');
    // const tooltipMin = document.querySelector('.tooltip-min-wrapper');
    // const tooltipMax = document.querySelector('.tooltip-max-wrapper');
    // const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    // const tooltipMaxBar = document.querySelector('.tooltip-max-bar');

    // let ratioMin;
    // let ratioMax;

  // rangeMin.addEventListener('input', e => {
  //   ratioMin = (rangeMin.value - rangeMin.min) / (rangeMin.max - rangeMin.min);
  //   ratioMax = (rangeMax.value - rangeMax.min) / (rangeMax.max - rangeMax.min);
  //   tooltipMin.style.left = ratioMin * 318 - 12 + 'px';
  //   tooltipMinBar.style.left = ratioMin * 318 - 12 + 44 + 'px';
  //   tooltipMinBar.style.right = tooltipMaxBar.style.left;
  //   console.log(tooltipMaxBar.style.left);
  // });
  // rangeMax.addEventListener('input', e => {
  //   ratioMax = (rangeMax.value - rangeMax.min) / (rangeMax.max - rangeMax.min);
  //   ratioMin = (rangeMin.value - rangeMin.min) / (rangeMin.max - rangeMin.min);
  //   tooltipMax.style.left = ratioMax * 318 + 15 + 'px';
  //   // tooltipMaxBar.style.left = ratioMin * 321 - 5 + 'px';
  //   // tooltipMaxBar.style.right = ratioMax * 335 + 'px';
  // });
    let lowerSlider = document.querySelector('#lower');
    let upperSlider = document.querySelector('#upper');
    let lowerVal = parseInt(lowerSlider.value);
    let upperVal = parseInt(upperSlider.value);

    upperSlider.oninput = function() {
       lowerVal = parseInt(lowerSlider.value);
       upperVal = parseInt(upperSlider.value);
       
       if (upperVal < lowerVal + 4) {
          lowerSlider.value = upperVal - 4;
          
          if (lowerVal == lowerSlider.min) {
             upperSlider.value = 4;
          }
       }
    };

    lowerSlider.oninput = function() {
       lowerVal = parseInt(lowerSlider.value);
       upperVal = parseInt(upperSlider.value);
       
       if (lowerVal > upperVal - 4) {
          upperSlider.value = lowerVal + 4;
          
          if (upperVal == upperSlider.max) {
             lowerSlider.value = parseInt(upperSlider.max) - 4;
          }

       }
    };
  }

  dropDown() {
    let filtersArray = document.querySelectorAll('.search__filters-item-title');
    for (let i = 0; i < filtersArray.length; i++) {
      filtersArray[i].addEventListener('click', function() {
        for (let x = 0; x < filtersArray.length; x++) {
          if (filtersArray[i] !== filtersArray[x]) {
            filtersArray[x].nextElementSibling.classList.remove('open-dropdown');
          }
        }
        filtersArray[i].nextElementSibling.classList.toggle('open-dropdown');
      });
    }
    let itemsArray = document.querySelectorAll('.search__filters-item');
    document.addEventListener('click', function(event) {
      for (let i = 0; i < itemsArray.length; i++) {
        if (itemsArray[i].contains(event.target)) return;
        itemsArray[i].querySelector('.search__filters-content').classList.remove('open-dropdown');
      }
    });
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
      'salaryMin': 0,
      'salaryMax': 300000
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
