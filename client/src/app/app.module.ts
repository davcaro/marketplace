import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import en from '@angular/common/locales/en';
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

registerLocaleData(en);

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
    UploadArticleComponent
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
