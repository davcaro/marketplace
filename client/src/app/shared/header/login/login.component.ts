import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../auth-modal.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  unknownError: boolean;

  constructor(private authModalService: AuthModalService, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  submitForm(): void {
    // Force validation
    for (var i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.valid) {
      this.unknownError = false;
      this.login();
    }
  }

  login(): void {
    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe(
      res => {
        this.authModalService.closeModal();
      },
      err => {
        switch (err.statusCode) {
          case 400:
            this.form.controls['email'].setErrors({ email: true });
            break;
          case 401:
            this.form.controls['password'].setErrors({ wrong: true });
            break;
          case 404:
            this.form.controls['email'].setErrors({ wrong: true });
            break;
          default:
            this.unknownError = true;
        }
      }
    );
  }

  onResetPassword(): void {
    this.authModalService.resetPassword();
  }

  onSignUp(): void {
    this.authModalService.signUp();
  }
}
