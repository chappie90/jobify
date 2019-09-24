import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required]
      }),
      'email': new FormControl(null, {
        validators: [Validators.required]
      }),
      'number': new FormControl(null, {
        validators: []
      })
    });
    this.form.setValue({
      'name': 'Stoyan Garov',
      'email': 'stoyan.garov@yahoo.com',
      'number': '07955443250'
    });
  }

}
