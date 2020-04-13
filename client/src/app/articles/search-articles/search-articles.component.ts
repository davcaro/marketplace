import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-articles',
  templateUrl: './search-articles.component.html',
  styleUrls: ['./search-articles.component.less']
})
export class SearchArticlesComponent implements OnInit {
  apiUrl: string;
  articles: Article[];
  loading: boolean;

  queryParamsSubscription: Subscription;
  activeRequest: Subscription;

  constructor(private articlesService: ArticlesService, private router: Router, private route: ActivatedRoute) {
    this.articles = [];
    this.apiUrl = environment.apiUrl;

    this.activeRequest = new Subscription(null);
  }

  ngOnInit(): void {
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.loading = true;
      this.activeRequest.unsubscribe();

      this.activeRequest = this.articlesService.getArticles(params).subscribe(res => {
        this.loading = false;

        this.articles = res.map(article => Object.assign(new Article(), article));

        this.articlesService.articles.next(this.articles);
      });
    });
  }

  onClearFilters() {
    this.router.navigate(['search']);
  }
}
