import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from '../users/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.less']
})
export class ResetPasswordComponent {
  form: FormGroup;
  userId: number;
  token: string;
  error: { message: string };

  constructor(private route: ActivatedRoute, private router: Router, private usersService: UsersService) {
    const params = this.route.snapshot.queryParams;
    this.userId = params.userId;
    this.token = params.token;

    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl(null, [Validators.required, this.confirmPassword.bind(this)])
    });
  }

  confirmPassword(control: FormControl): { [err: string]: boolean } {
    if (this.form && control.value) {
      if (control.value !== this.form.controls.password.value) {
        return { dontMatch: true };
      }
    }

    return null;
  }

  submitForm(): void {
    this.error = null;

    // Force validation
    for (const i in this.form.controls) {
      if (this.form.controls[i]) {
        this.form.controls[i].markAsTouched();
        this.form.controls[i].updateValueAndValidity();
      }
    }

    if (this.form.valid) {
      const { password } = this.form.value;

      this.usersService.resetPassword(this.userId, this.token, password).subscribe(
        res => {
          this.router.navigate(['/']);
        },
        err => {
          switch (err.statusCode) {
            case 400:
              this.error = {
                message:
                  'No se ha conseguido encontrar su código para restablecer la contraseña. Intente volver a abrir el enlace que ha recibido en su correo electrónico'
              };
              break;
            case 401:
              this.error = {
                message:
                  'Parece que hay un error al restablecer la contraseña. Es posible que éste enlace haya expirado o no sea válido.'
              };
              break;
            default:
              this.error = { message: 'Ha ocurrido un error inesperado. Vuelva a intentarlo más tarde.' };
          }
        }
      );
    }
  }
}
