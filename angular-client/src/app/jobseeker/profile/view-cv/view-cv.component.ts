import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../auth/auth.service';
import { mimeType } from '../../jobs/apply/mime-type';

@Component({
  selector: 'app-view-cv',
  templateUrl: './view-cv.component.html',
  styleUrls: ['./view-cv.component.scss']
})
export class ViewCVComponent implements OnInit {
  private cv: string;
  private cvName: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.getAuthData()) {
      this.cv = this.authService.getAuthData().cv;
      this.cvName = this.authService.getAuthData().cvName;
    }
  }

}