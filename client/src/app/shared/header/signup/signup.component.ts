import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthModalService } from '../auth-modal.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  passwordVisible: boolean;

  constructor(private authModalService: AuthModalService) {
    this.passwordVisible = false;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email], this.emailDuplicated),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
  }

  submitForm(): void {
    for (var i in this.form.controls) {
      this.form.controls[i].markAsTouched();
      this.form.controls[i].updateValueAndValidity();
    }

    console.log(this.form);
  }

  emailDuplicated(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({ duplicated: true });
        } else {
          resolve(null);
        }
      }, 1500);
    });

    return promise;
  }

  onLogin(): void {
    this.authModalService.login();
  }
}
