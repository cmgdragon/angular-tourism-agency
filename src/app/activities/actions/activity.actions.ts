import { createAction, props } from '@ngrx/store';
import { Activity } from '../models/Activity';

export const getActivities = createAction('[ACTIVITY] Get activities');
export const getUserActivities = createAction(
  '[ACTIVITY] Get user activities',
  props<{ id: number }>()
);

export const getActivitiesSuccess = createAction(
  '[ACTIVITY] Get all activities',
  props<{ activities: Activity[] }>()
);

export const activitiesError = createAction(
  '[ACTIVITY] Activities error',
  props<{ payload: any }>()
);

export const addNewActivity = createAction(
  '[ACTIVITY] Add activity',
  props<{ activity: Activity }>()
);

export const addNewActivitySuccess = createAction('[ACTIVITY] Add new activity success');
export const removeActivitySuccess = createAction('[ACTIVITY] Remove activity success');
export const updateActivitySuccess = createAction('[ACTIVITY] Update activity success');

export const removeActivity = createAction(
  '[ACTIVITY] Remove activity',
  props<{ id: number }>()
);

export const updateActivity = createAction(
  '[ACTIVITY] Update activity',
  props<{ activity: Activity }>()
);

export const getTouristActivities = createAction(
  '[ACTIVITY] Get tourist activities',
  props<{ id: number }>()
);

export const getTouristActivitiesSuccess = createAction(
  '[ACTIVITY] Get tourist activities success',
  props<{ activities: Activity[] }>()
);