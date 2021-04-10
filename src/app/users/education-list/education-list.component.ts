import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/models/User';
import { UserEducation } from 'src/app/users/models/UserEducation';
import { AppState } from 'src/app/app.reducers';
import { Store } from '@ngrx/store';

import { UserService } from 'src/app/users/services/user.service';

@Component({
  selector: 'app-education-list',
  templateUrl: './education-list.component.html',
  styleUrls: ['./education-list.component.css']
})
export class EducationListComponent implements OnInit {

  educationList: Array<UserEducation> = [];
  userId: number = undefined;
  action: string;
  user: User;
  userType: string;
  selectedEducation: UserEducation;
  selectedEducationIndex: number;
  constructor(private userService: UserService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId(); //desde las cookies
    this.userType = this.userService.getUserType(); //desde las cookies
    this.store.select("usersReducers").subscribe(({ user }) => { //desde el state
      setTimeout(() => {
        this.user = user;
        this.educationList = this.user.education;
      }, 500);

    })

  }

  selectEducation(education: UserEducation, educationIndex: number, action: string): void {
    this.selectedEducation = action === 'delete' ? undefined : education;
    this.selectedEducationIndex = educationIndex;
    this.action = action;
  }

  addEducation(): void {
    this.selectedEducation = new UserEducation();
    this.selectedEducationIndex = undefined;
    this.action = 'add';
  }

}
