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
  private loading: boolean;
  protected city: string;
  private title: string;
  private locationComplete: any;
  private jobsSearch: boolean = false;
  private searchPristine: boolean = true;
  private openDropdown: boolean = false;
  private filterDateActive: boolean = false;
  private filterTypeActive: boolean = false;
  private filterSalaryActive: boolean = false;
  private filtersCount: number = 0;
  private filterDateCounted: boolean = false;
  private filterTypeCounted: boolean = false;
  private filterSalaryCounted: boolean = false;
  private titlesSub: Subscription;
  private jobsSub: Subscription;
  private titlesSub: Subscription;
  private titleComplete: any;
  private salaryMinVal: number;
  private salaryMaxVal: number;
  private locationCount: number;
  private titleCount: number;

  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          this.loading = false;
          this.searchPristine = false;
       //   console.log(document.getElementById('jobs-list').scrollTop);
        }
    );
    this.titlesSub = this.jobsService.getAutoCompleteTitles().subscribe(response => {
      this.titleComplete = response.jobs.map(t => t.job_title);
    });
    this.salaryMinVal = 0;
    this.salaryMaxVal = 300000;
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.loading = true;
        this.jobsSearch = event.url.includes('/jobs/search');
      }

      if (event instanceof NavigationEnd) {
        this.loading = false;
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
        let pageNumber = params.page;
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
      this.filterDateActive = this.form.value.date !== 'all-time' ? true : false;
      this.filterTypeActive = this.form.value.full || 
                              this.form.value.part ||
                              this.form.value.contract ||
                              this.form.value.temporary ||
                              this.form.value.apprenticeship ||
                              this.form.value.volunteer;
      this.filterSalaryActive = this.form.value.salaryMin !== 0 || 
                                this.form.value.salaryMax !== 300000; 
      }
       if (this.filterDateActive && !this.filterDateCounted) {
        this.filtersCount++;
        this.filterDateCounted = true; 
      }
      if (this.filterTypeActive && !this.filterTypeCounted) {
        this.filtersCount++;
        this.filterTypeCounted = true; 
      }
      if (this.filterSalaryActive && !this.filterSalaryCounted) {
        this.filtersCount++;
        this.filterSalaryCounted = true;
      }
    });
  }

  ngAfterViewInit() { 
    this.dropDown();

  //   const dotsArr = document.querySelectorAll('.dot');
  //   for (let i = 0; i < dotsArr.length; i++) {
  //     dotsArr[i].addEventListener('mouseover', function() {
  //       let rect = dotsArr[i].offsetLeft;
  //       console.log(rect);
  //     });
  //   }

  //   $(".dot").hover(function(){
  //   var cur=$(this);
  //   console.log(cur);
  //   var dest=cur.position().left;
  //   console.log(dest);
  //   var t=0.6;
  //   TweenMax.to($(".select"),t,{x:dest,ease:Back.easeOut})
  // });
  // var lastPos=$(".select").position().left;
  // function updateScale(){
  //   var pos=$(".select").position().left;
    
  //   var speed=Math.abs(pos-lastPos);
  //   var d=44;
  //   var offset=-20;
  //   var hd=d/2;
  //   var scale=(offset+pos)%d;
  //   if(scale>hd){
  //     scale=hd-(scale-hd);
  //   }
  //   scale=1-((scale/hd)*0.35);
  //   TweenMax.to($(".select"),0.1,{scaleY:scale,scaleX:1+(speed*0.06)})
    
  //   lastPos=pos;
  //   requestAnimationFrame(updateScale);
  // }
  // requestAnimationFrame(updateScale);
  // $(".dot:eq(0)").trigger("mouseover");
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
    const lower = document.querySelector('#lower');
    const upper = document.querySelector('#upper');
    const tooltipMin = document.querySelector('.tooltip-min');
    const tooltipMax = document.querySelector('.tooltip-max');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    let salaryMin = this.form.value.salaryMin;
    let salaryMax = this.form.value.salaryMax;
    // let tooltipMinWidth = tooltipMin.offsetWidth / 10;
    // let tooltipMaxWidth = tooltipMax.offsetWidth / 10;
    const stepSize = 10000;
    const rangeWidth = 32.4;
    const thumbWidth = 1.6;
    salaryMin = parseInt(salaryMin);
    salaryMax = parseInt(salaryMax);
    let positionMin = (salaryMin / stepSize) * 1.08;
    let positionMax = rangeWidth - (salaryMax / stepSize) * 1.08;
    tooltipMin.style.left = positionMin + 'rem';
    tooltipMin.style.transform = `translate(calc(-25% + .35rem))`;
    tooltipMax.style.transform = `translate(calc(25% - .35rem))`;
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
    const lower = document.querySelector('#lower');
    const upper = document.querySelector('#upper');
    const tooltipMin = document.querySelector('.tooltip-min');
    const tooltipMax = document.querySelector('.tooltip-max');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    // let tooltipMinWidth = tooltipMin.offsetWidth / 10;
    // let tooltipMaxWidth = tooltipMax.offsetWidth / 10;
    const stepSize = 10000;
    const rangeWidth = 32.4;
    const thumbWidth = 1.6;
    salaryMin = parseInt(salaryMin);
    salaryMax = parseInt(salaryMax);
    let positionMin = (salaryMin / stepSize) * 1.08;
    let positionMax = rangeWidth - (salaryMax / stepSize) * 1.08;
    tooltipMin.style.left = positionMin + 'rem';
    tooltipMin.style.transform = `translate(calc(-25% + .35rem))`;
    tooltipMax.style.transform = `translate(calc(25% - .35rem))`;
    tooltipMax.style.right = positionMax + 'rem';
    tooltipMinBar.style.left = positionMin + 'rem';
    tooltipMinBar.style.right = positionMax + 'rem';
    tooltipMaxBar.style.left = positionMin + 'rem';
    tooltipMaxBar.style.right = positionMax + 'rem';

    if (salaryMax < salaryMin + 14000) {
      this.salaryMinVal = salaryMax - 14000;
        
      if (salaryMin == 0) {
         upper.value = 14000;
         this.salaryMinVal = 0;
         tooltipMax.style.right = 31.3 + 'rem';
      }
    }

    if (salaryMin > salaryMax - 14000) {
      this.salaryMaxVal = salaryMin + 14000;
        
      if (salaryMax == 300000) {
        lower.value = salaryMax - 14000;
        this.salaryMaxVal = 300000;
        tooltipMin.style.left = 31.3 + 'rem';
      }
    }
  }

  onSalaryMaxChange(maxValue, minValue) {
    this.salaryMinVal = minValue.value;
    this.salaryMaxVal = maxValue.value;
    let salaryMin = this.salaryMinVal;
    let salaryMax = this.salaryMaxVal;
    const lower = document.querySelector('#lower');
    const upper = document.querySelector('#upper');
    const tooltipMin = document.querySelector('.tooltip-min');
    const tooltipMax = document.querySelector('.tooltip-max');
    const tooltipMinBar = document.querySelector('.tooltip-min-bar');
    const tooltipMaxBar = document.querySelector('.tooltip-max-bar');
    // let tooltipMinWidth = tooltipMin.offsetWidth / 10;
    // let tooltipMaxWidth = tooltipMax.offsetWidth / 10;
    const stepSize = 10000;
    const rangeWidth = 32.4;
    const thumbWidth = 1.6;
    let positionMin = (salaryMin / stepSize) * 1.08;
    let positionMax = rangeWidth - (salaryMax / stepSize) * 1.08;
    tooltipMin.style.left = positionMin + 'rem';
    tooltipMin.style.transform = `translate(calc(-25% + .35rem))`;
    tooltipMax.style.transform = `translate(calc(25% - .35rem))`;
    tooltipMax.style.right = positionMax + 'rem';
    tooltipMinBar.style.left = positionMin + 'rem';
    tooltipMinBar.style.right = positionMax + 'rem';
    tooltipMaxBar.style.left = positionMin + 'rem';
    tooltipMaxBar.style.right = positionMax + 'rem';

    salaryMin = parseInt(salaryMin);
    salaryMax = parseInt(salaryMax);


    if (salaryMax < salaryMin + 14000) {
      this.salaryMinVal = salaryMax - 14000;

      if (salaryMin == 0) {
          upper.value = 14000;
          this.salaryMinVal = 0;
          tooltipMax.style.right = 31.3 + 'rem';
      }
    }
    
    if (salaryMin > salaryMax - 14000) {
      this.salaryMaxVal = salaryMin + 14000;
        
      if (salaryMax == 300000) {
        lower.value = salaryMax - 14000;
        this.salaryMaxVal = 300000;
        tooltipMin.style.left = 31.3 + 'rem';
      }
    }
  }

  onLocationComplete(val) {
    this.locationCount = null;
    this.locationComplete = this.cities.filter(city =>  city.toUpperCase().includes(val.toUpperCase()));
    if (!val || this.locationComplete.length === 0) {
      this.locationComplete = null;
    }
    this.locationComplete = this.locationComplete.slice(0, 5);
  }

  onSuggestClick(el) {
    console.log(el);
    this.form.patchValue({
      location: el
    });
    this.locationComplete = null;
    this.locationCount = null;
  }

  onLocationFocus() {
    console.log('fds');
    return;
  }

  onLocationOut() {
    this.locationComplete = null;
    this.locationCount = null;
  }

  onTitleComplete(val) {
     this.jobsService.getJobTitles(val);
  }

  onSuggestTitleClick(el) {
    this.form.patchValue({
      title: el
    });
    this.titleComplete = null;
  }

  onTitleOut() {
    this.titleComplete = null;
  }

  onKey(e) {
    if (this.locationComplete) {

      switch (e.which) {
        case 40: // down 
          this.locationCount = this.locationCount ? this.locationCount : 0;
          this.locationComplete[this.locationCount];
          this.locationCount++;
          if (this.locationCount === this.locationComplete.length + 1) {
            this.locationCount = 0;
          }
          if (this.locationCount === 0) {
            this.locationCount = 1;
          }
        break;

        case 38: // up
          this.locationCount = this.locationCount ? this.locationCount : 0;
          this.locationComplete[this.locationCount];
          this.locationCount--;
          if (this.locationCount === 0) {
            this.locationCount = this.locationComplete.length + 1;
          }
          if (this.locationCount === 6) {
            this.locationCount = 5;
          }
        break;
      }
    }

     if (this.titleComplete) {
      switch (e.which) {
        case 40: // down 
          this.titleCount = this.titleCount ? this.titleCount : 0;
          this.titleComplete[this.titleCount];
          console.log(this.titleComplete);
          this.titleCount++;
          if (this.titleCount === this.titleComplete.length + 1) {
            this.titleCount = 0;
          }
          if (this.titleCount === 0) {
            this.titleCount = 1;
          }
        break;

        case 38: // up
          this.titleCount = this.titleCount ? this.titleCount : 0;
          this.titleComplete[this.titleCount];
          this.titleCount--;
          if (this.titleCount === 0) {
            this.titleCount = this.titleComplete.length + 1;
          }
          if (this.titleCount === 6) {
            this.titleCount = 5;
          }
        break;
      }
    }
  }

  onSearch() {
    this.loading = true;
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
      this.filterSalaryActive = this.form.value.salaryMin !== 0 || 
                                this.form.value.salaryMax !== 300000; 
      // const activeFilters = [this.filterDateActive, this.filterTypeActive, this.filterSalaryActive];
      // if (!this.filtersCounted) {
      //   activeFilters.forEach(filter => {
      //     if (filter === true) {
      //       this.filtersCount++;
      //     }
      //   });
      // }
      // this.filtersCounted = true;

      if (this.filterDateActive && !this.filterDateCounted) {
        this.filtersCount++;
        this.filterDateCounted = true; 
      } else if (!this.filterDateActive && this.filterDateCounted) {
        this.filtersCount--;
        this.filterDateCounted = false;
      }
      if (this.filterTypeActive && !this.filterTypeCounted) {
        this.filtersCount++;
        this.filterTypeCounted = true; 
      } else if (!this.filterTypeActive && this.filterTypeCounted) {
        this.filtersCount--;
        this.filterTypeCounted = false;
      }
      if (this.filterSalaryActive && !this.filterSalaryCounted) {
        this.filtersCount++;
        this.filterSalaryCounted = true;
      } else if (!this.filterSalaryActive && this.filterSalaryCounted) {
        this.filtersCount--;
        this.filterSalaryCounted = false;
      }

      this.jobsService.getJobs(this.form.value, 1);
      this.searchPristine = false;

    // Add search query parameters
    // Make sure all browsers support object spread operator
    let queryParams: Params = {};
    let type = [];
    queryParams = { ...queryParams, title: this.form.value.title ? this.form.value.title : null };
    queryParams = { ...queryParams, location: this.form.value.location ? this.form.value.location: null };
    queryParams = {
      ...queryParams, 
      date: this.form.value.date && this.form.value.date !== 'all-time' ?
            this.form.value.date : null
    };  
    if (this.form.value.full) {
      type.push('fullTime');
      queryParams = { ...queryParams, type: type };
    } else {
      // Why does this work for all job types?
      type =  type.filter(x => x !== 'fullTime');
      if (type.length === 0) {
        queryParams = { ...queryParams, type: null };
      } else {
        queryParams = { ...queryParams, type: type };
      }
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
    queryParams = { 
      ...queryParams, 
      salaryMin: this.form.value.salaryMin !== 0 ? 
        this.form.value.salaryMin : null 
    };
    queryParams = { 
      ...queryParams, 
      salaryMax: this.form.value.salaryMax !== 300000 ? 
        this.form.value.salaryMax : null 
    };
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
    this.filterDateCounted = false;
    this.filterTypeCounted = false;
    this.filterSalaryCounted = false;
    this.filtersCount = 0;
    let pageNumber: string = this.route.snapshot.queryParamMap.get('pageNumber');
    if (!pageNumber) {
      pageNumber = 1
    }
    this.router.navigate([], {
      queryParams: {
        date: null,
        type: null,
        salaryMin: null,
        salaryMax: null
      },
      queryParamsHandling: 'merge'
    });
    this.jobsService.getJobs(this.form.value, pageNumber );
  }


  cities = [
    'Birmingham', 
    'Bradford', 
    'Bristol', 
    'Edinburgh', 
    'Glasgow', 
    'Leeds', 
    'Liverpool', 
    'London', 
    'Manchester',
    'Newcastle',
    'Nottingham',
    'Portsmouth',
    'Sheffield',
    'Southhampton'
  ];

}
