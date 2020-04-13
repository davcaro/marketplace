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
  categoryVisible: boolean;
  priceVisible: boolean;
  publicationVisible: boolean;
  orderVisible: boolean;
  priceLimits: number[];
  priceRange: number[];
  selectedCategory: Category;
  selectedPublication: { label: string; value: string };
  publicationOptions: { label: string; value: string }[];
  selectedOrder: { label: string; value: string; icon: string };
  orderOptions: { label: string; value: string; icon: string }[];
  appliedFilters: { category: boolean; price: boolean; publicationDate: boolean; order: boolean };

  queryParamsSubscription: Subscription;
  categoriesSubscription: Subscription;
  articlesSubscription: Subscription;

  constructor(private articlesService: ArticlesService, private router: Router, private route: ActivatedRoute) {
    this.publicationOptions = [
      { label: '24 Horas', value: '24h' },
      { label: '7 Días', value: '7d' },
      { label: '1 Mes', value: '1m' },
      { label: '3 Meses', value: '3m' }
    ];
    this.orderOptions = [
      { label: 'Fecha: Más recientes', value: 'newest', icon: 'clock-circle' },
      { label: 'Fecha: Más antiguos', value: 'oldest', icon: 'clock-circle' },
      { label: 'Precio: de menor a mayor', value: 'lowest_price', icon: 'euro' },
      { label: 'Precio: de mayor a menor', value: 'highest_price', icon: 'euro' }
    ];

    this.categories = this.articlesService.categories.value;
    this.priceLimits = [1, 1000000];
    this.priceRange = [1, 1000000];
  }

  ngOnInit() {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.appliedFilters = {
        category: !!params.category,
        price: !!params.min_price || !!params.max_price,
        publicationDate: !!params.published,
        order: !!params.order
      };

      if (params.category) {
        this.selectedCategory =
          this.categories.find(category => category.id === +params.category) || this.categories[0];
      } else {
        this.selectedCategory = this.categories[0];
      }

      if (
        params.min_price &&
        this.isInsideLimits(params.min_price) &&
        (!params.max_price || params.min_price <= params.max_price)
      ) {
        this.priceRange[0] = +params.min_price;
      }
      if (
        params.max_price &&
        this.isInsideLimits(params.max_price) &&
        (!params.min_price || params.max_price >= params.min_price)
      ) {
        this.priceRange[1] = +params.max_price;
      }

      this.selectedPublication = this.publicationOptions.find(date => date.value === params.published);

      this.selectedOrder = this.orderOptions.find(order => order.value === params.order);
    });

    this.categoriesSubscription = this.articlesService.categories.subscribe(categories => {
      this.categories = categories;

      // Reload the selected category, now that all categories have been loaded
      this.selectedCategory =
        this.categories.find(category => category.id === +this.route.snapshot.queryParams.category) ||
        this.categories[0];
    });

    this.articlesSubscription = this.articlesService.articles.subscribe(articles => {
      this.priceLimits = [5, 50];

      if (!this.isInsideLimits(this.priceRange[0])) {
        this.priceRange[0] = this.priceLimits[0];
      }
      if (!this.isInsideLimits(this.priceRange[1])) {
        this.priceRange[1] = this.priceLimits[1];
      }
    });
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  closeCategoryPopover(): void {
    this.categoryVisible = false;
  }

  closePricePopover(): void {
    this.priceVisible = false;
  }

  closePublicationPopover(): void {
    this.publicationVisible = false;
  }

  closeOrderPopover(): void {
    this.orderVisible = false;
  }

  updateSlider() {
    // Force slider to update
    this.priceRange = this.priceRange.slice();
  }

  onSelectCategory(category: number) {
    this.updateQuery({ category });

    this.closeCategoryPopover();
  }

  onSelectPriceRange() {
    this.updateQuery({ min_price: this.priceRange[0], max_price: this.priceRange[1] });
  }

  onSelectPublicationDate(published: string) {
    this.updateQuery({ published });
  }

  onSelectOrder(order: string) {
    this.updateQuery({ order });
  }

  onClearFilters() {
    this.router.navigate(['search']);

    this.selectedCategory = this.categories[0];
    this.priceRange = this.priceLimits.slice();
    this.selectedPublication = null;
    this.selectedOrder = null;
  }

  updateQuery(queryParams: object) {
    this.router.navigate(['search'], { queryParams, queryParamsHandling: 'merge' });
  }

  isInsideLimits(price: number) {
    return price >= this.priceLimits[0] && price <= this.priceLimits[1];
  }
}
