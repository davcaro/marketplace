import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticlesService } from '../articles.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-articles',
  templateUrl: './search-articles.component.html',
  styleUrls: ['./search-articles.component.less']
})
export class SearchArticlesComponent implements OnInit {
  apiUrl: string;
  articles: Article[];

  constructor(private articlesService: ArticlesService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.articlesService.getArticles().subscribe(res => {
      this.articles = res.map(article => Object.assign(new Article(), article));
    });
  }
}
