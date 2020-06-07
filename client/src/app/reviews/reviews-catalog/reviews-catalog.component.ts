import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Review } from '../review.model';
import { ReviewsService } from '../reviews.service';
import { User } from 'src/app/users/user.model';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-reviews-catalog',
  templateUrl: './reviews-catalog.component.html',
  styleUrls: ['./reviews-catalog.component.less']
})
export class ReviewsCatalogComponent implements OnInit {
  apiUrl: string;
  loading: boolean;
  reviews: Review[];

  // Edit Review Modal
  selectedReview: Review;
  editModalVisible: boolean;
  rate: number;
  description: string;
  formValid: boolean;
  unkownError: boolean;

  @Input() user: User;
  @Input() reviewsStatus: string;

  constructor(private reviewsService: ReviewsService, private modal: NzModalService) {
    this.apiUrl = environment.apiUrl;
    this.reviews = [];

    this.loading = true;
    this.formValid = true;
  }

  ngOnInit(): void {
    if (this.reviewsStatus === 'others') {
      this.reviewsService.getReviewsForUser(this.user.id).subscribe(this.handleResponse.bind(this));
    } else {
      this.reviewsService.getUserReviews(this.reviewsStatus === 'pending').subscribe(this.handleResponse.bind(this));
    }
  }

  handleResponse(reviews: any): void {
    this.reviews = reviews.map((review: any) => Object.assign(new Review(), review));

    this.loading = false;
  }

  showDeleteConfirm(reviewId: number, index: number): void {
    this.modal.confirm({
      nzTitle: '¿Seguro que quieres eliminar ésta valoración?',
      nzOkText: 'Eliminar',
      nzOkType: 'danger',
      nzOnOk: () => this.deleteReview(reviewId, index),
      nzCancelText: 'Cancelar'
    });
  }

  deleteReview(reviewId: number, index: number): void {
    this.reviewsService.deleteReview(reviewId).subscribe(() => {
      this.reviews.splice(index, 1);
    });
  }

  showEditModal(review: Review): void {
    this.selectedReview = review;
    this.editModalVisible = true;
  }

  closeEditModal(): void {
    this.editModalVisible = false;
    this.selectedReview = null;
    this.rate = null;
    this.description = null;
  }

  updateReview(): void {
    this.formValid = true;
    this.unkownError = false;

    if (!this.rate && !this.description) {
      this.formValid = false;
      return;
    }

    const data: { score?: number; description?: string } = {};
    if (this.rate) {
      data.score = this.rate;
    }
    if (this.description) {
      data.description = this.description;
    }

    this.reviewsService.updateReview(this.selectedReview.id, data).subscribe(
      res => {
        this.reviews.splice(this.reviews.indexOf(this.selectedReview), 1);

        this.closeEditModal();
      },
      err => {
        this.unkownError = true;
      }
    );
  }
}
