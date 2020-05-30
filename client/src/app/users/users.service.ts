import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  apiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`).pipe(
      catchError(err => {
        this.router.navigate(['']);
        return of(null);
      })
    );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/api/auth/forgotPassword`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(userId: any, token: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/api/auth/resetPassword`, { password }, { params: { userId, token } })
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
