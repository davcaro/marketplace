import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.less']
})
export class ProfileAccountComponent implements OnInit {
  apiUrl: string;
  user: User;
  form: FormGroup;
  passUnknownError: boolean;
  delAccUnknownError: boolean;
  passwordModalIsVisible: boolean;
  delAccModalIsVisible: boolean;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.user = this.authService.user.value;

    this.form = new FormGroup({
      currentPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl(null, [Validators.required, this.confirmPassword.bind(this)])
    });
  }

  confirmPassword(control: FormControl): { [err: string]: boolean } {
    if (this.form && control.value) {
      if (control.value !== this.form.controls.newPassword.value) {
        return { dontMatch: true };
      }
    }

    return null;
  }

  submitForm(): void {
    // Force validation
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      this.passUnknownError = false;

      const data = {
        currentPassword: this.form.value.currentPassword,
        newPassword: this.form.value.newPassword
      };

      this.updateUser(data);
    }
  }

  updateUser(data: object): void {
    this.authService.updateUser(data).subscribe(
      res => {
        this.closePasswordModal();
        this.form.reset();
      },
      err => {
        if (err.statusCode === 401) {
          this.form.controls.currentPassword.setErrors({ wrong: true });
        } else {
          this.passUnknownError = true;
        }
      }
    );
  }

  deleteUser(): void {
    this.authService.deleteUser().subscribe(
      res => {
        this.authService.logout();
      },
      err => {
        this.delAccUnknownError = true;
      }
    );
  }

  onDelAccount(): void {
    this.deleteUser();
  }

  showPasswordModal(): void {
    this.passwordModalIsVisible = true;
  }

  closePasswordModal(): void {
    this.passwordModalIsVisible = false;
  }

  showDelAccModal(): void {
    this.delAccModalIsVisible = true;
  }

  closeDelAccModal(): void {
    this.delAccModalIsVisible = false;
  }
}
