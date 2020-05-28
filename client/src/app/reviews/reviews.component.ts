import { Component } from '@angular/core';
import { User } from '../users/user.model';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from '../shared/header/notifications/notifications.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.less']
})
export class ReviewsComponent {
  user: User;
  reviewsStatus: string;

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) {
    this.reviewsStatus = this.route.snapshot.data.reviewsStatus;
    this.user = this.authService.user.value;

    if (this.reviewsStatus === 'others') {
      this.notificationsService.deleteNotification.next('review');
    }
    if (this.reviewsStatus === 'pending') {
      this.notificationsService.deleteNotification.next('pending_review');
    }
  }
}
