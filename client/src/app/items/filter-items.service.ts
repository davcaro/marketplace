import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Category } from '../shared/category.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.model';
import { ActivatedRoute } from '@angular/router';
import { ItemsService } from './items.service';

export interface PublicationDate {
  label: string;
  value: string;
}

export interface Order {
  label: string;
  value: string;
  icon: string;
}

export interface Filters {
  keywords: string;
  category: { isVisible: boolean; isApplied: boolean; selected: Category };
  price: { isVisible: boolean; isApplied: boolean; limits: number[]; range: number[] };
  publicationDate: {
    isVisible: boolean;
    isApplied: boolean;
    selected: PublicationDate;
    options: PublicationDate[];
  };
  order: {
    isVisible: boolean;
    isApplied: boolean;
    selected: Order;
    options: Order[];
  };
  location: {
    isVisible: boolean;
    isApplied: boolean;
    userLocation: { latitude: number; longitude: number; place_name: string };
    distanceSelected: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FilterItemsService {
  user: User;
  categories: Category[];
  filters: BehaviorSubject<Filters>;
  requestItems: Subject<boolean>;
  distanceMarks: any;

  userSubscription: Subscription;

  constructor(private route: ActivatedRoute, private authService: AuthService, private itemsService: ItemsService) {
    this.authService.user.subscribe(user => {
      this.user = user;
    });

    this.itemsService.categories.subscribe(categories => {
      this.categories = categories;
    });

    this.requestItems = new Subject<boolean>();

    this.distanceMarks = {
      1: { label: '1 Km', value: 1, zoom: 13 },
      2: { label: '5 Km', value: 5, zoom: 10 },
      3: { label: '10 Km', value: 10, zoom: 9 },
      4: { label: '30 Km', value: 30, zoom: 8 },
      5: { label: '50 Km', value: 50, zoom: 7 },
      6: { label: '100 Km', value: 100, zoom: 6 },
      7: { label: '200 Km', value: 200, zoom: 5 },
      8: { label: 'Sin límite', value: 600, zoom: 4 }
    };

    this.filters = new BehaviorSubject<Filters>({
      keywords: null,
      category: { isVisible: false, isApplied: false, selected: null },
      price: { isVisible: false, isApplied: false, limits: [0, 1000000], range: [0, 1000000] },
      publicationDate: {
        isVisible: false,
        isApplied: false,
        selected: null,
        options: [
          { label: '24 Horas', value: '24h' },
          { label: '7 Días', value: '7d' },
          { label: '1 Mes', value: '1m' },
          { label: '3 Meses', value: '3m' }
        ]
      },
      order: {
        isVisible: false,
        isApplied: false,
        selected: null,
        options: [
          { label: 'Fecha: Más recientes', value: 'newest', icon: 'clock-circle' },
          { label: 'Fecha: Más antiguos', value: 'oldest', icon: 'clock-circle' },
          { label: 'Precio: de menor a mayor', value: 'lowest_price', icon: 'euro' },
          { label: 'Precio: de mayor a menor', value: 'highest_price', icon: 'euro' }
        ]
      },
      location: {
        isVisible: false,
        isApplied: false,
        userLocation: { latitude: 40.4167596, longitude: -3.7038584, place_name: null },
        distanceSelected: 2
      }
    });
  }

  clearFilters() {
    const filters = this.filters.value;

    filters.category.isApplied = false;
    filters.price.isApplied = false;
    filters.publicationDate.isApplied = false;
    filters.location.isApplied = false;
    filters.order.isApplied = false;

    filters.keywords = null;
    filters.category.selected = null;
    filters.price.range = [0, 10000];
    filters.publicationDate.selected = null;
    filters.location.distanceSelected = 2;
    filters.order.selected = null;

    if (this.user && this.user.location) {
      filters.location.userLocation = {
        latitude: +this.user.location.latitude,
        longitude: +this.user.location.longitude,
        place_name: null
      };
    } else {
      filters.location.userLocation = { latitude: 40.4167596, longitude: -3.7038584, place_name: null };
    }

    this.filters.next(filters);
  }

  getQuery() {
    const filters = this.filters.value;

    const query: any = {};

    if (filters.price.isApplied) {
      query.min_price = filters.price.range[0];
      query.max_price = filters.price.range[1];
    }
    if (filters.keywords) {
      query.keywords = filters.keywords;
    }
    if (filters.category.isApplied) {
      query.category = filters.category.selected.id;
    }
    if (filters.publicationDate.isApplied) {
      query.published = filters.publicationDate.selected.value;
    }
    if (filters.location.isApplied) {
      query.distance = this.getDistanceSelected().value;
      query.latitude = filters.location.userLocation.latitude;
      query.longitude = filters.location.userLocation.longitude;
    }
    if (filters.order.isApplied) {
      query.order = filters.order.selected.value;
    }

    return query;
  }

  getDistanceSelected() {
    return this.distanceMarks[this.filters.value.location.distanceSelected];
  }

  private isInsideLimits(price: number) {
    return price >= this.filters.value.price.limits[0] && price <= this.filters.value.price.limits[1];
  }

  loadFilters() {
    const params = this.route.snapshot.queryParams;
    const filters = this.filters.value;

    filters.category.isApplied = !!params.category;
    filters.price.isApplied = !!params.min_price || !!params.max_price;
    filters.publicationDate.isApplied = !!params.published;
    filters.location.isApplied = !!params.distance || !!params.latitude || !!params.longitude;
    filters.order.isApplied = !!params.order;

    filters.keywords = params.keywords;

    filters.category.selected = this.categories.find(category => category.id === params.category) || this.categories[0];

    if (
      params.min_price &&
      this.isInsideLimits(params.min_price) &&
      (!params.max_price || params.min_price <= params.max_price)
    ) {
      filters.price.range[0] = +params.min_price;
    }
    if (
      params.max_price &&
      this.isInsideLimits(params.max_price) &&
      (!params.min_price || params.max_price >= params.min_price)
    ) {
      filters.price.range[1] = +params.max_price;
    }

    filters.publicationDate.selected = filters.publicationDate.options.find(date => date.value === params.published);

    if (params.latitude && params.longitude) {
      filters.location.userLocation = {
        latitude: +params.latitude,
        longitude: +params.longitude,
        place_name: null
      };
    }

    if (params.distance) {
      for (const key in this.distanceMarks) {
        if (this.distanceMarks[key].value === +params.distance) {
          filters.location.distanceSelected = +key;
        }
      }
    }

    filters.order.selected = filters.order.options.find(order => order.value === params.order);

    this.filters.next(filters);
  }
}
