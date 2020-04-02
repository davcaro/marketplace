import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthModalService } from '../auth-modal.service';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.less']
})
export class SignupComponent implements OnInit, OnDestroy {
  form: FormGroup;
  passwordVisible: boolean;
  unknownError: boolean;
  private formStatusSubscription: Subscription;
  private formValueSubscription: Subscription;

  constructor(private authModalService: AuthModalService, private authService: AuthService) {
    this.passwordVisible = false;
    this.unknownError = false;

    this.formStatusSubscription = new Subscription();
    this.formValueSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      email: new FormControl(null, [Validators.required, Validators.email], this.emailDuplicated.bind(this)),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
    });
  }

  ngOnDestroy() {
    this.formStatusSubscription.unsubscribe();
    this.formValueSubscription.unsubscribe();
  }

  submitForm(): void {
    // Force validation
    for (var i in this.form.controls) {
      this.form.controls[i].markAsTouched();

      if (!this.form.controls[i].dirty) {
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      this.unknownError = false;
      this.signUp();
    } else {
      // Wait for validation to finish
      this.formStatusSubscription = this.form.statusChanges.pipe(take(1)).subscribe(() => {
        this.signUp();
      });

      // Avoid sending the request if user modifies an input while validating
      this.formValueSubscription = this.form.valueChanges.pipe(take(1)).subscribe(() => {
        this.formStatusSubscription.unsubscribe();
      });
    }
  }

  signUp(): void {
    const { email, password, name } = this.form.value;

    this.authService.signup(email, password, name).subscribe(
      res => {
        this.authModalService.closeModal();
        // TODO: Change login button to dropdown
      },
      err => {
        this.unknownError = true;
      }
    );
  }

  emailDuplicated(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve, reject) => {
      this.authService.checkAvailable(control.value).subscribe(
        res => {
          resolve(null);
        },
        err => {
          switch (err.error) {
            case 'Bad Request':
              resolve({ email: true });
              break;
            case 'Conflict':
              resolve({ duplicated: true });
              break;
            default:
              this.unknownError = true;

              resolve({ unknownError: true });
          }
        }
      );
    });
  }

  onLogin(): void {
    this.authModalService.login();
  }
}
