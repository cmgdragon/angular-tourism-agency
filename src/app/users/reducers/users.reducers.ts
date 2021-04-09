import { createReducer, on } from '@ngrx/store';
import { getUser, userError, getUserSuccess, removeSession, registerUserSuccess, registerUser, updateUser } from '../actions';
import { User } from '../models/User';

export interface UserState {
  user: User,
  loading: boolean,
  loaded: boolean,
  error: any
}

const userInitalState: UserState = {
  user: undefined,
  loading: false,
  loaded: false,
  error: null
};

const _userReducer = createReducer(
  userInitalState,
  on(getUser, state => ({...state, loading: true})),
  on(registerUser, state => ({...state, loading: true})),
  on(updateUser, (state, { user }) => ({...state, user })),
  on(registerUserSuccess, state => ({
    ...state,
    loading: false,
    loaded: true
  })),
  on(getUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
    loaded: true
  })),
  on(userError, (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: false,
    payload
  })),
  on(removeSession, () => userInitalState)
);

export const userReducer = (state, action) => _userReducer(state, action);
