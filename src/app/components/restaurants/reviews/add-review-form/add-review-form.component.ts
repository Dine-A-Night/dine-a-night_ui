import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant';
import { Review } from 'src/app/models/review';
import { ProfileUser } from 'src/app/models/user';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'add-review-form',
    templateUrl: './add-review-form.component.html',
    styleUrls: ['./add-review-form.component.scss'],
})
export class AddReviewFormComponent implements OnInit {
    @Input() restaurant: Restaurant;
    currentUser: ProfileUser;
    rating: number = 0;
    message: string = '';

    @Output() reviewAdded = new EventEmitter<Review>();

    //#region Services

    userService = inject(UserService);
    reviewService = inject(ReviewService);
    notificationService = inject(MatSnackBar);

    //#endregion

    ngOnInit(): void {
        // Never use signals for http request results when app might be loading
        // MFs return undefined as inital value
        this.userService.currentUser$.subscribe((user) => {
            this.currentUser = user;
        });
    }

    addReview() {
        const newReview = <Partial<Review>>{
            message: this.message,
            rating: this.rating,
            restaurantId: this.restaurant._id,
            user: {
                uid: this.currentUser.uid,
                displayName: this.currentUser.displayName,
                profilePictureUrl: this.currentUser.profilePictureUrl,
            },
        };

        this.reviewService.addReview(this.restaurant._id, newReview).subscribe({
            next: (newReview) => {
                this.clearForm();
                this.reviewAdded.emit(newReview);

                this.notificationService.open(
                    'Review successfully added',
                    'Ok',
                    { duration: 3000 },
                );
            },
            error: (err: any) => {
                console.error(err);

                this.notificationService.open('Failed to add review', 'Oops');
            },
        });
    }

    private clearForm() {
        this.message = '';
        this.rating = 0;
    }

    get saveDisabled() {
        return !this.rating;
    }

    get profilePicture() {
        return this.currentUser.profilePictureUrl?.length
            ? this.currentUser.profilePictureUrl
            : UserService.DEFAULT_PROFILE_PHOTO_URI;
    }
}
