import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { ActivityListComponent } from './activity-list/activity-list.component';

@NgModule({
  declarations: [
    ActivityDetailComponent,
    ActivityListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    ActivityDetailComponent,
    ActivityListComponent
  ]
})
export class ActivitiesModule { }
