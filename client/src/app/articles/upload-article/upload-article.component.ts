import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadFile, UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, Observer } from 'rxjs';
import { Category } from 'src/app/shared/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-article',
  templateUrl: './upload-article.component.html',
  styleUrls: ['./upload-article.component.less']
})
export class UploadArticleComponent {
  apiUrl: string;
  form: FormGroup;
  categories: Category[] | null;
  formUnknownError: boolean;
  imagesUnknownError: boolean;
  imagesRequiredErr: boolean;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  imagesList = [];
  previewImage: string | undefined = '';
  previewVisible: boolean = false;

  constructor(private http: HttpClient, private msg: NzMessageService, private router: Router) {
    this.apiUrl = environment.apiUrl;

    this.loadCategories();

    this.form = new FormGroup({
      categoryId: new FormControl(null, [Validators.required]),
      price: new FormControl(1, [Validators.required, Validators.min(1), Validators.max(999999.99)]),
      title: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      condition: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required, Validators.maxLength(650)]),
      location: new FormControl(null, [Validators.required, Validators.maxLength(255)])
    });
  }

  submitForm(): void {
    // Force validation
    for (const key in this.form.controls) {
      if (this.form.controls[key]) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }

    this.imagesRequiredErr = false;
    this.formUnknownError = false;

    if (!this.imagesList.length) {
      this.imagesRequiredErr = true;
      return;
    }

    if (this.form.valid) {
      const images = this.imagesList.map(image => image.response.image);
      const data = this.form.value;
      data.images = images;

      this.uploadArticle(data);
    }
  }

  formatterEuro = (value: number) => `${value} €`;
  parserEuro = (value: string) => value.replace(' €', '');

  uploadArticle(data): void {
    this.http
      .post<any>(`${this.apiUrl}/api/articles`, data)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error) {
            return throwError(err.error);
          } else {
            return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
          }
        })
      )
      .subscribe(
        res => {
          this.router.navigate(['article', res.id]);
        },
        err => {
          this.formUnknownError = true;
        }
      );
  }

  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  customReq = (item: UploadXHRArgs) => {
    this.imagesUnknownError = false;

    const formData = new FormData();
    formData.append('image', item.file as any);

    return this.http.post<any>(`${this.apiUrl}/api/articles/images`, formData).subscribe(
      res => {
        item.onSuccess(res, item.file, res);
      },
      err => {
        this.imagesUnknownError = true;
      }
    );
  };

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
          this.msg.error('La dimensiones deben ser almenos 300px');
          observer.complete();
          return;
        }

        observer.next(extensionIsValid && isLt2M && dimensionRes);
        observer.complete();
      });
    });
  };

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        resolve(width >= 300 && height >= 300);
      };
    });
  }

  private loadCategories(): void {
    this.http
      .get<any>(`${this.apiUrl}/api/category`, {})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.error) {
            return throwError(err.error);
          } else {
            return throwError({ error: 'Unknown', message: 'An unknown error occurred' });
          }
        })
      )
      .subscribe(
        (res: Category[]) => {
          this.categories = res;
        },
        err => {
          this.formUnknownError = true;
        }
      );
  }
}
