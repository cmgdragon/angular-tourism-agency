import { createReducer, on } from '@ngrx/store';
import { Activity } from '../models/Activity';
import { addNewActivity, addNewActivitySuccess, getActivities, activitiesError, getActivitiesSuccess, removeActivity, updateActivity, removeActivitySuccess, updateActivitySuccess, getTouristActivities, getTouristActivitiesSuccess, clearActivitiesState } from '../actions';

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
  on(getActivities, state => ({ ...state, loading: true, loaded: false })),
  on(addNewActivitySuccess, state => ({ ...state, loading: false, loaded: true })),
  on(removeActivitySuccess, state => ({ ...state, loading: false, loaded: true })),
  on(updateActivitySuccess, state => ({ ...state, loading: false, loaded: true })),
  on(getActivitiesSuccess, (state, { activities }) => ({
    ...state,
    activities,
    loaded: true,
    loading: false
  })),
  on(activitiesError, (state, { payload }) => ({
    ...state,
    loaded: false,
    loading: false,
    error: payload
  })),
  on(addNewActivity, (state, { activity }) => ({
    ...state,
    activities: [...state.activities, activity]
  })),
  on(removeActivity, (state, { id }) => ({
    ...state,
    activities: [...state.activities.filter(activity => activity.id !== id)]
  })),
  on(updateActivity, (state, { activity }) => {
    const index = state.activities.findIndex(x => x.id === activity.id);
    return ({
      ...state,
      activities: [...state.activities.map((currentActivity, currentIndex) =>
        index === currentIndex ? activity : currentActivity
      )]
    })
  }),
  on(getTouristActivities, state => ({ ...state, loading: true })),
  on(getTouristActivitiesSuccess, (state, { activity }) => ({
    ...state,
    activities: [...state.activities, activity]
  })),
  on(clearActivitiesState, state => activitiesInitalState)
);

export const activityReducer = (state, action) => _activityReducer(state, action);
