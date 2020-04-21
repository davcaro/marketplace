import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemsService } from '../items.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/category.model';
import { FilterItemsService, Filters, Order, PublicationDate } from '../filter-items.service';

@Component({
  selector: 'app-filter-items',
  templateUrl: './filter-items.component.html',
  styleUrls: ['./filter-items.component.less']
})
export class FilterItemsComponent implements OnInit, OnDestroy {
  categories: Category[];
  filters: Filters;

  categoriesSubscription: Subscription;
  itemsSubscription: Subscription;
  filtersSubscription: Subscription;

  constructor(
    private itemsService: ItemsService,
    private filtersService: FilterItemsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categories = this.itemsService.categories.value;
    this.filters = this.filtersService.filters.value;
  }

  ngOnInit() {
    this.loadQuery(this.route.snapshot.queryParams);
    this.filtersService.filters.next(this.filters);

    this.filtersSubscription = this.filtersService.filters.subscribe(filters => {
      this.filters = filters;
    });

    this.categoriesSubscription = this.itemsService.categories.subscribe(categories => {
      this.categories = categories;

      // Reload the selected category, now that all categories have been loaded
      this.filters.category.selected =
        this.categories.find(category => category.id === +this.route.snapshot.queryParams.category) ||
        this.categories[0];

      this.filtersService.requestItems.next(false);
    });
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  closeCategoryPopover(): void {
    this.filters.category.isVisible = false;
  }

  closePricePopover(): void {
    this.filters.price.isVisible = false;
  }

  closePublicationPopover(): void {
    this.filters.publicationDate.isVisible = false;
  }

  closeOrderPopover(): void {
    this.filters.order.isVisible = false;
  }

  updateSlider() {
    // Force slider to update
    this.filters.price.range = this.filters.price.range.slice();
  }

  onSelectCategory(category: Category) {
    this.filters.category.isApplied = true;
    this.filters.category.selected = category;
    this.updateFilter({ category: category.id });

    this.closeCategoryPopover();
  }

  onSelectPriceRange() {
    this.filters.price.isApplied = true;
    this.updateFilter({ min_price: this.filters.price.range[0], max_price: this.filters.price.range[1] });
  }

  onSelectPublicationDate(publicationOption: PublicationDate) {
    this.filters.publicationDate.isApplied = true;
    this.filters.publicationDate.selected = publicationOption;
    this.updateFilter({ published: publicationOption.value });
  }

  onSelectOrder(order: Order) {
    this.filters.order.isApplied = true;
    this.filters.order.selected = order;
    this.updateFilter({ order: order.value });
  }

  onClearFilters() {
    this.router.navigate(['search']);

    this.filtersService.clearFilters();

    this.filtersService.requestItems.next(true);
  }

  private updateFilter(queryParams: object) {
    this.router.navigate(['search'], { queryParams, queryParamsHandling: 'merge' });
    this.filtersService.filters.next(this.filters);
    this.filtersService.requestItems.next(true);
  }

  private isInsideLimits(price: number) {
    return price >= this.filters.price.limits[0] && price <= this.filters.price.limits[1];
  }

  private loadQuery(params: Params) {
    this.filters.category.isApplied = !!params.category;
    this.filters.price.isApplied = !!params.min_price || !!params.max_price;
    this.filters.publicationDate.isApplied = !!params.published;
    this.filters.order.isApplied = !!params.order;

    this.filters.keywords = params.keywords;

    this.filters.category.selected = this.categories[0];

    if (
      params.min_price &&
      this.isInsideLimits(params.min_price) &&
      (!params.max_price || params.min_price <= params.max_price)
    ) {
      this.filters.price.range[0] = +params.min_price;
    }
    if (
      params.max_price &&
      this.isInsideLimits(params.max_price) &&
      (!params.min_price || params.max_price >= params.min_price)
    ) {
      this.filters.price.range[1] = +params.max_price;
    }

    this.filters.publicationDate.selected = this.filters.publicationDate.options.find(
      date => date.value === params.published
    );

    this.filters.order.selected = this.filters.order.options.find(order => order.value === params.order);
  }
}
