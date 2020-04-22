import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { of, Observable, throwError, BehaviorSubject } from 'rxjs';
import { Item } from './item.model';
import { Category } from '../shared/category.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  apiUrl: string;
  categories: BehaviorSubject<Category[]>;
  items: BehaviorSubject<Item[]>;

  constructor(private http: HttpClient, private router: Router) {
    this.apiUrl = environment.apiUrl;
    this.categories = new BehaviorSubject<Category[]>([{ id: -1, name: 'Todas las categorías', icon: 'power' }]);
    this.items = new BehaviorSubject<Item[]>(null);

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

  getItems(query: { [param: string]: any }): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/items`, { params: query })
      .pipe(
        catchError(err => {
          if (err.error) {
            return throwError(err.error);
          } else {
            return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
          }
        })
      );
  }

  getUserItems(pagination: { limit: any; offset: any }, userId: number, status?: string): Observable<any> {
    const params: any = pagination;
    if (status) {
      params.status = status;
    }

    return this.http
      .get<any>(`${this.apiUrl}/api/users/${userId}/items`, { params })
      .pipe(
        catchError(err => {
          if (err.error) {
            return throwError(err.error);
          } else {
            return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
          }
        })
      );
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/api/items/${id}`).pipe(
      catchError(err => {
        this.router.navigate(['']);
        return of(null);
      })
    );
  }

  getItemFavorites(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/items/${id}/favorites`).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  createItem(data: object): Observable<Item> {
    return this.http.post<Item>(`${this.apiUrl}/api/items`, data).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  addFavorite(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/items/${id}/favorites`, {}).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  updateItem(id: number, changes: object): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/api/items/${id}`, changes).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/items/${id}`).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }

  removeFavorite(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/items/${id}/favorites`).pipe(
      catchError(err => {
        if (err.error) {
          return throwError(err.error);
        } else {
          return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
        }
      })
    );
  }
}
