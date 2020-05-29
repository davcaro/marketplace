import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  public isVisible: boolean;
  public view: string;

  public visibilityChange: Subject<boolean>;
  public viewChange: Subject<string>;

  constructor() {
    this.isVisible = false;
    this.view = null;

    this.visibilityChange = new Subject<boolean>();
    this.viewChange = new Subject<string>();

    this.viewChange.subscribe(value => {
      this.view = value;
    });

    this.visibilityChange.subscribe(value => {
      this.isVisible = value;
    });
  }

  showModal(): void {
    this.visibilityChange.next(true);
    this.authSelector();
  }

  closeModal(): void {
    this.visibilityChange.next(false);
  }

  authSelector(): void {
    this.viewChange.next('auth-selector');
  }

  login(): void {
    this.viewChange.next('login');
  }

  signUp(): void {
    this.viewChange.next('signup');
  }

  resetPassword(): void {
    this.viewChange.next('reset');
  }
}
