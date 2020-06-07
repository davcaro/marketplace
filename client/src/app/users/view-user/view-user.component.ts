import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ReviewsService } from 'src/app/reviews/reviews.service';
import * as mapboxgl from 'mapbox-gl';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.less']
})
export class ViewUserComponent implements OnInit, AfterViewInit {
  apiUrl: string;
  user: User;
  userScore: { score: number; reviews: number };

  forSaleItemsCount: number;
  soldItemsCount: number;
  reviewsCount: number;

  @ViewChild('mapTab', { static: false }) mapTabEl: ElementRef;
  @ViewChild('mapSide', { static: false }) mapSideEl: ElementRef;
  mapTab: mapboxgl.Map;
  mapSide: mapboxgl.Map;
  mapbox = mapboxgl as typeof mapboxgl;

  constructor(private route: ActivatedRoute, private reviewsService: ReviewsService, private titleService: Title) {
    this.apiUrl = environment.apiUrl;
    this.user = this.route.snapshot.data.user;

    this.titleService.setTitle(`Perfil de ${this.user.name} - Marketplace`);

    this.forSaleItemsCount = 0;
    this.soldItemsCount = 0;
    this.reviewsCount = 0;
    this.userScore = { score: 0, reviews: 0 };
  }

  ngOnInit(): void {
    this.reviewsService.getUserScore(this.user.id).subscribe(res => {
      this.userScore = res;
    });
  }

  ngAfterViewInit(): void {
    if (this.user.location) {
      this.mapbox.accessToken = environment.mapbox.accessToken;

      // Side map
      this.mapSide = new mapboxgl.Map({
        container: this.mapSideEl.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.user.location.longitude, this.user.location.latitude],
        zoom: this.user.location.zoom
      });

      this.mapSide.addControl(new mapboxgl.NavigationControl());
      new mapboxgl.Marker().setLngLat([this.user.location.longitude, this.user.location.latitude]).addTo(this.mapSide);
    }
  }

  updateForSaleItemsCount(count: number) {
    this.forSaleItemsCount = count;
  }

  updateSoldItemsCount(count: number) {
    this.soldItemsCount = count;
  }

  updateReviewsCount(count: number) {
    this.reviewsCount = count;
  }

  loadTabMap(tab: number) {
    if (tab === 3 && this.user.location && !this.mapTab) {
      setTimeout(() => {
        this.mapTab = new mapboxgl.Map({
          container: this.mapTabEl.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [this.user.location.longitude, this.user.location.latitude],
          zoom: this.user.location.zoom
        });

        this.mapTab.addControl(new mapboxgl.NavigationControl());
        new mapboxgl.Marker().setLngLat([this.user.location.longitude, this.user.location.latitude]).addTo(this.mapTab);
      }, 0);
    }
  }
}
