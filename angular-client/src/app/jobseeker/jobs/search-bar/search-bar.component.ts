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
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          this.searchPristine = false;
       //   console.log(document.getElementById('jobs-list').scrollTop);
        }
    );
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
        let type = params.type;
        let fullTime, partTime, contract, temporary, apprenticeship, volunteer;
        let salaryMin = params.salaryMin;
        let salaryMax = params.salaryMax;
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
        if (!type) {
          type = [];
        }
        fullTime = type.includes('fullTime') ? true : '';
        partTime = type.includes('partTime') ? true : '';
        contract = type.includes('contract') ? true : '';
        temporary = type.includes('temporary') ? true : '';
        apprenticeship = type.includes('apprenticeship') ? true : '';
        volunteer = type.includes('volunteer') ? true : '';
        if (!salaryMin) {
          salaryMin = 0;
        }
        if (!salaryMax) {
          salaryMax = 300000;
        }
        if (!pageNumber) {
          pageNumber = 1;
        }
        const jobsQueryData = { 
          title: title, 
          location: location, 
          date: date,
          full: fullTime,
          part: partTime,
          contract: contract,
          temporary: temporary,
          apprenticeship: apprenticeship,
          volunteer: volunteer,
          salaryMin: salaryMin,
          salaryMax: salaryMax
        }; 
        this.jobsService.getJobs(jobsQueryData, pageNumber);
        this.form.patchValue({
          'title': title,
          'location': location,
          'date': date,
          'full': fullTime,
          'part': partTime,
          'contract': contract,
          'temporary': temporary,
          'apprenticeship': apprenticeship,
          'volunteer': volunteer,
          'salaryMin': salaryMin,
          'salaryMax': salaryMax
        });
      }
    });
  }

  ngAfterViewInit() { 
    this.dropDown();
  //  this.rangeSlider();
    /**
     *
      Potentially replace later with relative values to make responsive
      Width of range controller - 30rem
      Range min - 0
      Range max - 300,000
      Size of step - 10,000
      Size of step in pixels - 1rem
      Number of steps - 30
      Calculate position of range input thumb:
      (Input value / step size) * pixel value of step size
      e.g. Left position of thumb is (90000 / 10000) * 1rem = 9rem
     *
    **/
    const tooltipMin = document.querySelector('.tooltip-min');
    const tooltipMax = document.querySelector('.tooltip-max');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    let salaryMin = this.form.value.salaryMin;
    let salaryMax = this.form.value.salaryMax;
    let tooltipMinWidth = tooltipMin.offsetWidth / 10;
    let tooltipMaxWidth = tooltipMax.offsetWidth / 10;
    console.log(tooltipMinWidth);
    console.log(tooltipMaxWidth);
    const stepSize = 10000;
    const rangeWidth = 30;
    const thumbWidth = 2;
    let positionMin = (salaryMin / stepSize);
    let positionMax = rangeWidth - (salaryMax / stepSize);
    tooltipMin.style.left = positionMin + 'rem';
 //   tooltipMin.style.transform = `translate(${tooltipMinWidth / 2})`;
    tooltipMax.style.right = positionMax + 'rem';
    tooltipMinBar.style.left = positionMin + 'rem';
    tooltipMinBar.style.right = positionMax + 'rem';
    tooltipMaxBar.style.left = positionMin + 'rem';
    tooltipMaxBar.style.right = positionMax + 'rem';
  }

  onSalaryMinChange(minValue, maxValue) {
    this.salaryMinVal = minValue.value;
    this.salaryMaxVal = maxValue.value;
    let salaryMin = this.salaryMinVal;
    let salaryMax = this.salaryMaxVal;
    const tooltipMin = document.querySelector('.tooltip-min');
    const tooltipMax = document.querySelector('.tooltip-max');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    let tooltipMinWidth = tooltipMin.offsetWidth / 10;
    let tooltipMaxWidth = tooltipMax.offsetWidth / 10;
    const stepSize = 10000;
    const rangeWidth = 30;
    const thumbWidth = 2;
    let positionMin = (salaryMin / stepSize);
    let positionMax = rangeWidth - (salaryMax / stepSize);
    tooltipMin.style.left = positionMin + 'rem';
   // tooltipMin.style.transform = `translate(-20%)`;
    tooltipMax.style.right = positionMax + 'rem';
    tooltipMinBar.style.left = positionMin + 'rem';
    tooltipMinBar.style.right = positionMax + 'rem';
    tooltipMaxBar.style.left = positionMin + 'rem';
    tooltipMaxBar.style.right = positionMax + 'rem';

    salaryMin = parseInt(salaryMin);
    salaryMax = parseInt(salaryMax);

    if (salaryMax < salaryMin + 20000) {
      this.salaryMinVal = salaryMax - 20000;
        
      if (salaryMin == 0) {
        this.salaryMaxVal = 20000;
      }
    }

    if (salaryMin > salaryMax - 20000) {
      this.salaryMaxVal = salaryMin + 20000;
        
      if (salaryMax == 300000) {
        this.salaryMinVal = 280000;
      }

     }
  }

  onSalaryMaxChange(maxValue, minValue) {
    this.salaryMinVal = minValue.value;
    this.salaryMaxVal = maxValue.value;
    let salaryMin = this.salaryMinVal;
    let salaryMax = this.salaryMaxVal;
    const tooltipMin = document.querySelector('.tooltip-min');
    const tooltipMax = document.querySelector('.tooltip-max');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    let tooltipMinWidth = tooltipMin.offsetWidth / 10;
    let tooltipMaxWidth = tooltipMax.offsetWidth / 10;
    const stepSize = 10000;
    const rangeWidth = 30;
    const thumbWidth = 2;
    let positionMin = (salaryMin / stepSize);
    let positionMax = rangeWidth - (salaryMax / stepSize);
    tooltipMin.style.left = positionMin + 'rem';
//    tooltipMin.style.transform = `translate(${tooltipMinWidth / 2}rem)`;
    tooltipMax.style.right = positionMax + 'rem';
    tooltipMinBar.style.left = positionMin + 'rem';
    tooltipMinBar.style.right = positionMax + 'rem';
    tooltipMaxBar.style.left = positionMin + 'rem';
    tooltipMaxBar.style.right = positionMax + 'rem';

    salaryMin = parseInt(salaryMin);
    salaryMax = parseInt(salaryMax);


    if (salaryMax < salaryMin + 20000) {
      this.salaryMinVal = salaryMax - 20000;
        
      if (salaryMin == 0) {
        this.salaryMaxVal = 20000;
      }
    }

    if (salaryMin > salaryMax - 20000) {
      this.salaryMaxVal = salaryMin + 20000;
        
      if (salaryMax == 300000) {
        this.salaryMinVal = 300000 - 20000;
      }

     }
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
    if (this.form.value.date && this.form.value.date !== 'all-time') {
      queryParams = { ...queryParams, date: this.form.value.date };
    }
    if (this.form.value.date === 'all-time') {
      queryParams = { ...queryParams, date: null };
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
    if (this.form.value.salaryMin && this.form.value.salaryMin !== 0) {
      queryParams = { ...queryParams, salaryMin: this.form.value.salaryMin };
    }
    if (this.form.value.salaryMax && this.form.value.salaryMax != 300000) {
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
