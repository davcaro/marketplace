import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { AuthGuard } from './auth/auth.guard';
import { UploadArticleComponent } from './articles/upload-article/upload-article.component';

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
    children: [{ path: 'upload', component: UploadArticleComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
