import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addNewActivity, addNewActivitySuccess, getActivities, activitiesError, getActivitiesSuccess, getUserActivities, removeActivity, updateActivity, updateActivitySuccess, removeActivitySuccess, getTouristActivities } from '../actions';
import { ActivityService } from '../services/activity.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from 'src/app/users/services/user.service';
import { Activity } from '../models/Activity';

@Injectable()
export class ActivitiesEffects {

  constructor(private actions$: Actions, private activityService: ActivityService, private userService: UserService) { }

  getActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getActivities),
      mergeMap(() =>
        this.activityService.getAllActivities().pipe(
          map(activities => getActivitiesSuccess({ activities })),
          catchError(payload => of(activitiesError({ payload })))
        )
      )
    )
  );

  getUserActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserActivities),
      mergeMap(({ id }) =>
        this.activityService.getUserActivities(id).pipe(
          map(activities => getActivitiesSuccess({ activities })),
          catchError(payload => of(activitiesError({ payload })))
        )
      )
    )
  );

  addNewActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewActivity),
      mergeMap(({ activity }) =>
        this.activityService.addActivity(activity)),
      map(() => addNewActivitySuccess()),
      catchError(payload => of(activitiesError({ payload }))
      )
    )
  );

  getTouristActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getTouristActivities),
      mergeMap(({ id }) =>
        this.userService.getUser(id).pipe(
          mergeMap(({ activities }) => {
            const touristActivities: Activity[] = [];
            for (const id of activities) {
              this.activityService.getActivityById(id).subscribe((activity: Activity) => {
                touristActivities.push(activity);
              })
            }
            return of(touristActivities).pipe(
              mergeMap(touristActivities => map(() => getActivitiesSuccess({ activities: touristActivities }))),
              catchError(payload => of(activitiesError({ payload })))
            )
          })
        )


      )
    )
  );

  updateActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateActivity),
      mergeMap(({ activity }) =>
        this.activityService.updateActivity(activity)),
      map(() => updateActivitySuccess())
    )
  );

  removeActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeActivity),
      mergeMap(({ id }) =>
        this.activityService.deleteActivity(id)),
      map(() => removeActivitySuccess())
    )
  );

}
