import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService implements OnInit {
  public isVisible: boolean;
  public view: string;

  public visibilityChange: Subject<boolean>;
  public viewChange: Subject<string>;

  constructor() {
    this.isVisible = false;
    this.view = null;

    this.visibilityChange = new Subject<boolean>();
    this.viewChange = new Subject<string>();
  }

  ngOnInit() {
    this.viewChange.subscribe(value => {
      this.view = value;
    });

    this.visibilityChange.subscribe(value => {
      this.isVisible = value;
    });
  }

  closeModal(): void {
    this.visibilityChange.next(false);
  }

  oauth(): void {
    this.viewChange.next('oauth');
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
