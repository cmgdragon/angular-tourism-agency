import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserEducation } from 'src/app/models/UserEducation';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-education-list',
  templateUrl: './education-list.component.html',
  styleUrls: ['./education-list.component.css']
})
export class EducationListComponent implements OnInit {

  educationList: Array<UserEducation>;
  userId: number = undefined;
  action: string;
  user: User;
  userType: string;
  selectedEducation: UserEducation;
  selectedEducationIndex: number;
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId();
    this.userType = this.userService.getUserType();
    this.userService.getUser(this.userService.getUserId()).subscribe((user: User) =>
      {
        this.user = user;
        this.educationList = user.education;
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

  changeEducation(user: User) {
    this.educationList = user.education;
  }

}
