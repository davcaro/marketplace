import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from 'src/app/items/item.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-items-catalog',
  templateUrl: './items-catalog.component.html',
  styleUrls: ['./items-catalog.component.less']
})
export class ItemsCatalogComponent implements OnInit {
  apiUrl: string;
  loading: boolean;
  items: Item[];
  itemTooltipOpen: Item;
  itemConfirmOpen: Item;
  pagination: { page: number; limit: number; offset: number; total: number };

  @Input() user: User;
  @Input() editMode: boolean;
  @Input() itemsStatus: string;
  @Output() itemsCount: EventEmitter<number>;

  constructor(private itemsService: ItemsService, private router: Router, private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;
    this.loading = true;
    this.items = [];

    const page = this.editMode ? +this.route.snapshot.queryParams.page : 1;
    this.pagination = { page: page ? page : 1, limit: 30, offset: 0, total: null };

    this.itemsCount = new EventEmitter<number>();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    const query = {
      limit: this.pagination.limit,
      offset: (this.pagination.page - 1) * this.pagination.limit
    };

    this.itemsService.getUserItems(query, this.user.id, this.itemsStatus).subscribe(res => {
      this.loading = false;
      this.items = res.data.map((item: Item) => Object.assign(new Item(), item));

      this.pagination = { page: res.pagination.offset / res.pagination.limit + 1, ...res.pagination };

      if (this.editMode) {
        this.router.navigate([], { queryParams: { page: this.pagination.page }, queryParamsHandling: 'merge' });
      }

      this.itemsCount.emit(res.pagination.total);
    });
  }

  onMarkAsForSale(item: Item) {
    this.itemsService.updateItem(item.id, { status: 'for_sale' }).subscribe(() => {
      this.loadItems();
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
      this.loadItems();
    });
  }

  onEditItem(item: Item) {
    this.router.navigate(['catalog', 'edit', item.id]);
  }

  onDeleteItem(item: Item) {
    this.itemsService.deleteItem(item.id).subscribe(() => {
      this.loadItems();
    });
  }

  onTooltipChange(isOpen: boolean, item: Item) {
    this.itemTooltipOpen = isOpen ? item : null;
  }

  onConfirmChange(isOpen: boolean, item: Item) {
    this.itemConfirmOpen = isOpen ? item : null;
  }
}
