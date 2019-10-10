import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  form: FormGroup;
  private skills: any;
  private userId: string;
  private formSubmitted: boolean;
  private userSub: Subscription;

  constructor(private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.skills = JSON.parse(localStorage.getItem('skills'));
    });
    this.form = new FormGroup({
      'skill': new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.userId = localStorage.getItem('userId');
    this.userSub = this.userService.getSkillsUpdateListener().subscribe(
      skillsStatus => {
        if (skillsStatus) {
          this.skills = JSON.parse(localStorage.getItem('skills'));
        }
      }
    );
  }

  onAddSkill() {
    if (this.form.invalid) {
      this.formSubmitted = true;
      return;
    }
    this.userService.addSkill(this.form.value, this.userId);
  }

  onRemoveSkill(skill) {
    this.userService.removeSkill(skill._id, this.userId);
  }

}