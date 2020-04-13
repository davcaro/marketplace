import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthModalService } from './auth-modal.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { ArticlesService } from 'src/app/articles/articles.service';
import { Category } from '../category.model';

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

  authModalIsVisible: boolean;
  authModalView: string;

  authModalVisibilitySubscription: Subscription;
  authModalViewSubscription: Subscription;
  userSubscription: Subscription;
  categoriesSubscription: Subscription;
  queryParamsSubscription: Subscription;

  constructor(
    private authModalService: AuthModalService,
    private authService: AuthService,
    private articlesService: ArticlesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.user = authService.user.value;
    this.categories = articlesService.categories.value;
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
    this.categoriesSubscription = this.articlesService.categories.subscribe(categories => {
      this.categories = categories;
    });
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.form.controls.keywords.setValue(params.keywords);
    });
  }

  ngOnDestroy() {
    this.authModalVisibilitySubscription.unsubscribe();
    this.authModalViewSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.categoriesSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
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

  onUploadArticle(): void {
    if (this.authService.user.value) {
      this.router.navigate(['catalog', 'upload']);
    } else {
      this.showAuthModal();
    }
  }

  submitForm() {
    const { category, keywords } = this.form.value;

    this.router.navigate(['search'], { queryParams: { category, keywords } });
  }
}
