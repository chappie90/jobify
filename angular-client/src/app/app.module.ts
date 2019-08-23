import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavPrimaryComponent } from './header/nav-primary/nav-primary.component';
import { NavSecondaryJobseekerComponent } from './header/nav-secondary-jobseeker/nav-secondary-jobseeker.component';
import { NavSecondaryEmployerComponent } from './header/nav-secondary-employer/nav-secondary-employer.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavPrimaryComponent,
    NavSecondaryJobseekerComponent,
    NavSecondaryEmployerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
