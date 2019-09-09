import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NavPrimaryComponent } from './header/nav-primary/nav-primary.component';
import { NavSecondaryJobseekerComponent } from './header/nav-secondary-jobseeker/nav-secondary-jobseeker.component';
import { NavSecondaryEmployerComponent } from './header/nav-secondary-employer/nav-secondary-employer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { JobsComponent } from './jobseeker/jobs/jobs.component';
import { UploadCVComponent } from './jobseeker/upload-cv/upload-cv.component';
import { MarketInsightsComponent } from './jobseeker/market-insights/market-insights.component';
import { PremiumComponent } from './jobseeker/premium/premium.component';
import { EmployerComponent } from './employer/employer.component';
import { ProductsComponent } from './employer/products/products.component';
import { PricingComponent } from './employer/pricing/pricing.component';
import { PostJobComponent } from './employer/post-job/post-job.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { JobsListComponent } from './jobseeker/jobs/jobs-list/jobs-list.component';
import { JobsItemComponent } from './jobseeker/jobs/jobs-list/jobs-item/jobs-item.component';
import { JobsSearchComponent } from './jobseeker/jobs/jobs-search/jobs-search.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NavPrimaryComponent,
    NavSecondaryJobseekerComponent,
    NavSecondaryEmployerComponent,
    LandingPageComponent,
    JobsComponent,
    UploadCVComponent,
    MarketInsightsComponent,
    PremiumComponent,
    EmployerComponent,
    ProductsComponent,
    PricingComponent,
    PostJobComponent,
    LoginComponent,
    SignupComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    JobsListComponent,
    JobsItemComponent,
    JobsSearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
