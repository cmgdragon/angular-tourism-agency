import { createAction, props } from '@ngrx/store';
import { User } from '../models/User';

export const removeSession = createAction('[USER] Remove session');

export const registerUser = createAction(
  '[USER] Register user',
  props<{ user: User }>()
);

export const getUser = createAction(
  '[USER] Get user',
  props<{ id: number }>()
);

export const updateUser = createAction(
  '[USER] Update user',
  props<{ user: User }>()
);

/*export const deleteEducation = createAction(
  '[USER] Update education',
  props<{ index: number }>()
);*/

export const registerUserSuccess = createAction('[USER] Register user success');
export const updateUserSuccess = createAction(
  '[USER] Update user success',
  props<{ user: User }>()
);

export const getUserSuccess = createAction(
  '[USER] Get user success',
  props<{user: User}>()
);

export const userError = createAction(
  '[USER] Get user error',
  props<{ payload: any }>()
);
