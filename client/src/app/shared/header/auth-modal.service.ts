import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService implements OnInit {
  private authModalView: string;

  public authModalViewChange: Subject<string>;

  constructor() {
    this.authModalView = null;

    this.authModalViewChange = new Subject<string>();
  }

  ngOnInit() {
    this.authModalViewChange.subscribe(value => {
      this.authModalView = value;
    });
  }

  oauth(): void {
    this.authModalViewChange.next('oauth');
  }

  login(): void {
    this.authModalViewChange.next('login');
  }

  signUp(): void {
    this.authModalViewChange.next('signup');
  }

  resetPassword(): void {
    this.authModalViewChange.next('reset');
  }
}
