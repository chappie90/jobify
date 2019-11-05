import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobsComponent } from './jobseeker/jobs/jobs.component';
import { JobsSearchComponent } from './jobseeker/jobs/jobs-search/jobs-search.component';
import { EmployerComponent } from './employer/employer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { UploadCVComponent } from './jobseeker/upload-cv/upload-cv.component';
import { MarketInsightsComponent } from './jobseeker/market-insights/market-insights.component';
import { PremiumComponent } from './jobseeker/premium/premium.component';
import { ProductsComponent } from './employer/products/products.component';
import { PricingComponent } from './employer/pricing/pricing.component';
import { PostJobComponent } from './employer/post-job/post-job.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
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

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent },
  { path: 'jobs', component: JobsComponent },
  { path: 'jobs/search', component: JobsSearchComponent },
  { path: 'apply', component: ApplyComponent },
  { path: 'cv', component: UploadCVComponent },
  { path: 'market-insights', component: MarketInsightsComponent },
  { path: 'premium', component: PremiumComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'profile', component: ProfileComponent, children: [
    { path: 'summary', component: SummaryComponent },
    { path: 'cv', component: ViewCVComponent },
    { path: 'experience', component: ExperienceComponent },
    { path: 'education', component: EducationComponent },
    { path: 'skills', component: SkillsComponent }
  ] },
  { path: 'tracker', component: TrackerComponent, children: [
    { path: 'applied', component: AppliedJobsComponent },
    { path: 'saved', component: SavedJobsComponent }
  ] },
  { path: 'account', component: AccountComponent },
  { path: 'employer', component: EmployerComponent },
  { path: 'employer/products', component: ProductsComponent },
  { path: 'employer/pricing', component: PricingComponent },
  { path: 'employer/post-job', component: PostJobComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}