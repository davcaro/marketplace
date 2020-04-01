import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthModalService } from './auth-modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnDestroy {
  authModalIsVisible: boolean;
  authModalView: string;

  authModalVisibilitySubscription: Subscription;
  authModalViewSubscription: Subscription;

  constructor(private authModalService: AuthModalService) {
    this.authModalIsVisible = authModalService.isVisible;
    this.authModalView = authModalService.view;

    this.authModalVisibilitySubscription = this.authModalService.visibilityChange.subscribe(value => {
      this.authModalIsVisible = value;
    });

    this.authModalViewSubscription = this.authModalService.viewChange.subscribe(value => {
      this.authModalView = value;
    });
  }

  ngOnDestroy() {
    this.authModalViewSubscription.unsubscribe();
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
