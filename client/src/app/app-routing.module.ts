import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { AuthGuard } from './auth/auth.guard';
import { UploadArticleComponent } from './articles/upload-article/upload-article.component';
import { ViewArticleComponent } from './articles/view-article/view-article.component';
import { ArticleResolverService } from './articles/article-resolver.service';
import { SearchArticlesComponent } from './articles/search-articles/search-articles.component';
import { ArticlesCatalogComponent } from './catalog/articles-catalog/articles-catalog.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HeaderComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      { path: 'info', component: ProfileInfoComponent },
      { path: 'account', component: ProfileAccountComponent }
    ]
  },
  {
    path: 'catalog',
    canActivate: [AuthGuard],
    children: [
      { path: 'upload', component: UploadArticleComponent },
      { path: 'articles', component: ArticlesCatalogComponent }
    ]
  },
  { path: 'search', component: SearchArticlesComponent },
  { path: 'article/:id', component: ViewArticleComponent, resolve: { article: ArticleResolverService } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
