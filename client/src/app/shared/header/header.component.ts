import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthModalService } from './auth-modal.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user: User;
  authModalIsVisible: boolean;
  authModalView: string;

  authModalVisibilitySubscription: Subscription;
  authModalViewSubscription: Subscription;
  userSubscription: Subscription;

  constructor(private authModalService: AuthModalService, private authService: AuthService) {
    this.user = authService.user.value;

    this.authModalIsVisible = authModalService.isVisible;
    this.authModalView = authModalService.view;

    this.authModalVisibilitySubscription = this.authModalService.visibilityChange.subscribe(value => {
      this.authModalIsVisible = value;
    });

    this.authModalViewSubscription = this.authModalService.viewChange.subscribe(value => {
      this.authModalView = value;
    });
  }

  ngOnInit() {
    this.userSubscription = this.authService.user.subscribe(() => {
      this.user = this.authService.user.value;
    });
  }

  ngOnDestroy() {
    this.authModalVisibilitySubscription.unsubscribe();
    this.authModalViewSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  showAuthModal(): void {
    this.authModalService.visibilityChange.next(true);
    this.authModalService.oauth();
  }

  onAuthModalBack(): void {
    this.authModalService.oauth();
  }

  closeAuthModal(): void {
    this.authModalService.closeModal();
  }
}
