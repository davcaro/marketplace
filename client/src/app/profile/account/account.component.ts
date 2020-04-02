import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {
  form: FormGroup;
  user: User;
  passwordModalIsVisible: boolean;
  delAccModalIsVisible: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.user.value;

    this.form = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl(null, [Validators.required, this.confirmPassword.bind(this)])
    });
  }

  submitForm(): void {
    // Force validation
    for (var i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.valid) {
      // this.unknownError = false;
      // Send request
    }
  }

  confirmPassword(control: FormControl): { [err: string]: boolean } {
    if (this.form && control.value) {
      if (control.value !== this.form.controls.newPassword.value) {
        return { dontMatch: true };
      }
    }

    return null;
  }

  showPasswordModal(): void {
    this.passwordModalIsVisible = true;
  }

  passwordHandleCancel(): void {
    this.passwordModalIsVisible = false;
  }

  showDelAccModal(): void {
    this.delAccModalIsVisible = true;
  }

  delAccHandleCancel(): void {
    this.delAccModalIsVisible = false;
  }
}
