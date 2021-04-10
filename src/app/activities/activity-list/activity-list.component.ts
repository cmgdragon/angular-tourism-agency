import { Component, OnInit } from '@angular/core';
import { Activity } from '../models/Activity';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

import { ActivityService } from '../services/activity.service';
import { UserService } from 'src/app/users/services/user.service';

import { User } from '../../users/models/User';
import { ActivatedRoute } from '@angular/router';
import { clearActivitiesState, getActivities, getTouristActivities, getUserActivities, removeActivity } from '../actions';

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
    this.store.select("activityReducers").subscribe(({ activities }) => {
      setTimeout(() => {
        this.activityList = activities
      }, 500);
    });
    this.route.data.subscribe(({ type }) => {

      this.routeType = type;

      switch (type) {
        case 'home':
          this.store.dispatch(getActivities());
          break;
        case 'company':
          this.store.dispatch(getUserActivities({ id: this.userId }));
          break;
        case 'tourist':
          this.store.dispatch(clearActivitiesState());
          this.store.dispatch(getTouristActivities({ id: this.userId }));
      }

    })

  }

  selectActivity(activity: Activity, activityIndex: number, action: string): void {

    this.action = action;

    switch (action) {
      case 'show':
        this.selectedActivity = undefined;
        this.selectedActivity = activity;
        this.selectedActivityIndex = activityIndex;
        break;
      case 'edit':
        this.selectedActivity = undefined;
        this.selectedActivity = activity;
        this.selectedActivityIndex = activityIndex;
        break;

      case 'delete':
        this.selectedActivity = undefined;
        if (confirm('Delete this activity?')) {

          this.store.dispatch(removeActivity({ id: activity.id }));

          if (!activity?.registered || activity?.registered.length === 0) return;

          for (const userId of activity.registered) {

            this.userService.getUser(userId).subscribe((user: User) => {

              const newUser: User = ({
                ...user,
                activities: [...user.activities.filter(x => x !== activity.id)]
              })

              this.userService.updateUser(newUser);

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
    this.action = 'add';
    this.selectedActivity = new Activity();
    this.selectedActivityIndex = undefined;
  }

}
