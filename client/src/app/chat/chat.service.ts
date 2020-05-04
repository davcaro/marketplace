import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  apiUrl: string;

  removeChat: Subject<number>;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;

    this.removeChat = new Subject<number>();
  }

  getChats(archived: boolean = false): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/chats`, { params: { archived: archived ? '1' : '0' } })
      .pipe(catchError(this.handleError));
  }

  getChat(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/chats/${id}`).pipe(catchError(this.handleError));
  }

  findChat(itemId: any): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/api/chats/find`, { params: { itemId } })
      .pipe(catchError(this.handleError));
  }

  createChat(itemId: number, message: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/api/chats`, { itemId, message })
      .pipe(catchError(this.handleError));
  }

  sendMessage(id: number, message: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/api/chats/${id}`, { message })
      .pipe(catchError(this.handleError));
  }

  updateChat(id: number, archived: boolean): Observable<any> {
    return this.http
      .patch<any>(`${this.apiUrl}/api/chats/${id}`, { archived })
      .pipe(catchError(this.handleError));
  }

  deleteChat(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/api/chats/${id}`).pipe(catchError(this.handleError));
  }

  handleError(err: any) {
    if (err.error) {
      return throwError(err.error);
    } else {
      return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
    }
  }
}
