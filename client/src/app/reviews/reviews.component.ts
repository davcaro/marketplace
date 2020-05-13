import { Component } from '@angular/core';
import { User } from '../users/user.model';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class ReviewsComponent {
  user: User;
  reviewsStatus: string;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    this.reviewsStatus = this.route.snapshot.data.reviewsStatus;
    this.user = this.authService.user.value;
  }
}
