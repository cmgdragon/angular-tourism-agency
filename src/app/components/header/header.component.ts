import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  userType: string;

  constructor(private userService: UserService) {
    this.userType = this.userService.getUserType();
  }

  isLoggedIn(): boolean {
    return this.userService.getSession() ? true : false;
  }

  logOut(): void {
    this.userService.deleteSession();
    location.href = '/';
  }

}
