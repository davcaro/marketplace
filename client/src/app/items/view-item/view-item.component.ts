import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Item } from '../item.model';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { Chat } from 'src/app/chat/chat.model';
import { User } from 'src/app/users/user.model';
import { ItemsService } from '../items.service';
import { ChatService } from 'src/app/chat/chat.service';
import { ReviewsService } from 'src/app/reviews/reviews.service';
import { AuthModalService } from 'src/app/shared/header/auth-modal.service';
import { Subscription } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { Title } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.less'],
  providers: [CurrencyPipe]
})
export class ViewItemComponent implements OnInit, AfterViewInit, OnDestroy {
  apiUrl: string;
  user: User;
  item: Item;
  isFavorited: boolean;
  userItemsCount: number;
  userScore: { score: number; reviews: number };
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;
  messageForm: FormGroup;
  defaultMessages: string[];
  currencyPipe: CurrencyPipe;

  userSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authModalService: AuthModalService,
    private itemsService: ItemsService,
    private chatService: ChatService,
    private reviewsService: ReviewsService,
    private titleService: Title
  ) {
    this.apiUrl = environment.apiUrl;
    this.user = this.authService.user.value;
    this.currencyPipe = new CurrencyPipe(environment.currencyLocale);

    this.userScore = { score: 0, reviews: 0 };
    this.isFavorited = false;
    this.defaultMessages = ['¿Todavía está disponible?', '¿El precio es negociable?'];
    this.messageForm = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.item = Object.assign(new Item(), this.route.snapshot.data.item);

    this.titleService.setTitle(
      `${this.item.title} por ${this.currencyPipe.transform(this.item.price, 'EUR')} - Marketplace`
    );

    if (this.user) {
      this.itemsService.addView(this.item.id).subscribe();
    }

    this.itemsService.countUserItems(this.item.user.id).subscribe(res => {
      this.userItemsCount = res;
    });

    this.reviewsService.getUserScore(this.item.user.id).subscribe(res => {
      this.userScore = res;
    });

    this.userSubscription = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    // Have to check if its favorited after view is initialized or it won't update the icon
    if (this.user) {
      this.itemsService.getItemFavorites(this.item.id).subscribe(res => {
        this.isFavorited = !!res.find((favorite: any) => favorite.userId === this.user.id);
      });
    }

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

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

  onMarkAsFavorite() {
    if (this.user) {
      if (this.isFavorited) {
        this.itemsService.removeFavorite(this.item.id).subscribe(res => {
          this.isFavorited = !this.isFavorited;
        });
      } else {
        this.itemsService.addFavorite(this.item.id).subscribe(res => {
          this.isFavorited = !this.isFavorited;
        });
      }
    } else {
      this.authModalService.showModal();
    }
  }

  onContactUser(): void {
    if (this.user) {
      this.chatService.findChat(this.item.id).subscribe(res => {
        const chat = Object.assign(new Chat(), res);

        if (chat.messages.pagination.total) {
          this.router.navigate(['/', 'chat', chat.id]);
        } else {
          this.router.navigate(['/', 'chat', chat.id], { state: { chat } });
        }
      });
    } else {
      this.authModalService.showModal();
    }
  }

  sendQuickMessage(): void {
    if (this.user) {
      if (this.messageForm.valid) {
        const message = this.messageForm.value.message;

        this.chatService.findChat(this.item.id).subscribe(chat => {
          this.chatService.sendMessage(chat.id, message);
          this.router.navigate(['/', 'chat', chat.id]);
        });
      }
    } else {
      this.authModalService.showModal();
    }
  }

  setMessage(message: string): void {
    this.messageForm.reset({ message });
  }
}
