import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterArticlesService } from '../filter-articles.service';

@Component({
  selector: 'app-search-articles',
  templateUrl: './search-articles.component.html',
  styleUrls: ['./search-articles.component.less']
})
export class SearchArticlesComponent implements OnInit, OnDestroy {
  apiUrl: string;
  loading: boolean;
  articles: Article[];
  pagination: { page: number; limit: number; offset: number; total: number };

  activeRequest: Subscription;
  requestsSubscription: Subscription;

  constructor(
    private articlesService: ArticlesService,
    private filtersService: FilterArticlesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.articles = [];

    const page = +this.route.snapshot.queryParams.page;
    this.pagination = { page: page ? page : 1, limit: 30, offset: 0, total: null };

    this.activeRequest = new Subscription(null);
  }

  ngOnInit(): void {
    this.requestsSubscription = this.filtersService.requestArticles.subscribe(resetPagination => {
      this.loading = true;
      this.activeRequest.unsubscribe();

      if (resetPagination) {
        this.pagination.page = 1;
      }
      this.loadArticles();
    });
  }

  ngOnDestroy() {
    this.requestsSubscription.unsubscribe();
  }

  onClearFilters() {
    this.router.navigate(['search']);

    this.filtersService.clearFilters();

    this.filtersService.requestArticles.next(true);
  }

  loadArticles() {
    const query = this.filtersService.getQuery();

    query.limit = this.pagination.limit;
    query.offset = (this.pagination.page - 1) * this.pagination.limit;

    this.activeRequest = this.articlesService.getArticles(query).subscribe(res => {
      this.loading = false;

      this.articles = res.data.map(article => Object.assign(new Article(), article));
      this.articlesService.articles.next(this.articles);

      this.pagination = { page: res.pagination.offset / res.pagination.limit + 1, ...res.pagination };
      this.router.navigate(['search'], { queryParams: { page: this.pagination.page }, queryParamsHandling: 'merge' });
    });
  }
}
