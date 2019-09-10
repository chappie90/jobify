import { Component } from '@angular/core';

import { JobsService} from '../../services/jobs.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  private pages = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private jobsService: JobsService) {}

  onGetPage(index) {
    this.jobsService.getJobs(index);
  }
}