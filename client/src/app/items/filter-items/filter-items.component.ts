import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ItemsService } from '../items.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/category.model';
import { FilterItemsService, Filters, Order, PublicationDate } from '../filter-items.service';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-filter-items',
  templateUrl: './filter-items.component.html',
  styleUrls: ['./filter-items.component.less']
})
export class FilterItemsComponent implements OnInit, OnDestroy {
  user: User;
  categories: Category[];
  filters: Filters;
  @ViewChild('map', { static: false }) mapElement: ElementRef;
  mapbox = mapboxgl as typeof mapboxgl;
  map: mapboxgl.Map;
  geocoder: MapboxGeocoder;
  distanceMarks: any;

  categoriesSubscription: Subscription;
  itemsSubscription: Subscription;
  filtersSubscription: Subscription;

  constructor(
    private itemsService: ItemsService,
    public filtersService: FilterItemsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user = this.authService.user.value;
    this.categories = this.itemsService.categories.value;
    this.filters = this.filtersService.filters.value;

    // Load the user location here the first time since, in the service, the user is not yet loaded
    if (this.user && this.user.location) {
      this.filters.location.userLocation = {
        latitude: +this.user.location.latitude,
        longitude: +this.user.location.longitude,
        place_name: this.user.location.placeName
      };
    }

    this.distanceMarks = this.filtersService.distanceMarks;
  }

  ngOnInit() {
    this.filtersService.loadFilters();

    this.filtersSubscription = this.filtersService.filters.subscribe(filters => {
      this.filters = filters;
    });

    this.categoriesSubscription = this.itemsService.categories.subscribe(categories => {
      this.categories = categories;

      // Reload the selected category, now that all categories have been loaded
      this.filters.category.selected =
        this.categories.find(category => category.id === +this.route.snapshot.queryParams.category) ||
        this.categories[0];
      this.filtersService.filters.next(this.filters);

      this.filtersService.requestItems.next(false);
    });
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  loadMap(isVisible: boolean) {
    let geolocator: mapboxgl.GeolocateControl;

    if (isVisible) {
      // Wait for content to load
      setTimeout(() => {
        this.mapbox.accessToken = environment.mapbox.accessToken;

        this.geocoder = new MapboxGeocoder({
          accessToken: environment.mapbox.accessToken,
          mapboxgl: this.mapbox,
          collapsed: !this.filters.location.userLocation.place_name,
          marker: false,
          placeholder: '¿Dónde?'
        });

        this.geocoder.on('result', ({ result: location }) => {
          this.onSelectLocation({
            latitude: location.center[1],
            longitude: location.center[0],
            place_name: location.place_name
          });
        });

        this.map = new mapboxgl.Map({
          container: this.mapElement.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [this.filters.location.userLocation.longitude, this.filters.location.userLocation.latitude],
          zoom: this.filtersService.getDistanceSelected().zoom
        });

        geolocator = new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          showUserLocation: false
        });
        geolocator.on('geolocate', (location: any) => {
          this.geocoder.setInput('');

          this.onSelectLocation(location.coords);
        });

        this.map.addControl(this.geocoder);
        this.map.addControl(geolocator);
        this.map.addControl(new mapboxgl.NavigationControl());

        if (this.filters.location.userLocation.place_name) {
          this.geocoder.setInput(this.filters.location.userLocation.place_name);
        }

        this.map.on('load', () => {
          this.map.addSource(
            'polygon',
            this.createGeoJSONCircle(
              this.filters.location.userLocation,
              this.filtersService.getDistanceSelected().value
            )
          );

          this.map.addLayer({
            id: 'polygon',
            type: 'fill',
            source: 'polygon',
            layout: {},
            paint: {
              'fill-color': '#F78880',
              'fill-outline-color': '#f44336',
              'fill-opacity': 0.5
            }
          });
        });
      }, 0);
    }
  }

  createGeoJSONCircle(
    coords: { latitude: number; longitude: number },
    radiusInKm: number,
    points: number = 64
  ): mapboxgl.GeoJSONSourceRaw {
    const distanceX = radiusInKm / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = radiusInKm / 110.574;

    const ret = [];
    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: null,
            geometry: {
              type: 'Polygon',
              coordinates: [ret]
            }
          }
        ]
      }
    };
  }

  closeCategoryPopover(): void {
    this.filters.category.isVisible = false;
  }

  closePricePopover(): void {
    this.filters.price.isVisible = false;
  }

  closePublicationPopover(): void {
    this.filters.publicationDate.isVisible = false;
  }

  closeLocationPopover(): void {
    this.filters.location.isVisible = false;
  }

  closeOrderPopover(): void {
    this.filters.order.isVisible = false;
  }

  updateSlider() {
    // Force slider to update
    this.filters.price.range = this.filters.price.range.slice();
  }

  onSelectCategory(category: Category) {
    this.filters.category.isApplied = true;
    this.filters.category.selected = category;
    this.updateFilter({ category: category.id });

    this.closeCategoryPopover();
  }

  onSelectPriceRange() {
    this.filters.price.isApplied = true;
    this.updateFilter({ min_price: this.filters.price.range[0], max_price: this.filters.price.range[1] });
  }

  onSelectPublicationDate(publicationOption: PublicationDate) {
    this.filters.publicationDate.isApplied = true;
    this.filters.publicationDate.selected = publicationOption;
    this.updateFilter({ published: publicationOption.value });
  }

  onSelectLocation(location: { latitude: number; longitude: number; place_name: string }) {
    this.filters.location.distanceSelected = 2; // Default distance

    this.filters.location.isApplied = true;
    this.filters.location.userLocation = location;

    const distanceSelected = this.filtersService.getDistanceSelected();

    (this.map.getSource('polygon') as any).setData(
      this.createGeoJSONCircle(this.filters.location.userLocation, distanceSelected.value).data
    );
    this.map.easeTo({
      center: [location.longitude, location.latitude],
      zoom: distanceSelected.zoom
    });

    this.updateFilter({
      latitude: this.filters.location.userLocation.latitude,
      longitude: this.filters.location.userLocation.longitude
    });
  }

  onSelectDistance() {
    this.filters.location.isApplied = true;

    this.updateFilter({ distance: this.filtersService.getDistanceSelected().value });
  }

  onSelectOrder(order: Order) {
    this.filters.order.isApplied = true;
    this.filters.order.selected = order;
    this.updateFilter({ order: order.value });
  }

  onClearFilters() {
    this.router.navigate(['search']);

    this.filtersService.clearFilters();

    this.filtersService.requestItems.next(true);
  }

  updateMapCircle() {
    const distanceSelected = this.filtersService.getDistanceSelected();

    (this.map.getSource('polygon') as any).setData(
      this.createGeoJSONCircle(this.filters.location.userLocation, distanceSelected.value).data
    );
    this.map.easeTo({
      center: [this.filters.location.userLocation.longitude, this.filters.location.userLocation.latitude],
      zoom: distanceSelected.zoom
    });
  }

  private updateFilter(queryParams: object) {
    this.router.navigate(['search'], { queryParams, queryParamsHandling: 'merge' });
    this.filtersService.filters.next(this.filters);
    this.filtersService.requestItems.next(true);
  }
}
