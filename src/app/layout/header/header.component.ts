import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';
import { removeSession } from 'src/app/users/actions';

import { UserService } from '../../users/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userType: string;

  constructor(private userService: UserService, private store: Store<AppState>) {

  }

  ngOnInit(): void {
    this.store.select("usersReducers").subscribe(({user}) => {
      setTimeout(() => {
        this.userType = user?.type ?? this.userService.getUserType()
      }, 500);
    })

  }

  isLoggedIn(): boolean {
    return this.userService.getSession() ? true : false;
  }

  logOut(): void {
    this.userService.deleteSession();
    this.store.dispatch(removeSession());
    location.href = '/';
  }

}
