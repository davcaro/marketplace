import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UploadFile, UploadXHRArgs, NzMessageService } from 'ng-zorro-antd';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';
import { Category } from 'src/app/shared/category.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../items.service';
import { Item } from '../item.model';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { AuthService } from 'src/app/auth/auth.service';
import { Location } from 'src/app/shared/location.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-upload-item',
  templateUrl: './upload-item.component.html',
  styleUrls: ['./upload-item.component.less']
})
export class UploadItemComponent implements OnInit, AfterViewInit {
  apiUrl: string;
  form: FormGroup;
  categories: Category[] | null;
  editItem: Item;
  formUnknownError: boolean;
  imagesUnknownError: boolean;
  imagesRequiredErr: boolean;
  locationRequiredErr: boolean;
  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };
  imagesList = [];
  previewImage: string | undefined = '';
  previewVisible: boolean;
  location: Location;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;
  geocoder: MapboxGeocoder;

  constructor(
    private http: HttpClient,
    private itemsService: ItemsService,
    private authService: AuthService,
    private msg: NzMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.apiUrl = environment.apiUrl;
    this.editItem = this.route.snapshot.data.item;
    if (this.editItem) {
      this.location = new Location(
        this.editItem.location.latitude,
        this.editItem.location.longitude,
        this.editItem.location.zoom,
        this.editItem.location.placeName
      );

      this.titleService.setTitle(`Editar ${this.editItem.title} - Marketplace`);
    } else {
      this.location = this.authService.user.value.location;
    }

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

  ngAfterViewInit() {
    let marker: mapboxgl.Marker;

    this.mapbox.accessToken = environment.mapbox.accessToken;

    this.geocoder = new MapboxGeocoder({
      accessToken: environment.mapbox.accessToken,
      mapboxgl: this.mapbox,
      placeholder: '¿Dónde?'
    });

    this.geocoder.on('result', ({ result: location }) => {
      this.location = new Location(
        location.center[1],
        location.center[0],
        location.bbox ? 10 : 16,
        location.place_name
      );

      if (marker) {
        marker.remove();
      }
    });

    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.location ? [this.location.longitude, this.location.latitude] : [-6.94, 37.27], // Huelva, Spain
      zoom: this.location ? this.location.zoom : 12
    });

    this.map.addControl(this.geocoder);
    this.map.addControl(new mapboxgl.NavigationControl());

    if (this.location) {
      marker = new mapboxgl.Marker().setLngLat([this.location.longitude, this.location.latitude]).addTo(this.map);
      this.geocoder.setInput(this.location.placeName);
    }
  }

  submitForm(): void {
    this.imagesRequiredErr = false;
    this.locationRequiredErr = false;
    this.formUnknownError = false;

    // Force validation
    for (const key in this.form.controls) {
      if (this.form.controls[key]) {
        this.form.controls[key].markAsDirty();
        this.form.controls[key].updateValueAndValidity();
      }
    }

    if (!this.imagesList.length) {
      this.imagesRequiredErr = true;
      return;
    }

    if (!this.location) {
      this.locationRequiredErr = true;
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
      data.location = this.location;

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

  onDeleteItem() {
    this.itemsService.deleteItem(this.editItem.id).subscribe(res => {
      this.router.navigate(['/', 'catalog', 'items']);
    });
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
