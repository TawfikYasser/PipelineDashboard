import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// Dashboard hub routing modules
import { SharedModule } from '@shared/shared.module';
import { MainRoutingModule } from './main-routing.module';

// Dashboard hub components
import { FeaturesComponent } from './components/features/features.component';
import { FollowingComponent } from './components/following/following.component';
import { HelpDetailComponent } from './components/help-detail/help-detail.component';
import { HelpComponent } from './components/help/help.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { PrivacyComponent } from './components/legal/privacy/privacy.component';
import { TermsConditionsComponent } from './components/legal/terms-conditions/terms-conditions.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StatsComponent } from './components/stats/stats.component';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    CommonModule,
    MainRoutingModule,
    SharedModule,
  ],
  declarations: [MainComponent,
    FeaturesComponent,
    HelpComponent,
    HelpDetailComponent,
    HomepageComponent,
    PrivacyComponent,
    ProfileComponent,
    TermsConditionsComponent,
    StatsComponent,
    FollowingComponent,
  ],
})
export class MainModule { }
