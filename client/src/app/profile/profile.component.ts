import { Component, OnInit } from '@angular/core';
import { User } from '../users/user.model';
import { ReviewsService } from '../reviews/reviews.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent implements OnInit {
  user: User;
  userScore: { score: number; reviews: number };

  constructor(private authService: AuthService, private reviewsService: ReviewsService) {
    this.user = this.authService.user.value;

    this.userScore = { score: 0, reviews: 0 };
  }

  ngOnInit(): void {
    this.reviewsService.getUserScore(this.user.id).subscribe(score => {
      this.userScore = score;
    });
  }
}
