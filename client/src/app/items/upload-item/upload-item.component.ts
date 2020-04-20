import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadFile, UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError, Observable, Observer } from 'rxjs';
import { Category } from 'src/app/shared/category.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items.service';
import { Item } from '../item.model';

@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.less']
})
export class UploadItemComponent implements OnInit {
  apiUrl: string;
  form: FormGroup;
  categories: Category[] | null;
  editItem: Item;
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
  previewVisible: boolean;

  constructor(
    private http: HttpClient,
    private itemsService: ItemsService,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.apiUrl = environment.apiUrl;
    this.editItem = this.route.snapshot.data.item;

    this.form = new FormGroup({
      categoryId: new FormControl(this.editItem ? this.editItem.category.id : null, [Validators.required]),
      price: new FormControl(this.editItem ? this.editItem.price : 1, [
        Validators.required,
        Validators.min(1),
        Validators.max(999999.99)
      ]),
      title: new FormControl(this.editItem ? this.editItem.title : null, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      condition: new FormControl(this.editItem ? this.editItem.condition : null, [Validators.required]),
      description: new FormControl(this.editItem ? this.editItem.description : null, [
        Validators.required,
        Validators.maxLength(650)
      ]),
      location: new FormControl(this.editItem ? this.editItem.location : null, [
        Validators.required,
        Validators.maxLength(255)
      ])
    });

    if (this.editItem) {
      this.imagesList = this.editItem.images.map(image => {
        return {
          uid: image.image,
          name: image.image,
          status: 'done',
          url: `${this.apiUrl}/images/items/${image.image}`
        };
      });
    }
  }

  ngOnInit() {
    this.itemsService.getCategories().subscribe(
      (res: Category[]) => {
        this.categories = res;
      },
      err => {
        this.formUnknownError = true;
      }
    );
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
      const data = this.form.value;

      const images = this.imagesList.map(image => {
        if (image.response) {
          return image.response.image;
        } else {
          return image.name;
        }
      });
      data.images = images;

      this.editItem ? this.updateItem(data) : this.uploadItem(data);
    }
  }

  formatterEuro = (value: number) => `${value} €`;
  parserEuro = (value: string) => value.replace(' €', '');

  uploadItem(data: object): void {
    this.itemsService.createItem(data).subscribe(
      res => {
        this.router.navigate(['item', res.id]);
      },
      err => {
        this.formUnknownError = true;
      }
    );
  }

  updateItem(data: object): void {
    this.itemsService.updateItem(this.editItem.id, data).subscribe(
      res => {
        this.router.navigate(['item', this.editItem.id]);
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

    return this.http.post<any>(`${this.apiUrl}/api/items/images`, formData).subscribe(
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
}
