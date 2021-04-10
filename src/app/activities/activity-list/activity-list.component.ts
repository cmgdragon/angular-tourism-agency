import { Component, OnInit } from '@angular/core';
import { Activity } from '../models/Activity';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

import { ActivityService } from '../services/activity.service';
import { UserService } from 'src/app/users/services/user.service';

import { User } from '../../users/models/User';
import { ActivatedRoute } from '@angular/router';
import { getActivities, getUserActivities, removeActivity } from '../actions';
import { updateUser } from 'src/app/users/actions';

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

  constructor(private activityService: ActivityService, private userService: UserService, private route: ActivatedRoute, private store: Store<AppState>) {
    this.userId = this.userService.getUserId();
    this.userType = this.userService.getUserType();
  }

  ngOnInit(): void {
      this.store.select("activityReducers").subscribe(({activities}) => {
        setTimeout(() => {
          this.activityList = activities
        }, 500);
      });
    this.route.data.subscribe(({type}) => {

      this.routeType = type;
      if (!this.userService.getUserId()) return;

      switch (type) {
        case 'home':
          /*this.activityService.getAllActivities().subscribe(data => {
            this.activityList = data; });*/
            this.store.dispatch(getActivities());
          break;
        case 'company':
          /*this.activityService.getUserActivities(this.userService.getUserId()).subscribe(data => {
            this.activityList = data; });*/

            this.store.dispatch(getUserActivities({ id: this.userId }));
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
      case 'edit':
        this.selectedActivity = undefined;
        this.selectedActivity = activity;
        this.selectedActivityIndex = activityIndex;
      break;

      case 'delete':
        this.selectedActivity = undefined;
        console.log(activity.id + " WTFT?=¿??¿")
        if (confirm('Delete this activity?')) {

          this.store.dispatch(removeActivity({ id: activity.id }));

          if (!activity?.registered || activity?.registered.length === 0) return;

          for (const userId of activity.registered) {
            console.log(activity)
            this.userService.getUser(userId).subscribe((user: User) => {

              const newUser: User = ({
                ...user,
                activities: [...user.activities.splice(user.activities.findIndex(a => a === activity.id), 1)]
              })
              this.store.dispatch(updateUser({ user: newUser }))
              //this.userService.updateUser(user);
            })
          }

          this.selectedActivity = undefined;
          this.selectedActivityIndex = undefined;

        } else {
          this.selectedActivity = undefined;
          this.selectedActivityIndex = undefined;
         }
    }

  }

  addActivity(): void {
    console.log("joder");
    this.action = 'add';
    this.selectedActivity = new Activity();
    this.selectedActivityIndex = undefined;
  }

}
