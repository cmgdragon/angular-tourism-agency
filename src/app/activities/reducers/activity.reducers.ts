import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/Activity';
import { addNewAvtivity, getActivities, getAllActivitiesError, getAllActivitiesSuccess, getUserActivitiesSuccess, removeActivity, updateAvtivity } from '../actions';

export interface ActivityState {
  activities: Activity[],
  loading: boolean,
  loaded: boolean,
  error: any
}

const activitiesInitalState: ActivityState = {
  activities: [],
  loading: false,
  loaded: false,
  error: null
};

const _activityReducer = createReducer(
  activitiesInitalState,
  on(getActivities, state => ({...state, loading: true, loaded: false})),
  on(getAllActivitiesSuccess, (state, { activities }) => ({
    ...state,
    ...activities,
    loaded: true,
    loading: false
  })),
  on(getUserActivitiesSuccess, (state, { activities }) => ({
    ...state,
    ...activities,
    loaded: true,
    loading: false
  })),
  on(getAllActivitiesError, (state, { payload }) => ({
    ...state,
    loaded: false,
    loading: false,
    error: payload
  })),
  on(addNewAvtivity, (state, { activity }) => ({
    ...state,
    activities: [...state.activities, activity]
  })),
  on(removeActivity, (state, { id }) => ({
    ...state,
    activities: state.activities.filter(activity => activity.id !== id)
  })),
  on(updateAvtivity, (state, { activity }) => ({
    ...state,
    activities: [...state.activities, activity]
  }))
);

export const activityReducer = (state, action) => _activityReducer(state, action);
