import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../item.model';
import { ItemsService } from '../items.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterItemsService } from '../filter-items.service';

@Component({
  selector: 'app-search-items',
  templateUrl: './search-items.component.html',
  styleUrls: ['./search-items.component.less']
})
export class SearchItemsComponent implements OnInit, OnDestroy {
  apiUrl: string;
  loading: boolean;
  items: Item[];
  pagination: { page: number; limit: number; offset: number; total: number };

  activeRequest: Subscription;
  requestsSubscription: Subscription;
  queryParamsSubscription: Subscription;

  constructor(
    private itemsService: ItemsService,
    private filtersService: FilterItemsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.items = [];

    const page = +this.route.snapshot.queryParams.page;
    this.pagination = { page: page ? page : 1, limit: 30, offset: 0, total: null };

    this.activeRequest = new Subscription(null);
  }

  ngOnInit(): void {
    this.requestsSubscription = this.filtersService.requestItems.subscribe(resetPagination => {
      this.loading = true;
      this.activeRequest.unsubscribe();

      if (resetPagination) {
        this.pagination.page = 1;
      }
      this.loadItems();
    });

    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (this.activeRequest.closed) {
        this.filtersService.loadFilters();
        this.pagination.page = +this.route.snapshot.queryParams.page || 1;
        this.filtersService.requestItems.next(false);
      }
    });
  }

  ngOnDestroy() {
    this.requestsSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
  }

  onClearFilters() {
    this.router.navigate(['search']);

    this.filtersService.clearFilters();

    this.filtersService.requestItems.next(true);
  }

  loadItems() {
    const query = this.filtersService.getQuery();

    query.limit = this.pagination.limit;
    query.offset = (this.pagination.page - 1) * this.pagination.limit;

    this.activeRequest = this.itemsService.getItems(query).subscribe(res => {
      this.loading = false;

      this.items = res.data.map(item => Object.assign(new Item(), item));
      this.itemsService.items.next(this.items);

      this.pagination = { page: res.pagination.offset / res.pagination.limit + 1, ...res.pagination };

      const params: any = { queryParamsHandling: 'merge' };
      // Avoid navigating to page 1 if there is no page specified
      if (!(!this.route.snapshot.queryParams.page && this.pagination.page === 1)) {
        params.queryParams = {
          page: this.pagination.page
        };
      }
      this.router.navigate(['search'], params);
    });
  }
}
