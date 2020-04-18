import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/app/articles/articles.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Article } from 'src/app/articles/article.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-articles-catalog',
  templateUrl: './articles-catalog.component.html',
  styleUrls: ['./articles-catalog.component.less']
})
export class ArticlesCatalogComponent implements OnInit {
  apiUrl: string;
  articles: { isSelected: boolean; article: Article }[];

  constructor(private articlesService: ArticlesService, private authService: AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.articlesService.getUserArticles(this.authService.user.value, 'for_sale').subscribe(res => {
      this.articles = res.data.map((article: Article) => {
        return {
          isSelected: false,
          article: Object.assign(new Article(), article)
        };
      });
    });
  }
}
