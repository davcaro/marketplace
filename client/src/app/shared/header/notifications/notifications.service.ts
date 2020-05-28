import { Injectable } from '@angular/core';
import { SocketioService } from '../../socketio.service';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  apiUrl: string;

  unreadNotificationsCount: BehaviorSubject<number>;
  reloadNotifications: BehaviorSubject<boolean>;
  deleteNotification: Subject<string>;

  constructor(private http: HttpClient, private socketioService: SocketioService) {
    this.apiUrl = environment.apiUrl;

    this.unreadNotificationsCount = new BehaviorSubject<number>(null);
    this.reloadNotifications = new BehaviorSubject<boolean>(true);
    this.deleteNotification = new Subject<string>();

    const socket = this.socketioService.getSocket();
    socket.on('notifications count', (count: number) => {
      this.unreadNotificationsCount.next(count);
      this.reloadNotifications.next(true);
    });
  }

  getNotifications(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/notifications`).pipe(catchError(this.handleError));
  }

  getUnreadNotificationsCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/notifications/count`).pipe(catchError(this.handleError));
  }

  markAllAsRead(type: string = 'all'): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/api/notifications`, { type })
      .pipe(catchError(this.handleError));
  }

  deleteNotifications(type: string): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}/api/notifications`, { params: { type } })
      .pipe(catchError(this.handleError));
  }

  handleError(err: any) {
    if (err.error) {
      return throwError(err.error);
    } else {
      return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
    }
  }
}
