import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';

import { AppComponent } from './app.component';
import { ActivitiesModule } from './activities/activities.module';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './users/profile/profile.component';
import { ActivityListComponent } from './activities/activity-list/activity-list.component';
import appReducers from './app.reducers';
import { EffectsArray } from './app.effects';
import { UsersModule } from './users/users.module';
import { LoginComponent } from './users/login/login.component';
import { RegisterComponent } from './users/register/register.component';

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
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ActivitiesModule,
    UsersModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes
    ),
    StoreModule.forRoot( appReducers ),
    EffectsModule.forRoot( EffectsArray ),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
