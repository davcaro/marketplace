import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ItemsService } from 'src/app/items/items.service';
import { Item } from 'src/app/items/item.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/users/user.model';
import { ChatService } from 'src/app/chat/chat.service';

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

  // Sell Modal
  itemModalOpen: Item;
  sellModalVisible: boolean;
  selectedBuyer: User;
  hasConfirmedBuyer: boolean;
  users: User[];
  rate: number;
  description: string;

  @Input() user: User;
  @Input() mode: string;
  @Input() itemsStatus: string;
  @Output() itemsCount: EventEmitter<number>;

  constructor(
    private itemsService: ItemsService,
    private chatService: ChatService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.loading = true;
    this.items = [];

    this.pagination = { page: 1, limit: 30, offset: 0, total: null };

    this.itemsCount = new EventEmitter<number>();
  }

  ngOnInit(): void {
    if (this.mode === 'edit' || this.mode === 'favorites') {
      this.pagination.page = +this.route.snapshot.queryParams.page || 1;
    }

    if (this.mode === 'favorites') {
      this.loadFavorites();
    } else {
      this.loadItems();
    }
  }

  loadItems() {
    const pagination = this.getPaginationQuery();

    this.itemsService
      .getUserItems(pagination, this.user.id, this.itemsStatus)
      .subscribe(this.handleItemsResponse.bind(this));
  }

  loadFavorites() {
    const pagination = this.getPaginationQuery();

    this.itemsService.getUserFavorites(pagination).subscribe(this.handleItemsResponse.bind(this));
  }

  getPaginationQuery(): { limit: number; offset: number } {
    return {
      limit: this.pagination.limit,
      offset: (this.pagination.page - 1) * this.pagination.limit
    };
  }

  handleItemsResponse(res): void {
    this.loading = false;
    this.items = res.data.map((item: Item) => Object.assign(new Item(), item));

    this.pagination = { page: res.pagination.offset / res.pagination.limit + 1, ...res.pagination };

    if (this.mode === 'edit' || this.mode === 'favorites') {
      this.router.navigate([], { queryParams: { page: this.pagination.page }, queryParamsHandling: 'merge' });
    }

    this.itemsCount.emit(res.pagination.total);
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

  onMarkAsSold(item: Item, review: boolean) {
    const data: { status: string; review?: { user: number; score: number; description: string } } = {
      status: 'sold'
    };
    if (review) {
      data.review = { user: this.selectedBuyer.id, score: this.rate, description: this.description };
    }

    this.itemsService.updateItem(item.id, data).subscribe(() => {
      this.closeSellModal();
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

  onRemoveFavorite(item: Item) {
    this.itemsService.removeFavorite(item.id).subscribe(() => {
      this.loadFavorites();
    });
  }

  showSellModal(item: Item): void {
    this.itemModalOpen = item;
    this.sellModalVisible = true;

    this.chatService.findUsersByItem(item.id).subscribe(users => {
      this.users = users;
    });
  }

  closeSellModal(): void {
    this.sellModalVisible = false;
    this.hasConfirmedBuyer = false;
    this.selectedBuyer = null;
    this.rate = null;
    this.description = null;
  }

  onConfirmBuyer(): void {
    this.hasConfirmedBuyer = true;
  }

  onModalBack(): void {
    this.hasConfirmedBuyer = false;
  }
}
