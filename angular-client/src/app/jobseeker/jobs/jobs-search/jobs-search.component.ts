import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-jobs-search',
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.scss']
})
export class JobsSearchComponent implements OnInit {
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

  constructor(private jobsService: JobsService) { }

  ngOnInit() {

  }

  onSearch(form: NgForm) {
    this.filterDateActive = form.value.date ? true : false;
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
    this.jobsSearch = true;
    this.jobsService.getJobs(form.value.title, form.value.location, 1);
  }

  onClearFilters(form: NgForm) {
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
