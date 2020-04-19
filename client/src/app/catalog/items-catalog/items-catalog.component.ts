import { Component, OnInit } from '@angular/core';
import { ItemsService } from 'src/app/items/items.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Item } from 'src/app/items/item.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-items-catalog',
  templateUrl: './items-catalog.component.html',
  styleUrls: ['./items-catalog.component.less']
})
export class ItemsCatalogComponent implements OnInit {
  apiUrl: string;
  items: Item[];
  itemTooltipOpen: Item;
  itemConfirmOpen: Item;
  pagination: { page: number; limit: number; offset: number; total: number };

  constructor(
    private itemsService: ItemsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.items = [];

    const page = +this.route.snapshot.queryParams.page;
    this.pagination = { page: page ? page : 1, limit: 30, offset: 0, total: null };
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    const query = {
      limit: this.pagination.limit,
      offset: (this.pagination.page - 1) * this.pagination.limit
    };

    this.itemsService.getUserItems(query, this.authService.user.value).subscribe(res => {
      this.items = res.data.map((item: Item) => Object.assign(new Item(), item));

      this.pagination = { page: res.pagination.offset / res.pagination.limit + 1, ...res.pagination };
      this.router.navigate([], { queryParams: { page: this.pagination.page }, queryParamsHandling: 'merge' });
    });
  }

  onMarkAsReserved(item: Item) {
    const status = item.status === 'for_sale' ? 'reserved' : 'for_sale';

    this.itemsService.updateItem(item.id, { status }).subscribe(() => {
      item.status = status;
    });
  }

  onMarkAsSold(item: Item) {
    this.itemsService.updateItem(item.id, { status: 'sold' }).subscribe(() => {
      this.items.splice(this.items.indexOf(item), 1);
    });
  }

  onEditItem(item: Item) {
    this.router.navigate(['catalog', 'edit', item.id]);
  }

  onDeleteItem(item: Item) {
    this.itemsService.deleteItem(item.id).subscribe(() => {
      this.items.splice(this.items.indexOf(item), 1);
    });
  }

  onTooltipChange(isOpen: boolean, item: Item) {
    this.itemTooltipOpen = isOpen ? item : null;
  }

  onConfirmChange(isOpen: boolean, item: Item) {
    this.itemConfirmOpen = isOpen ? item : null;
  }
}
