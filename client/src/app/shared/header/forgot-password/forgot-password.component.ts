import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthModalService } from '../auth-modal.service';
import { UsersService } from 'src/app/users/users.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.less']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  unknownError: boolean;
  emailSent: boolean;

  constructor(private authModalService: AuthModalService, private usersService: UsersService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });
  }

  submitForm(): void {
    this.unknownError = false;
    this.emailSent = false;

    // Force validation
    for (const key in this.form.controls) {
      if (this.form.controls[key]) {
        this.form.controls[key].markAsTouched();
        this.form.controls[key].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      const email = this.form.value.email;

      this.usersService.forgotPassword(email).subscribe(
        res => {
          this.emailSent = true;
        },
        err => {
          switch (err.statusCode) {
            case 400:
              this.form.get('email').setErrors({ email: true });
              break;
            case 404:
              this.form.get('email').setErrors({ notFound: true });
              break;
            default:
              this.unknownError = true;
          }
        }
      );
    }
  }

  onForgotPassword(): void {
    this.authModalService.forgotPassword();
  }

  onLogin(): void {
    this.authModalService.login();
  }
}
