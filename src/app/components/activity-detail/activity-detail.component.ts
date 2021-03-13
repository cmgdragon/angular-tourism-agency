import { Component, Input, OnChanges } from '@angular/core';
import { ActivityService } from 'src/app/services/activity.service';
import { UserService } from '../../services/user.service';
import { Activity } from '../../models/Activity';
import { User } from '../../models/User';

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

  constructor(private activityService: ActivityService, private userService: UserService) {
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
      .subscribe((activity: Activity) =>  {

        this.userService.getUser(this.userId).subscribe((user: User) => {

          if (!this.hasSignedUp) {
            //activity.registered.push(this.userId);
            this.activity.registered.push(this.userId);
            user.activities.push(activityId);
          } else {
            //activity.registered.splice(activity.registered.findIndex(x => x === activityId), 1);
            this.activity.registered.splice(this.activity.registered.findIndex(x => x === activityId), 1);
            user.activities.splice(user.activities.findIndex(x => x === activityId), 1);
          }

          this.hasSignedUp = !this.hasSignedUp;
          this.userService.updateUser(user);
          this.activityService.updateActivity(this.activity);
        })

      });

  }

}
