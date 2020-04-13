import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject } from 'rxjs';
import { Article } from './article.model';
import { Category } from '../shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  apiUrl: string;
  categories: BehaviorSubject<Category[]>;
  articles: BehaviorSubject<Article[]>;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.categories = new BehaviorSubject<Category[]>([{ id: -1, name: 'Todas las categorías', icon: 'heat-map' }]);
    this.articles = new BehaviorSubject<Article[]>(null);

    this.getCategories().subscribe((res: Category[]) => {
      this.categories.next([...this.categories.value, ...res]);
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/api/category`).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  getArticles(query: { [param: string]: string }): Observable<Article[]> {
    return this.http
      .get<Article[]>(`${this.apiUrl}/api/articles`, { params: query })
      .pipe(
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
