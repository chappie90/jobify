import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-jobs-item',
  templateUrl: './jobs-item.component.html',
  styleUrls: ['./jobs-item.component.scss']
})
export class JobsItemComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.url.subscribe(url =>{
    //  console.log(url);
    // });
  }

}