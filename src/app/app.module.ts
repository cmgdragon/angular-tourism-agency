import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CookieService } from 'ngx-cookie-service';
import { RegisterComponent } from './components/register/register.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ActivityDetailComponent } from './components/activity-detail/activity-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserEducationComponent } from './components/user-education/user-education.component';
import { EducationListComponent } from './components/education-list/education-list.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';

const appRoutes: Routes = [
  { path: '', component: ActivityListComponent, data: { type: 'home' } },
  { path: 'admin', component: ActivityListComponent, data: { type: 'company' } },
  { path: 'my-activity', component: ActivityListComponent, data: { type: 'tourist' } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    ActivityDetailComponent,
    ProfileComponent,
    UserEducationComponent,
    EducationListComponent,
    ActivityListComponent,
    UserActivityComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
