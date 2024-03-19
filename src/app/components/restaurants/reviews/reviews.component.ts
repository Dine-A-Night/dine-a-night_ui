import {
    Component,
    Input,
    OnChanges,
    SimpleChanges,
    inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Review, Reviews } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';

@Component({
    selector: 'reviews',
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.scss'],
})
export class ReviewsComponent implements OnChanges {
    @Input() restaurant: Restaurant;
    reviews: Reviews = [];

    reviewService = inject(ReviewService);
    notificationService = inject(MatSnackBar);

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['restaurant'] && this.restaurant) {
            // Fetch Reviews made against the Restaurant
            this.getReviews();
        }
    }

    getReviews() {
        this.reviewService
            .getReviewsByRestaurant(this.restaurant._id)
            .subscribe({
                next: (reviews) => {
                    this.reviews = reviews as Reviews;
                },
                error: (err: any) => {
                    console.error(err);

                    this.notificationService.open(
                        'Failed to fetch Reviews!',
                        'Oops',
                    );
                },
            });
    }

    onReviewAdded(newReview: Review) {
        this.reviews = [newReview, ...this.reviews];
    }

    onReviewDeleted(reviewId: string) {
        this.reviews = this.reviews.filter((review) => review._id !== reviewId);
    }
}
