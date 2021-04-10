import { Component, Input, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

import { ActivityService } from 'src/app/activities/services/activity.service';
import { UserService } from '../../users/services/user.service';

import { Activity } from '../models/Activity';
import { User } from '../../users/models/User';
import { updateUser } from 'src/app/users/actions';
import { updateActivity } from '../actions';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnChanges {

  @Input() activity: Activity;
  @Input() hasSignedUp: boolean;
  userType: string = undefined;
  userId: number = undefined;

  constructor(private activityService: ActivityService, private userService: UserService, private store: Store<AppState>) {
    this.userType = this.userService.getUserType();
    this.userId = this.userService.getUserId();
  }

  ngOnChanges(): void {

    switch (this.activity?.language) {
      case 'es':
        this.activity.language = "Español";
        break;
      case 'ca':
        this.activity.language = "Catalán";
        break;
      case 'fr':
        this.activity.language = "Francés";
        break;
      case 'en':
        this.activity.language = "Inglés";
        break;
      case 'de':
        this.activity.language = "Alemán";
        break;
    }

  }

  signUp(activityId: number): void {

    this.activityService.getActivityById(activityId)
      .subscribe((activity: Activity) => {

        this.userService.getUser(this.userId).subscribe((user: User) => {

          if (!this.hasSignedUp) {
            //activity.registered.push(this.userId);
            this.activity = ({
              ...this.activity,
              registered: [...this.activity.registered, this.userId]
            });
            user = ({
              ...user,
              activities: [...user.activities, activityId]
            })
          } else {
            //activity.registered.splice(activity.registered.findIndex(x => x === activityId), 1);
            this.activity = ({
              ...this.activity,
              registered: this.activity.registered.filter(x => x !== activityId)
            });
            user = ({
              ...user,
              activities: user.activities.filter(x => x !== activityId)
            })
            //user.activities.splice(user.activities.findIndex(x => x === activityId), 1);
          }

          this.hasSignedUp = !this.hasSignedUp;
          this.store.dispatch(updateUser({ user }))
          //this.userService.updateUser(user);
          this.store.dispatch(updateActivity({ activity: this.activity }))
          //this.activityService.updateActivity(this.activity);
        })

      });

  }

}
