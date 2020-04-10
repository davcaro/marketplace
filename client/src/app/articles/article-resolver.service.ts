import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ArticlesService } from './articles.service';
import { Observable } from 'rxjs';
import { Article } from './article.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleResolverService implements Resolve<any> {
  constructor(private articlesService: ArticlesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Article> {
    return this.articlesService.getArticle(+route.paramMap.get('id'));
  }
}
