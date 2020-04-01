import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from './user.model';

export interface AuthResponseData {
  _id: number;
  email: string;
  name: string;
  token: string;
  token_ttl: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  signup(email: string, password: string, name: string) {
    return this.http
      .post<AuthResponseData>('//127.0.0.1:3000/api/auth/signup', {
        email,
        password,
        name
      })
      .pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuthentication(res._id, res.email, res.name, res.token, res.token_ttl);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('//127.0.0.1:3000/api/auth/login', {
        email,
        password
      })
      .pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuthentication(res._id, res.email, res.name, res.token, res.token_ttl);
        })
      );
  }

  checkAvailable(email: string) {
    return this.http
      .post<AuthResponseData>('//127.0.0.1:3000/api/auth/check', {
        email
      })
      .pipe(catchError(this.handleError));
  }

  private handleAuthentication(id: number, email: string, name: string, token: string, token_ttl: number) {
    const expirationDate = new Date(new Date().getTime() + token_ttl * 1000);
    const user = new User(id, email, name, token, expirationDate);
    this.user.next(user);
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error) {
      return throwError(errorRes.error);
    } else {
      return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
    }
  }
}
