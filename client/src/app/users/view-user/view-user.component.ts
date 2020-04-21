import { Component } from '@angular/core';
import { User } from '../user.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.less']
})
export class ViewUserComponent {
  apiUrl: string;
  user: User;

  forSaleItemsCount: number;
  soldItemsCount: number;
  reviewsCount: number;

  constructor(private route: ActivatedRoute) {
    this.apiUrl = environment.apiUrl;
    this.user = this.route.snapshot.data.user;

    this.forSaleItemsCount = 0;
    this.soldItemsCount = 0;
    this.reviewsCount = 0;
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
}
