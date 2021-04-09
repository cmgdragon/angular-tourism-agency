import { ActionReducerMap } from '@ngrx/store';
import * as activityReducers from './activities/reducers';
import * as userReducers from './users/reducers';

export interface AppState {
  activityReducers: activityReducers.ActivityState;
  usersReducers: userReducers.UserState
}

const appReducers: ActionReducerMap<AppState> = {
  activityReducers: activityReducers.activityReducer,
  usersReducers: userReducers.userReducer
}

export default appReducers;
