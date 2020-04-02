import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { UploadFile, NzMessageService } from 'ng-zorro-antd';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  avatarUrl: string;
  user: User;

  constructor(private msg: NzMessageService, private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.user.value;

    this.form = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required, Validators.maxLength(255)]),
      location: new FormControl(null, [Validators.required, Validators.maxLength(255)])
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

  beforeUpload = (file: File) => {
    return new Observable((observer: Observer<boolean>) => {
      const extensionIsValid = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!extensionIsValid) {
        this.msg.error('Sólo aceptamos imágenes .jpg y .png');
        observer.complete();
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('El tamaño de la imagen debe ser inferior a 2MB');
        observer.complete();
        return;
      }

      this.checkImageDimension(file).then(dimensionRes => {
        if (!dimensionRes) {
          this.msg.error('La imagen debe ser cuadrada y dimensiones de almenos 300x300');
          observer.complete();
          return;
        }

        observer.next(extensionIsValid && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src!);
        resolve(width === height && width >= 300);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        this.avatarUrl = null;
        break;
      case 'done':
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });
        break;
      case 'error':
        this.msg.error('Error de conexión');
        this.loading = false;
        break;
    }
  }
}
