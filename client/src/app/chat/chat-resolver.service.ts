import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatService } from './chat.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatResolverService implements Resolve<any> {
  constructor(private chatService: ChatService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.chatService.getChat(+route.paramMap.get('id')).pipe(
      catchError(err => {
        this.router.navigate(['/', 'chat']);
        return of(null);
      })
    );
  }
}
