import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Ng2CompleterModule } from "ng2-completer";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
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
import { LoginFormComponent } from './auth/login/login-form/login-form.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SignupFormComponent } from './auth/signup/signup-form/signup-form.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { JobsListComponent } from './jobseeker/jobs/jobs-list/jobs-list.component';
import { JobsItemComponent } from './jobseeker/jobs/jobs-list/jobs-item/jobs-item.component';
import { SearchBarComponent } from './jobseeker/jobs/search-bar/search-bar.component';
import { JobsSearchComponent } from './jobseeker/jobs/jobs-search/jobs-search.component';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { ProfileComponent } from './jobseeker/profile/profile.component';
import { TrackerComponent } from './jobseeker/tracker/tracker.component';
import { AccountComponent } from './jobseeker/account/account.component';
import { SummaryComponent } from './jobseeker/profile/summary/summary.component';
import { ViewCVComponent } from './jobseeker/profile/view-cv/view-cv.component';
import { ExperienceComponent } from './jobseeker/profile/experience/experience.component';
import { EducationComponent } from './jobseeker/profile/education/education.component';
import { SkillsComponent } from './jobseeker/profile/skills/skills.component';
import { AppliedJobsComponent } from './jobseeker/tracker/applied/applied.component';
import { SavedJobsComponent } from './jobseeker/tracker/saved/saved.component';
import { ApplyComponent } from './jobseeker/jobs/apply/apply.component';
import { NotificationsComponent } from './jobseeker/notifications/notifications.component';
import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavPrimaryComponent,
    NavSecondaryJobseekerComponent,
    NavSecondaryEmployerComponent,
    LandingPageComponent,
    JobsComponent,
    JobsSearchComponent,
    UploadCVComponent,
    MarketInsightsComponent,
    PremiumComponent,
    EmployerComponent,
    ProductsComponent,
    PricingComponent,
    PostJobComponent,
    LoginComponent,
    LoginFormComponent,
    SignupComponent,
    SignupFormComponent,
    DropdownDirective,
    LoadingSpinnerComponent,
    JobsListComponent,
    JobsItemComponent,
    SearchBarComponent,
    PaginationComponent,
    ProfileComponent,
    TrackerComponent,
    AccountComponent,
    SummaryComponent,
    ViewCVComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    AppliedJobsComponent,
    SavedJobsComponent,
    ApplyComponent,
    NotificationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    Ng2CompleterModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
