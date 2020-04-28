import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from '../users/user.model';
import { environment } from 'src/environments/environment';
import { Location } from '../shared/location.model';

export interface AuthResponseData {
  id: number;
  email: string;
  name: string;
  avatar: string;
  location: Location;
  token: string;
  token_ttl: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  apiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  signup(email: string, password: string, name: string) {
    return this.http
      .post<AuthResponseData>(`${this.apiUrl}/api/auth/signup`, {
        email,
        password,
        name
      })
      .pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuthentication(res);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(`${this.apiUrl}/api/auth/login`, {
        email,
        password
      })
      .pipe(
        catchError(this.handleError),
        tap(res => {
          this.handleAuthentication(res);
        })
      );
  }

  autoLogin() {
    const userData: {
      id: number;
      email: string;
      name: string;
      avatar: string;
      location: Location;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.id,
      userData.email,
      userData.name,
      userData.avatar,
      userData.location,
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

  checkAvailable(email: string) {
    return this.http
      .post<any>(`${this.apiUrl}/api/auth/check`, { email })
      .pipe(catchError(this.handleError));
  }

  reloadUser() {
    const userData = this.http
      .get<any>(`${this.apiUrl}/api/me`)
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
          this.user.value.id = res.id;
          this.user.value.email = res.email;
          this.user.value.name = res.name;
          this.user.value.avatar = res.avatar;
          if (res.location) {
            this.user.value.location = new Location(
              res.location.latitude,
              res.location.longitude,
              res.location.zoom,
              res.location.placeName
            );
          } else {
            this.user.value.location = null;
          }

          this.saveToLocalStorage();
        },
        err => {
          this.logout();
        }
      );

    return userData;
  }

  updateUser(data: object) {
    return this.http.patch<any>(`${this.apiUrl}/api/me`, data).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  deleteUser() {
    return this.http.delete<any>(`${this.apiUrl}/api/me`).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  private handleAuthentication(data: AuthResponseData): void {
    const expirationDate = new Date(new Date().getTime() + data.token_ttl * 1000);
    const user = new User(data.id, data.email, data.name, data.avatar, data.location, data.token, expirationDate);
    this.user.next(user);
    this.autoLogout(data.token_ttl * 1000);
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
