import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-saved-jobs',
  templateUrl: './saved.component.html',
  styleUrls: ['./saved.component.scss']
})
export class SavedJobsComponent implements OnInit {
	private likedJobs: any;	

  constructor(private authService: AuthService) { }

  ngOnInit() {
  	this.likedJobs = this.authService.getAuthData().likedJobs.split(',');
  	console.log(this.likedJobs);
  }

}