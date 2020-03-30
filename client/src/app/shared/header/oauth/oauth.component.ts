import { Component } from '@angular/core';
import { AuthModalService } from '../auth-modal.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.less']
})
export class OauthComponent {
  constructor(private authModalService: AuthModalService) {}

  onLogin() {
    this.authModalService.login();
  }

  onSignUp() {
    this.authModalService.signUp();
  }
}
