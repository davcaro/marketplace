import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { ViewFavoritesComponent } from './items/view-favorites/view-favorites.component';
import { ChatsListComponent } from './chat/chats-list/chats-list.component';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatResolverService } from './chat/chat-resolver.service';
import { ReviewsComponent } from './reviews/reviews.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingPageComponent,
    data: { title: 'Marketplace - La aplicación para comprar y vender artículos de segunda mano' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      { path: 'info', component: ProfileInfoComponent, data: { title: 'Mi perfil' } },
      { path: 'account', component: ProfileAccountComponent, data: { title: 'Mi cuenta' } }
    ]
  },
  {
    path: 'catalog',
    canActivate: [AuthGuard],
    children: [
      { path: 'upload', component: UploadItemComponent, data: { title: 'Subir un nuevo artículo' } },
      { path: 'items', component: CatalogComponent, data: { itemsStatus: '', title: 'Mis artículos en venta' } },
      { path: 'sold', component: CatalogComponent, data: { itemsStatus: 'sold', title: 'Mis artículos vendidos' } },
      {
        path: 'edit/:id',
        component: UploadItemComponent,
        resolve: { item: ItemResolverService },
        data: { resolverCanEdit: true }
      }
    ]
  },
  {
    path: 'reviews',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ReviewsComponent,
        data: { reviewsStatus: 'own', title: 'Mis valoraciones' }
      },
      {
        path: 'others',
        component: ReviewsComponent,
        data: { reviewsStatus: 'others', title: 'Valoraciones sobre mí' }
      },
      {
        path: 'pending',
        component: ReviewsComponent,
        data: { reviewsStatus: 'pending', title: 'Valoraciones pendientes' }
      }
    ]
  },
  { path: 'search', component: SearchItemsComponent, data: { title: 'Buscador de artículos' } },
  { path: 'item/:id', component: ViewItemComponent, resolve: { item: ItemResolverService } },
  { path: 'user/:id', component: ViewUserComponent, resolve: { user: UserResolverService } },
  {
    path: 'favorites',
    canActivate: [AuthGuard],
    component: ViewFavoritesComponent,
    data: { title: 'Mis favoritos' }
  },
  {
    path: 'chat',
    component: ChatsListComponent,
    data: { title: 'Mis conversaciones' },
    canActivate: [AuthGuard],
    children: [{ path: ':id', component: ChatComponent, resolve: { chat: ChatResolverService } }]
  },
  {
    path: 'statistics',
    canActivate: [AuthGuard],
    component: StatisticsComponent,
    data: { title: 'Mis estadísticas' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
