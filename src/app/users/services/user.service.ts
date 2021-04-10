import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/User';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducers';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private cookie: CookieService, private store: Store<AppState>) { }

  register(user: User): Promise<any> {

    return new Promise<User>((resolve, reject) => {

      this.checkEmail(user.email).subscribe((data: Array<any>) => {
        if (data.length === 1) return reject('user_exists');
      })

      this.addUser(user).subscribe(user => {
        this.startSession(user);
        window.location.href = "/";
        resolve(user);
      });

    });

  }

  checkEmail(email: string): Observable<any> {
    return this.http.get(`http://localhost:3000/users?email=${email}`);
  }

  login(email: string, pwd: string): Promise<any> {

      return new Promise<string>((resolve, reject) => {

        this.checkEmail(email).subscribe(data => {

          const user = data.length === 1 ? data[0] : false;
          if (user) {
            if (pwd !== user.password) return reject('invalid_pwd');

            this.startSession(user);
            window.location.href = "/";
            resolve(user);
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

  addUser(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:3000/users', user);
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
