import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addNewAvtivity, getActivities, getAllActivitiesError, getAllActivitiesSuccess, getUserActivities, getUserActivitiesSuccess, removeActivity, updateAvtivity } from '../actions';
import { ActivityService } from '../services/activity.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class ActivitiesEffects {

  constructor(private actions$: Actions, private activityService: ActivityService) {}

  getActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getActivities),
      mergeMap(() =>
        this.activityService.getAllActivities().pipe(
          map(activities => getAllActivitiesSuccess({ activities })),
          catchError(payload => of(getAllActivitiesError({ payload })))
        )
      )
    )
  );

  getUserActivities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUserActivities),
      mergeMap(({id}) =>
        this.activityService.getUserActivities(id).pipe(
          map(activities => getUserActivitiesSuccess({ activities })),
          catchError(payload => of(getAllActivitiesError({ payload })))
        )
      )
    )
  );

  addNewActivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addNewAvtivity),
      mergeMap(({activity}) => this.activityService.addActivity(activity))
    )
  );

  updateAvtivity$ = createEffect(() =>
  this.actions$.pipe(
    ofType(updateAvtivity),
    mergeMap(({activity}) => this.activityService.updateActivity(activity))
   )
  );

  removeAvtivity$ = createEffect(() =>
  this.actions$.pipe(
    ofType(removeActivity),
    mergeMap(({id}) => this.activityService.deleteActivity(id))
   )
  );

}
