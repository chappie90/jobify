import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobsComponent } from './jobs/jobs.component';
import { EmployerComponent } from './employer/employer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'employer', component: EmployerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}