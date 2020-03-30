import { Component, OnInit } from '@angular/core';
import { AuthModalService } from '../auth-modal.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private authModalService: AuthModalService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });
  }

  submitForm(): void {
    for (var i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }

    console.log(this.form);
  }

  onResetPassword(): void {
    this.authModalService.resetPassword();
  }

  onSignUp(): void {
    this.authModalService.signUp();
  }
}
