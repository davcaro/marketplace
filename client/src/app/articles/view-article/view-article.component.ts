import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../article.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.less']
})
export class ViewArticleComponent implements OnInit {
  apiUrl: string;
  article: Article;

  constructor(private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit(): void {
    this.article = Object.assign(new Article(), this.route.snapshot.data.article);
  }
}
