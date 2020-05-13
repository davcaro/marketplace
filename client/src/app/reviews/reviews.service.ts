import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  getReviewsForUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/users/${userId}/reviews`).pipe(catchError(this.handleError));
  }

  getUserReviews(pending: boolean = false): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/me/reviews`, { params: { pending: pending ? '1' : '0' } })
      .pipe(catchError(this.handleError));
  }

  getUserScore(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/users/${userId}/score`).pipe(catchError(this.handleError));
  }

  updateReview(id: number, review: { score?: number; description?: string }): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/me/reviews/${id}`, review).pipe(catchError(this.handleError));
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/me/reviews/${id}`).pipe(catchError(this.handleError));
  }

  handleError(err: any) {
    if (err.error) {
      return throwError(err.error);
    } else {
      return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
    }
  }
}
