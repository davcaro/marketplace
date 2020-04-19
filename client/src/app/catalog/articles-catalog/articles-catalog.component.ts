import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/articles/articles.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Article } from 'src/app/articles/article.model';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-articles-catalog',
  templateUrl: './articles-catalog.component.html',
  styleUrls: ['./articles-catalog.component.less']
})
export class ArticlesCatalogComponent implements OnInit {
  apiUrl: string;
  articles: Article[];
  articleTooltipOpen: Article;
  articleConfirmOpen: Article;
  pagination: { page: number; limit: number; offset: number; total: number };

  constructor(
    private articlesService: ArticlesService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;

    const page = +this.route.snapshot.queryParams.page;
    this.pagination = { page: page ? page : 1, limit: 30, offset: 0, total: null };
  }

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    const query = {
      limit: this.pagination.limit,
      offset: (this.pagination.page - 1) * this.pagination.limit
    };

    this.articlesService.getUserArticles(query, this.authService.user.value).subscribe(res => {
      this.articles = res.data.map((article: Article) => Object.assign(new Article(), article));

      this.pagination = { page: res.pagination.offset / res.pagination.limit + 1, ...res.pagination };
      this.router.navigate([], { queryParams: { page: this.pagination.page }, queryParamsHandling: 'merge' });
    });
  }

  onMarkAsReserved(article: Article) {
    const status = article.status === 'for_sale' ? 'reserved' : 'for_sale';

    this.articlesService.updateArticle(article.id, { status }).subscribe(() => {
      article.status = status;
    });
  }

  onMarkAsSold(article: Article) {
    this.articlesService.updateArticle(article.id, { status: 'sold' }).subscribe(() => {
      this.articles.splice(this.articles.indexOf(article), 1);
    });
  }

  onEditArticle(article: Article) {
    this.router.navigate(['catalog', 'edit', article.id]);
  }

  onDeleteArticle(article: Article) {
    this.articlesService.deleteArticle(article.id).subscribe(() => {
      this.articles.splice(this.articles.indexOf(article), 1);
    });
  }

  onTooltipChange(isOpen: boolean, article: Article) {
    this.articleTooltipOpen = isOpen ? article : null;
  }

  onConfirmChange(isOpen: boolean, article: Article) {
    this.articleConfirmOpen = isOpen ? article : null;
  }
}
