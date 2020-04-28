import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { UploadFile, NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { Location } from 'src/app/shared/location.model';

@Component({
  selector: 'app-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.less']
})
export class ProfileInfoComponent implements OnInit, AfterViewInit {
  apiUrl: string;
  user: User;
  form: FormGroup;
  infoUnknownError: boolean;
  avatarUnknownError: boolean;
  loading: boolean;
  avatar: string;
  location: Location;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;
  geocoder: MapboxGeocoder;

  constructor(private http: HttpClient, private authService: AuthService, private msg: NzMessageService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.user = this.authService.user.value;
    this.avatar = this.user.avatar;

    this.form = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required, Validators.maxLength(255)])
    });
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
      center: this.user.location ? [this.user.location.longitude, this.user.location.latitude] : [-6.94, 37.27], // Huelva, Spain
      zoom: this.user.location ? this.user.location.zoom : 12
    });

    this.map.addControl(this.geocoder);
    this.map.addControl(new mapboxgl.NavigationControl());

    if (this.user.location) {
      marker = new mapboxgl.Marker()
        .setLngLat([this.user.location.longitude, this.user.location.latitude])
        .addTo(this.map);

      this.geocoder.setInput(this.user.location.placeName);
    }
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
      this.infoUnknownError = false;

      const data = { ...this.form.value };
      if (this.location) {
        data.location = this.location;
      }

      this.updateUser(data);
    }
  }

  updateUser(data: { name: string; location: Location }): void {
    this.authService.updateUser(data).subscribe(
      res => {
        this.user.name = data.name;
        this.user.location = data.location;

        this.authService.user.next(this.user);
        this.authService.saveToLocalStorage();

        this.form.reset({ name: this.user.name });
      },
      err => {
        this.infoUnknownError = true;
      }
    );
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

  private checkImageDimension(file: File): Promise<boolean> {
    return new Promise(resolve => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        window.URL.revokeObjectURL(img.src);
        resolve(width === height && width >= 300);
      };
    });
  }

  handleChange(info: { file: UploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        this.avatar = null;
        break;
      case 'done':
        this.getBase64(info.file.originFileObj, (img: string) => {
          this.loading = false;
          this.avatar = img;
        });
        break;
      case 'error':
        this.msg.error('Error de conexión');
        this.loading = false;
        break;
    }
  }

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.toString()));
    reader.readAsDataURL(img);
  }

  customReq = (item: UploadXHRArgs) => {
    this.avatarUnknownError = false;

    const formData = new FormData();
    formData.append('avatar', item.file as any);

    return this.http.patch<any>(`${this.apiUrl}/api/me`, formData).subscribe(
      res => {
        this.loading = false;
        this.avatar = res.avatar;

        this.authService.user.value.avatar = res.avatar;
        this.authService.saveToLocalStorage();
      },
      err => {
        this.avatarUnknownError = true;
      }
    );
  };
}
