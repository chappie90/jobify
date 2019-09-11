import { Component, OnInit } from '@angular/core';

import { JobsService} from '../../services/jobs.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  private pages = [1, 2, 3, 4, 5, 6, 7, 8];
  private selectedPage: number;

  constructor(private jobsService: JobsService) {}

  ngOnInit() {
    this.selectedPage = this.pages[0];
  }

  onGetPage(index) {
    this.selectedPage = index;
    this.jobsService.getJobs(index);
  }
}