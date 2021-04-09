import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Activity } from '../models/Activity';
import { UserService } from '../../users/services/user.service';
import { User } from '../../users/models/User';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient, private userService: UserService) {}

  getAllActivities(): Observable<Array<Activity>> {
    return this.http.get<Array<Activity>>('http://localhost:3000/activities');
  }

  getUserActivities(userId: number): Observable<Array<Activity>> {
    return this.http.get<Array<Activity>>(`http://localhost:3000/activities/?user=${userId}`);
  }

  getActivityById(id: number): Observable<Activity> {
    return this.http.get<Activity>(`http://localhost:3000/activities/${id}`);
  }

  checkIfUserHasSignedUp(userId: number, activityId: number): Promise<boolean> {
    return new Promise(resolve => {
      this.userService.getUser(userId).subscribe((user: User) => {
        resolve( user.activities.includes(activityId) )
      })
    })
  }

  addActivity(activity: Activity): Observable<any> {
    return this.http.post(`http://localhost:3000/activities`, activity);
  }

  updateActivity(activity: Activity): Observable<any> {
    return this.http.put(`http://localhost:3000/activities/${activity.id}`, activity,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteActivity(id: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/activities/${id}`);
  }

}
