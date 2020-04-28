import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { Category } from '../shared/category.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/user.model';

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
    userLocation: { latitude: number; longitude: number };
    distanceSelected: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FilterItemsService {
  user: User;
  filters: BehaviorSubject<Filters>;
  requestItems: Subject<boolean>;
  distanceMarks: any;

  userSubscription: Subscription;

  constructor(private authService: AuthService) {
    this.authService.user.subscribe(user => {
      this.user = user;
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
        userLocation: { latitude: 40.4167596, longitude: -3.7038584 },
        distanceSelected: 8
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
    filters.location.distanceSelected = 8;
    filters.order.selected = null;

    if (this.user && this.user.location) {
      filters.location.userLocation = {
        latitude: +this.user.location.latitude,
        longitude: +this.user.location.longitude
      };
    } else {
      filters.location.userLocation = { latitude: 40.4167596, longitude: -3.7038584 };
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
}
