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

  authModalViewSubscription: Subscription;

  constructor(private authModalService: AuthModalService) {
    this.authModalIsVisible = false;

    this.authModalViewSubscription = this.authModalService.authModalViewChange.subscribe(value => {
      this.authModalView = value;
    });
  }

  ngOnDestroy() {
    this.authModalViewSubscription.unsubscribe();
  }

  showAuthModal(): void {
    this.authModalIsVisible = true;
    this.authModalService.oauth();
  }

  onAuthModalBack(): void {
    this.authModalService.oauth();
  }

  closeAuthModal(): void {
    this.authModalIsVisible = false;
    this.authModalService.oauth();
  }
}
