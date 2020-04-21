import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthModalService } from './auth-modal.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ItemsService } from 'src/app/items/items.service';
import { Category } from '../category.model';
import { FilterItemsService, Filters } from 'src/app/items/filter-items.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  apiUrl: string;
  user: User;
  form: FormGroup;
  categories: Category[];
  filters: Filters;

  authModalIsVisible: boolean;
  authModalView: string;

  authModalVisibilitySubscription: Subscription;
  authModalViewSubscription: Subscription;
  userSubscription: Subscription;
  categoriesSubscription: Subscription;
  filtersSubscription: Subscription;

  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService,
    private itemsService: ItemsService,
    private filtersService: FilterItemsService,
    private router: Router
  ) {
    this.apiUrl = environment.apiUrl;
    this.user = authService.user.value;
    this.categories = itemsService.categories.value;
    this.filters = filtersService.filters.value;
    this.authModalIsVisible = authModalService.isVisible;
    this.authModalView = authModalService.view;

    this.form = new FormGroup({
      category: new FormControl(this.categories[0].id),
      keywords: new FormControl(null)
    });
  }

  ngOnInit() {
    this.authModalVisibilitySubscription = this.authModalService.visibilityChange.subscribe(value => {
      this.authModalIsVisible = value;
    });
    this.authModalViewSubscription = this.authModalService.viewChange.subscribe(value => {
      this.authModalView = value;
    });
    this.userSubscription = this.authService.user.subscribe(() => {
      this.user = this.authService.user.value;
    });
    this.categoriesSubscription = this.itemsService.categories.subscribe(categories => {
      this.categories = categories;
    });
    this.filtersSubscription = this.filtersService.filters.subscribe(filters => {
      this.filters = filters;

      this.form.controls.keywords.setValue(filters.keywords);
    });
  }

  ngOnDestroy() {
    this.authModalVisibilitySubscription.unsubscribe();
    this.authModalViewSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
  }

  showAuthModal(): void {
    this.authModalService.visibilityChange.next(true);
    this.authModalService.oauth();
  }

  onAuthModalBack(): void {
    this.authModalService.oauth();
  }

  closeAuthModal(): void {
    this.authModalService.closeModal();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onUploadItem(): void {
    if (this.authService.user.value) {
      this.router.navigate(['catalog', 'upload']);
    } else {
      this.showAuthModal();
    }
  }

  submitForm() {
    const { category, keywords } = this.form.value;

    this.filtersService.clearFilters();
    this.filters.keywords = keywords;
    this.filters.category.isApplied = category !== -1 ? true : false;
    this.filters.category.selected = this.categories.find(cat => cat.id === category) || this.categories[0];
    this.filtersService.filters.next(this.filters);
    this.filtersService.requestItems.next(true);

    this.router.navigate(['search'], {
      queryParams: {
        category: category !== -1 ? category : null,
        keywords
      }
    });
  }
}
