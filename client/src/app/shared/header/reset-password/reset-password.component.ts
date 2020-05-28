import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthModalService } from '../auth-modal.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(private authModalService: AuthModalService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  submitForm(): void {
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
    }
  }

  onResetPassword(): void {
    this.authModalService.resetPassword();
  }

  onLogin(): void {
    this.authModalService.login();
  }
}
