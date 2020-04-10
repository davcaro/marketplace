import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import es from '@angular/common/locales/es';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { OauthComponent } from './shared/header/oauth/oauth.component';
import { LoginComponent } from './shared/header/login/login.component';
import { SignupComponent } from './shared/header/signup/signup.component';
import { ResetPasswordComponent } from './shared/header/reset-password/reset-password.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ProfileComponent } from './profile/profile.component';
import { ProfileInfoComponent } from './profile/profile-info/profile-info.component';
import { ProfileAccountComponent } from './profile/profile-account/profile-account.component';
import { SiderComponent } from './shared/sider/sider.component';
import { UploadArticleComponent } from './articles/upload-article/upload-article.component';
import { ViewArticleComponent } from './articles/view-article/view-article.component';
import { TruncatePipe } from './shared/truncate.pipe';
import { SearchArticlesComponent } from './articles/search-articles/search-articles.component';
import { FilterArticlesComponent } from './articles/filter-articles/filter-articles.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SiderComponent,
    OauthComponent,
    LoginComponent,
    SignupComponent,
    ResetPasswordComponent,
    ProfileComponent,
    ProfileInfoComponent,
    ProfileAccountComponent,
    UploadArticleComponent,
    ViewArticleComponent,
    TruncatePipe,
    SearchArticlesComponent,
    FilterArticlesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-ES' },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
