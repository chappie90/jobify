  import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { JobsService} from '../../services/jobs.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnDestroy {
  private jobsCount: string;
  private formData: {};
  private pageSize: number = 20;
  private numberPages: number;
  private moreJobs: string = '...';
  private pages = [];
  private pagesOutput = [];
  private selectedPage: number;
  private nextPage: number;
  private previousPage: number;
  private firstPage: number;
  private lastPage: number;
  private pageNumber;
  private jobsSub: Subscription;
  private pageSub: Subscription;
  private searchTitle: string;
  private searchLocation: string;


  constructor(private jobsService: JobsService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.buildPagination();
    this.route.queryParams.subscribe(params => {
        let title = params.title;
        let location = params.location;
        let date = params.date;
        let type = params.type;
        let fullTime, partTime, contract, temporary, apprenticeship, volunteer;
        let salaryMin = params.salaryMin;
        let salaryMax = params.salaryMax;
        this.pageNumber = params.page;
        if (!this.pageNumber) {
          this.pageNumber = 1;
        }
        this.selectedPage = this.pageNumber;
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
        this.formData = { 
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
    });
    
  // this.selectedPage = 5;
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          // REPLACE WITH BUILDPAGINATION FUNCTION
          this.jobsCount = jobs.count;
          this.selectedPage = parseInt(jobs.currentPage);
          this.numberPages = Math.ceil(parseInt(this.jobsCount) / this.pageSize);
          this.pages = [...Array(this.numberPages).keys()].map(x => ++x);
          this.pagesOutput = [];
          let lastPage = this.pages.slice(-1).pop();
          if (this.pages.length < 10) {
            this.pagesOutput = this.pages;
          } else {
            if (this.selectedPage <= 8) {
            let pagesRange = this.pages.slice(0, 8);
            for (let i = 0; i < pagesRange.length; i++) {
              this.pagesOutput.push(pagesRange[i]);
            }              
            this.pagesOutput.push(this.moreJobs);
            this.pagesOutput.push(lastPage);
          } else if (this.selectedPage >= this.pages.slice(-1).pop() - 7) {
            this.pagesOutput.push(1);
            this.pagesOutput.push(this.moreJobs);
            let pagesRange = this.pages.slice(this.pages.slice(-1).pop() - 8, this.pages.slice(-1).pop());
            for (let i = 0; i < pagesRange.length; i++) {
              this.pagesOutput.push(pagesRange[i]);
            }
          } else {
            this.pagesOutput.push(1);
            this.pagesOutput.push(this.moreJobs);
            let pagesRange = this.pages.slice(this.firstPage, this.lastPage);
            for (let i = 0; i < pagesRange.length; i++) {
              this.pagesOutput.push(pagesRange[i]);
            }
            this.pagesOutput.push(this.moreJobs);
            this.pagesOutput.push(this.pages.slice(-1).pop()); 
          }
          }
        }
      );
  }

  buildPagination() {
    let jobs = this.jobsService.returnAllJobsData();
    this.jobsCount = jobs.count;
    this.selectedPage = parseInt(jobs.currentPage);
    this.numberPages = Math.ceil(parseInt(this.jobsCount) / this.pageSize);
    this.pages = [...Array(this.numberPages).keys()].map(x => ++x);
    this.pagesOutput = [];
    let lastPage = this.pages.slice(-1).pop();
    if (this.pages.length < 10) {
      this.pagesOutput = this.pages;
    } else {
       if (this.selectedPage <= 8) {
      let pagesRange = this.pages.slice(0, 8);
      for (let i = 0; i < pagesRange.length; i++) {
        this.pagesOutput.push(pagesRange[i]);
      }              
      this.pagesOutput.push(this.moreJobs);
      this.pagesOutput.push(lastPage);
    } else if (this.selectedPage >= this.pages.slice(-1).pop() - 7) {
      this.pagesOutput.push(1);
      this.pagesOutput.push(this.moreJobs);
      let pagesRange = this.pages.slice(this.pages.slice(-1).pop() - 8, this.pages.slice(-1).pop());
      for (let i = 0; i < pagesRange.length; i++) {
        this.pagesOutput.push(pagesRange[i]);
      }
    } else {
      this.pagesOutput.push(1);
      this.pagesOutput.push(this.moreJobs);
      let pagesRange = this.pages.slice(this.firstPage, this.lastPage);
      for (let i = 0; i < pagesRange.length; i++) {
        this.pagesOutput.push(pagesRange[i]);
      }
      this.pagesOutput.push(this.moreJobs);
      this.pagesOutput.push(this.pages.slice(-1).pop()); 
    }
    }
  }

  onGetPage(page, index, previousPage, nextPage) {
    // REPLACE GET JOBS ARGUMENTS WITH QUERY PARAMS
    let queryParams: Params = {};
    let pageNum;
    if (page) {
      pageNum = page;
    }
    if (page === 1) {
      pageNum = null;
    }
    if (index === 8) {
      pageNum = previousPage + 1;
    }
    if (index === 1 && page === this.moreJobs) {
      pageNum = nextPage - 1;
    }
    queryParams = { ...queryParams, page: pageNum };
    this.router.navigate(
      [],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    );

    if (this.pages.length < 10) {
      this.jobsService.getJobs(this.formData, page);
    } else {
      if (index === 8) {
        this.firstPage = previousPage - 3;
        this.nextPage = previousPage + 1;
        this.lastPage = this.nextPage + 2;
        this.jobsService.getJobs(this.formData, this.nextPage);
      } else if (index === 1 && page === this.moreJobs) {
        this.firstPage = nextPage - 4;
        this.nextPage = nextPage - 1;
        this.lastPage = nextPage + 2;
        this.jobsService.getJobs(this.formData, this.nextPage);
      } else {
        this.jobsService.getJobs(this.formData, page);  
      }
    }
  }

  ngOnDestroy() {
    if (this.jobsSub) {
      this.jobsSub.unsubscribe();
    }
  }
}