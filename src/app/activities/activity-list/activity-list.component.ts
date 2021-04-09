import { Component, OnInit } from '@angular/core';
import { Activity } from '../models/Activity';

import { ActivityService } from '../services/activity.service';
import { UserService } from 'src/app/users/services/user.service';

import { User } from '../../users/models/User';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css']
})
export class ActivityListComponent implements OnInit {

  activityList: Array<Activity>;
  selectedActivity: Activity;
  userId: number = undefined;
  hasSignedUp: boolean;
  userType: string;
  routeType: string;
  action: string;
  selectedActivityIndex: number;

  constructor(private activityService: ActivityService, private userService: UserService, private route: ActivatedRoute) {
    this.userId = this.userService.getUserId();
    this.userType = this.userService.getUserType();
  }

  ngOnInit(): void {

    this.route.data.subscribe(({type}) => {

      this.routeType = type;
      if (!this.userService.getUserId()) return;

      switch (type) {
        case 'home':
          this.activityService.getAllActivities().subscribe(data => {
            this.activityList = data; });
          break;
        case 'company':
          this.activityService.getUserActivities(this.userService.getUserId()).subscribe(data => {
            this.activityList = data; });
        case 'tourist':
          const activities: Array<Activity> = [];
          this.userService.getUser(this.userService.getUserId()).subscribe((user: User) => {
            for (const id of user.activities) {
              this.activityService.getActivityById(id).subscribe((activity: Activity) => {
                activities.push(activity);
              })
            }
          })
          this.activityList = activities;
      }

    })

  }

  selectActivity(activity: Activity, activityIndex: number, action: string): void {

    this.action = action;

    switch(action) {
      case 'show':
        this.selectedActivity = undefined;
        this.activityService.getActivityById(activity.id).subscribe((activity: Activity) => {
          this.selectedActivity = activity;
          if (this.userId) {
            this.activityService.checkIfUserHasSignedUp(this.userId, activity.id).then(response =>
              this.hasSignedUp = response)
          }
        });
        this.selectedActivityIndex = activityIndex;
        break;
      default:
        this.selectedActivity = undefined;
        this.selectedActivity = activity;
        this.selectedActivityIndex = activityIndex;
    }

  }

  addActivity(): void {
    this.action = 'add';
    this.selectedActivity = new Activity();
    this.selectedActivityIndex = undefined;
  }

  changeActivity(activity: Activity) {
    switch(this.action) {
      case 'delete':
        this.activityList.splice(this.selectedActivityIndex, 1);
        break;
      case 'edit':
        this.selectedActivity = undefined;
        this.activityList[this.selectedActivityIndex] = activity;
        break;
      case 'add':
        this.selectedActivity = undefined;
        this.activityList.push(activity);
    }
  }

}
