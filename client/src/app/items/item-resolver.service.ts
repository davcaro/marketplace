import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ItemsService } from './items.service';
import { Observable } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemResolverService implements Resolve<any> {
  constructor(private itemsService: ItemsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Item> {
    return this.itemsService.getItem(+route.paramMap.get('id'));
  }
}
