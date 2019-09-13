import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { JobsService} from '../../services/jobs.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  private jobsCount: number;
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
  private currentPageindex: number;
  private jobsSub: Subscription;
  private pageSub: Subscription;

  constructor(private jobsService: JobsService) {}

  ngOnInit() {
    this.selectedPage = this.pages[0];
    this.jobsSub = this.jobsService.getJobsUpdateListener()
      .subscribe(
        jobs => {
          this.jobsCount = jobs.count;
          this.selectedPage = jobs.currentPage;
          this.numberPages = Math.ceil(this.jobsCount / this.pageSize);
          this.pages = [...Array(this.numberPages).keys()].map(x => ++x);
          this.pagesOutput = [];
          let lastPage = this.pages.slice(-1).pop();
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
      );
  }

  onGetPage(page, index, previousPage, nextPage) {
    if (index === 8) {
      this.firstPage = previousPage - 3;
      this.nextPage = previousPage + 1;
      this.lastPage = this.nextPage + 2;
      this.currentPageindex = index;
      this.jobsService.getJobs('Analyst', 'London', this.nextPage);
    } else if (index === 1 && page === this.moreJobs) {
      this.firstPage = nextPage - 4;
      this.nextPage = nextPage - 1;
      this.lastPage = nextPage + 2;
      this.jobsService.getJobs('Analyst', 'London', this.nextPage);
    } else {
      this.jobsService.getJobs('Analyst', 'London', page);  
    }
  }
}