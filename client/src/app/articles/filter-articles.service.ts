import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Category } from '../shared/category.model';

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
}

@Injectable({
  providedIn: 'root'
})
export class FilterArticlesService {
  filters: BehaviorSubject<Filters>;
  requestArticles: Subject<boolean>;

  constructor() {
    this.requestArticles = new Subject<boolean>();

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
      }
    });
  }

  clearFilters() {
    const filters = this.filters.value;

    filters.category.isApplied = false;
    filters.price.isApplied = false;
    filters.publicationDate.isApplied = false;
    filters.order.isApplied = false;

    filters.keywords = null;
    filters.category.selected = null;
    filters.price.range = [0, 10000];
    filters.publicationDate.selected = null;
    filters.order.selected = null;

    this.filters.next(filters);
  }

  getQuery() {
    const filters = this.filters.value;

    const query: any = {
      min_price: filters.price.range[0],
      max_price: filters.price.range[1]
    };

    if (filters.keywords) {
      query.keywords = filters.keywords;
    }
    if (filters.category.selected) {
      query.category = filters.category.selected.id;
    }
    if (filters.publicationDate.selected) {
      query.published = filters.publicationDate.selected.value;
    }
    if (filters.order.selected) {
      query.order = filters.order.selected.value;
    }

    return query;
  }
}
