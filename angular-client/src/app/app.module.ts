import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavPrimaryComponent } from './header/nav-primary/nav-primary.component';
import { NavSecondaryJobseekerComponent } from './header/nav-secondary-jobseeker/nav-secondary-jobseeker.component';
import { NavSecondaryEmployerComponent } from './header/nav-secondary-employer/nav-secondary-employer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobsComponent } from './jobs/jobs.component';
import { EmployerComponent } from './employer/employer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavPrimaryComponent,
    NavSecondaryJobseekerComponent,
    NavSecondaryEmployerComponent,
    LandingPageComponent,
    JobsComponent,
    EmployerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
