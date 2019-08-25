import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form);
    this.authService.createUser(form.value.email, form.value.password);
  }
}