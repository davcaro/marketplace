import { Component } from '@angular/core';
import { AuthModalService } from '../auth-modal.service';

@Component({
  selector: 'app-auth-selector',
  templateUrl: './auth-selector.component.html',
  styleUrls: ['./auth-selector.component.less']
})
export class AuthSelectorComponent {
  constructor(private authModalService: AuthModalService) {}

  onLogin() {
    this.authModalService.login();
  }

  onSignUp() {
    this.authModalService.signUp();
  }
}
