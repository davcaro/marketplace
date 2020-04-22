import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { AuthGuard } from './auth/auth.guard';
import { UploadItemComponent } from './items/upload-item/upload-item.component';
import { ViewItemComponent } from './items/view-item/view-item.component';
import { ItemResolverService } from './items/item-resolver.service';
import { SearchItemsComponent } from './items/search-items/search-items.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ViewUserComponent } from './users/view-user/view-user.component';
import { UserResolverService } from './users/user-resolver.service';

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
      { path: 'upload', component: UploadItemComponent },
      { path: 'items', component: CatalogComponent, data: { itemsStatus: '' } },
      { path: 'sold', component: CatalogComponent, data: { itemsStatus: 'sold' } },
      {
        path: 'edit/:id',
        component: UploadItemComponent,
        resolve: { item: ItemResolverService },
        data: { resolverCanEdit: true }
      }
    ]
  },
  { path: 'search', component: SearchItemsComponent },
  { path: 'item/:id', component: ViewItemComponent, resolve: { item: ItemResolverService } },
  { path: 'user/:id', component: ViewUserComponent, resolve: { user: UserResolverService } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
