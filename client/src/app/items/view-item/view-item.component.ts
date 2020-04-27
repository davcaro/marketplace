import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';
import { ItemsService } from '../items.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.less']
})
export class ViewItemComponent implements OnInit, AfterViewInit {
  apiUrl: string;
  user: User;
  item: Item;
  isFavorited: boolean;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;

  constructor(private authService: AuthService, private itemsService: ItemsService, private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;

    this.user = this.authService.user.value;
  }

  ngOnInit(): void {
    this.item = Object.assign(new Item(), this.route.snapshot.data.item);

    if (this.user) {
      this.itemsService.getItemFavorites(this.item.id).subscribe(res => {
        this.isFavorited = !!res.find(favorite => favorite.userId === this.user.id);
      });

      this.itemsService.addView(this.item.id).subscribe();
    }
  }

  ngAfterViewInit() {
    this.mapbox.accessToken = environment.mapbox.accessToken;

    this.map = new mapboxgl.Map({
      container: this.mapElement.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.item.location.latitude, this.item.location.longitude], // Huelva, Spain
      zoom: this.item.location.zoom
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    new mapboxgl.Marker().setLngLat([this.item.location.latitude, this.item.location.longitude]).addTo(this.map);
  }

  onMarkAsFavorite() {
    if (this.isFavorited) {
      this.itemsService.removeFavorite(this.item.id).subscribe(res => {
        this.isFavorited = !this.isFavorited;
      });
    } else {
      this.itemsService.addFavorite(this.item.id).subscribe(res => {
        this.isFavorited = !this.isFavorited;
      });
    }
  }
}
