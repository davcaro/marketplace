import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { filter, map, tap } from 'rxjs/operators';

declare let gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        tap((event: NavigationEnd) => {
          gtag('config', environment.analytics.id, {
            page_path: event.urlAfterRedirects
          });
        }),
        map(() => {
          let child = this.route.firstChild;

          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (child.snapshot.data && child.snapshot.data['title']) {
              return child.snapshot.data['title'];
            } else {
              return null;
            }
          }

          return null;
        })
      )
      .subscribe((title: any) => {
        if (title) {
          this.titleService.setTitle(title + ' - Marketplace');
        }
      });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }
}
