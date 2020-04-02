import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { InfoComponent } from './profile/info/info.component';
import { AccountComponent } from './profile/account/account.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HeaderComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'info' },
      { path: 'info', component: InfoComponent },
      { path: 'account', component: AccountComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
