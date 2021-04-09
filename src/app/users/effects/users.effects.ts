import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../services/user.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { registerUser, registerUserSuccess, getUser, userError, getUserSuccess, updateUser, updateUserSuccess } from '../actions';

@Injectable()
export class UsersEffects {

  constructor(private actions$: Actions, private userService: UserService) {}

  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getUser),
      mergeMap(({id}) =>
        this.userService.getUser(id).pipe(
          map(user => getUserSuccess({ user })),
          catchError(payload => of(userError({ payload })))
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerUser),
      mergeMap(({user}) =>
        of(this.userService.register(user)).pipe(
          map(() => registerUserSuccess()),
          catchError(payload => of(userError({ payload })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap(({user}) =>
        of(this.userService.updateUser(user)).pipe(
          map(() => updateUserSuccess({user})),
          catchError(payload => of(userError({ payload })))
        )
      )
    )
  );

}
