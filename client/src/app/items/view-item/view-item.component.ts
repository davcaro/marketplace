import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from '../item.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/chat/chat.model';
import { User } from 'src/app/users/user.model';
import { ItemsService } from '../items.service';
import { ChatService } from 'src/app/chat/chat.service';
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

  constructor(
    private authService: AuthService,
    private itemsService: ItemsService,
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService
  ) {
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
      center: [this.item.location.longitude, this.item.location.latitude],
      zoom: this.item.location.zoom
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    new mapboxgl.Marker().setLngLat([this.item.location.longitude, this.item.location.latitude]).addTo(this.map);
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

  onContactUser(): void {
    this.chatService.findChat(this.item.id).subscribe(res => {
      const chat = Object.assign(new Chat(), res);

      if (chat.messages.length) {
        this.router.navigate(['/', 'chat', chat.id]);
      } else {
        this.router.navigate(['/', 'chat', chat.id], { state: { chat } });
      }
    });
  }
}
