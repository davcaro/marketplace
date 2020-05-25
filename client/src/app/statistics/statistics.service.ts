import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getItemsMonthStats(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/me/statistics`, { params: { data: 'items-month' } })
      .pipe(catchError(this.handleError));
  }

  getItemsCategoriesStats(): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/me/statistics`, { params: { data: 'items-categories' } })
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
