import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JobsComponent } from './jobseeker/jobs/jobs.component';
import { EmployerComponent } from './employer/employer.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { UploadCVComponent } from './jobseeker/upload-cv/upload-cv.component';
import { MarketInsightsComponent } from './jobseeker/market-insights/market-insights.component';
import { PremiumComponent } from './jobseeker/premium/premium.component';
import { ProductsComponent } from './employer/products/products.component';
import { PricingComponent } from './employer/pricing/pricing.component';
import { PostJobComponent } from './employer/post-job/post-job.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: 'jobs', component: JobsComponent },
  { path: 'cv', component: UploadCVComponent },
  { path: 'market-insights', component: MarketInsightsComponent },
  { path: 'premium', component: PremiumComponent },
  { path: 'employer', component: EmployerComponent, children: [
    { path: 'products', component: ProductsComponent },
    { path: 'pricing', component: PricingComponent },
    { path: 'post-job', component: PostJobComponent }
  ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {

}