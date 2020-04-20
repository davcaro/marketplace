import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.less']
})
export class CatalogComponent {
  itemsCount: number;

  constructor() {
    this.itemsCount = 0;
  }

  updateItemsCount(count: number) {
    this.itemsCount = count;
  }
}
