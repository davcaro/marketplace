import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ItemsService } from './items.service';
import { Observable, of } from 'rxjs';
import { Item } from './item.model';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<any> {
  constructor(private itemsService: ItemsService, private authService: AuthService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Item> {
    return this.itemsService.getItem(+route.paramMap.get('id')).pipe(
      switchMap(item => {
        if (!route.data.resolverCanEdit || item.user.id === this.authService.user.value.id) {
          return of(item);
        } else {
          this.router.navigate(['']);
          return of(null);
        }
      })
    );
  }
}
