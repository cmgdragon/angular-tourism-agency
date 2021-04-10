import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EducationListComponent } from './education-list/education-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserEducationComponent } from './user-education/user-education.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    EducationListComponent,
    LoginComponent,
    RegisterComponent,
    UserEducationComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    EducationListComponent,
    LoginComponent,
    RegisterComponent,
    UserEducationComponent,
    ProfileComponent
  ]
})
export class UsersModule { }
