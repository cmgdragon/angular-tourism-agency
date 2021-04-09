import { createAction, props } from '@ngrx/store';
import { Activity } from '../models/Activity';

export const createActivity = createAction(
  '[ACTIVITY] Create activity',
  props<{activity: Activity}>()
);

export const getActivities = createAction('[ACTIVITY] Get activities');
export const getUserActivities = createAction(
  '[ACTIVITY] Get user activities',
  props<{ id: number }>()
);

export const getAllActivitiesSuccess = createAction(
  '[ACTIVITY] Get all activities',
  props<{ activities: Activity[] }>()
);

export const getUserActivitiesSuccess = createAction(
  '[ACTIVITY] Get all activities',
  props<{ activities: Activity[] }>()
);

export const getAllActivitiesError = createAction(
  '[ACTIVITY] Get all activities error',
  props<{ payload: any }>()
);

export const addNewAvtivity = createAction(
  '[ACTIVITY] Add activity',
  props<{ activity: Activity }>()
);

export const removeActivity = createAction(
  '[ACTIVITY] Remove activity',
  props<{ id: number }>()
);

export const updateAvtivity = createAction(
  '[ACTIVITY] Remove activity',
  props<{ activity: Activity }>()
);
