import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';

declare let gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', environment.analytics.id, {
          page_path: event.urlAfterRedirects
        });
      }
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }
}
