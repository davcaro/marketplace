import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from 'src/app/shared/category.model';
import { ArticlesService } from '../articles.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-articles',
  templateUrl: './filter-articles.component.html',
  styleUrls: ['./filter-articles.component.less']
})
export class FilterArticlesComponent implements OnInit, OnDestroy {
  categories: Category[];

  categoryFilter: { isVisible: boolean; isApplied: boolean; selected: Category };
  priceFilter: { isVisible: boolean; isApplied: boolean; limits: number[]; range: number[] };
  publicationDateFilter: {
    isVisible: boolean;
    isApplied: boolean;
    selected: { label: string; value: string };
    options: { label: string; value: string }[];
  };
  orderFilter: {
    isVisible: boolean;
    isApplied: boolean;
    selected: { label: string; value: string; icon: string };
    options: { label: string; value: string; icon: string }[];
  };

  queryParamsSubscription: Subscription;
  categoriesSubscription: Subscription;
  articlesSubscription: Subscription;

  constructor(private articlesService: ArticlesService, private router: Router, private route: ActivatedRoute) {
    this.categories = this.articlesService.categories.value;

    this.categoryFilter = { isVisible: false, isApplied: false, selected: null };
    this.priceFilter = { isVisible: false, isApplied: false, limits: [1, 1000000], range: [1, 1000000] };
    this.publicationDateFilter = {
      isVisible: false,
      isApplied: false,
      selected: null,
      options: [
        { label: '24 Horas', value: '24h' },
        { label: '7 Días', value: '7d' },
        { label: '1 Mes', value: '1m' },
        { label: '3 Meses', value: '3m' }
      ]
    };
    this.orderFilter = {
      isVisible: false,
      isApplied: false,
      selected: null,
      options: [
        { label: 'Fecha: Más recientes', value: 'newest', icon: 'clock-circle' },
        { label: 'Fecha: Más antiguos', value: 'oldest', icon: 'clock-circle' },
        { label: 'Precio: de menor a mayor', value: 'lowest_price', icon: 'euro' },
        { label: 'Precio: de mayor a menor', value: 'highest_price', icon: 'euro' }
      ]
    };
  }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.categoryFilter.isApplied = !!params.category;
      this.priceFilter.isApplied = !!params.min_price || !!params.max_price;
      this.publicationDateFilter.isApplied = !!params.published;
      this.orderFilter.isApplied = !!params.order;

      if (params.category) {
        this.categoryFilter.selected =
          this.categories.find(category => category.id === +params.category) || this.categories[0];
      } else {
        this.categoryFilter.selected = this.categories[0];
      }

      if (
        params.min_price &&
        this.isInsideLimits(params.min_price) &&
        (!params.max_price || params.min_price <= params.max_price)
      ) {
        this.priceFilter.range[0] = +params.min_price;
      }
      if (
        params.max_price &&
        this.isInsideLimits(params.max_price) &&
        (!params.min_price || params.max_price >= params.min_price)
      ) {
        this.priceFilter.range[1] = +params.max_price;
      }

      this.publicationDateFilter.selected = this.publicationDateFilter.options.find(
        date => date.value === params.published
      );

      this.orderFilter.selected = this.orderFilter.options.find(order => order.value === params.order);
    });

    this.categoriesSubscription = this.articlesService.categories.subscribe(categories => {
      this.categories = categories;

      // Reload the selected category, now that all categories have been loaded
      this.categoryFilter.selected =
        this.categories.find(category => category.id === +this.route.snapshot.queryParams.category) ||
        this.categories[0];
    });

    this.articlesSubscription = this.articlesService.articles.subscribe(articles => {
      this.priceFilter.limits = [5, 50];

      if (!this.isInsideLimits(this.priceFilter.range[0])) {
        this.priceFilter.range[0] = this.priceFilter.limits[0];
      }
      if (!this.isInsideLimits(this.priceFilter.range[1])) {
        this.priceFilter.range[1] = this.priceFilter.limits[1];
      }
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  closeCategoryPopover(): void {
    this.categoryFilter.isVisible = false;
  }

  closePricePopover(): void {
    this.priceFilter.isVisible = false;
  }

  closePublicationPopover(): void {
    this.publicationDateFilter.isVisible = false;
  }

  closeOrderPopover(): void {
    this.orderFilter.isVisible = false;
  }

  updateSlider() {
    // Force slider to update
    this.priceFilter.range = this.priceFilter.range.slice();
  }

  onSelectCategory(category: number) {
    this.updateQuery({ category });

    this.closeCategoryPopover();
  }

  onSelectPriceRange() {
    this.updateQuery({ min_price: this.priceFilter.range[0], max_price: this.priceFilter.range[1] });
  }

  onSelectPublicationDate(published: string) {
    this.updateQuery({ published });
  }

  onSelectOrder(order: string) {
    this.updateQuery({ order });
  }

  onClearFilters() {
    this.router.navigate(['search']);

    this.categoryFilter.selected = this.categories[0];
    this.priceFilter.range = this.priceFilter.limits.slice();
    this.publicationDateFilter.selected = null;
    this.orderFilter.selected = null;
  }

  updateQuery(queryParams: object) {
    this.router.navigate(['search'], { queryParams, queryParamsHandling: 'merge' });
  }

  isInsideLimits(price: number) {
    return price >= this.priceFilter.limits[0] && price <= this.priceFilter.limits[1];
  }
}
