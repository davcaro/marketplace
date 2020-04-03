import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
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
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

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

  autoLogin() {
    const userData: {
      _id: number;
      email: string;
      name: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData._id,
      userData.email,
      userData.name,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);

      this.reloadUser();
    }
  }

  reloadUser() {
    const userData = this.http
      .get<AuthResponseData>('//127.0.0.1:3000/api/me')
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error) {
            return throwError(err.error);
          } else {
            return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
          }
        })
      )
      .subscribe(
        res => {
          this.user.value._id = res._id;
          this.user.value.email = res.email;
          this.user.value.name = res.name;

          this.saveToLocalStorage();
        },
        err => {
          this.logout();
        }
      );

    return userData;
  }

  logout(): void {
    this.user.next(null);
    this.router.navigate(['/']);
    localStorage.removeItem('userData');
    clearTimeout(this.tokenExpirationTimer);
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  saveToLocalStorage(): void {
    localStorage.setItem('userData', JSON.stringify(this.user.value));
  }

  private handleAuthentication(id: number, email: string, name: string, token: string, tokenTTL: number) {
    const expirationDate = new Date(new Date().getTime() + tokenTTL * 1000);
    const user = new User(id, email, name, token, expirationDate);
    this.user.next(user);
    this.autoLogout(tokenTTL * 1000);
    this.saveToLocalStorage();
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error) {
      return throwError(errorRes.error);
    } else {
      return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
    }
  }
}
