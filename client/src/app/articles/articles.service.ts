import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { Article } from './article.model';
import { Category } from '../shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  apiUrl: string;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/api/category`, {}).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.apiUrl}/api/articles`).pipe(
      catchError(err => {
        this.router.navigate(['']);
        return of(null);
      })
    );
  }

  getArticle(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/api/articles/${id}`).pipe(
      catchError(err => {
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}
