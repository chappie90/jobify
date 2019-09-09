import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-jobs-search',
  templateUrl: './jobs-search.component.html',
  styleUrls: ['./jobs-search.component.scss']
})
export class JobsSearchComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

  }

  onSearch(form: NgForm) {
    if (form.invalid) {
      return;
    }
  }

}