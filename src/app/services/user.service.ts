import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/User';
import { UserEducation } from '../models/UserEducation';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private cookie: CookieService) { }

  loggedUser: User =  undefined;

  register(user: User): Promise<any> {

    return new Promise<string>((resolve, reject) => {

      this.checkEmail(user.email).subscribe((data: Array<any>) => {
        if (data.length === 1) return reject('user_exists');
      })

      this.http.post<User>('http://localhost:3000/users', user)
      .subscribe(success => {
        this.startSession(success);
        resolve('ok');
      });

    });

  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(`http://localhost:3000/users?email=${email}`);
  }

  login(email: string, pwd: string): Promise<string> {

      return new Promise<string>((resolve, reject) => {

        this.checkEmail(email).subscribe(data => {

          const user = data.length === 1 ? data[0] : false;
          if (user) {
            if (pwd !== user.password) return reject('invalid_pwd');

            this.startSession(user);
            resolve('ok');
          } else {
            reject('not_email_found');
          }
        })

      });

  }

  startSession(user: User): void {
    this.cookie.set('session', JSON.stringify({user: user.email, type: user.type, id: user.id}));
  }

  getSession(): any {
    return this.cookie.get('session') ? JSON.parse(this.cookie.get('session')) : false;
  }

  getUserType(): string {
    return this.getSession() ? this.getSession().type : false;
  }

  getUserId(): number {
    return this.getSession() ? this.getSession().id : false;
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`http://localhost:3000/users/${id}`);
  }

  deleteSession(): void {
    this.cookie.delete('session');
  }

  updateUser(user: User): void {
    this.http.put(`http://localhost:3000/users/${user.id}`, user,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .subscribe(success => success);
  }

}
