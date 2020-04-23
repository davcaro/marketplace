import { Component } from '@angular/core';

@Component({
  selector: 'app-view-favorites',
  templateUrl: './view-favorites.component.html',
  styleUrls: ['./view-favorites.component.less']
})
export class ViewFavoritesComponent {
  itemsCount: number;

  constructor() {
    this.itemsCount = 0;
  }

  updateItemsCount(count: number) {
    this.itemsCount = count;
  }
}
