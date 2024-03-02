import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements AfterViewChecked, OnChanges {
    @Input() review: Review;
    maxMessageHeight = 100; //px
    @ViewChild('messageContainer') messageContainer: ElementRef;

    editMode: boolean = false;

    changeDetectorRef = inject(ChangeDetectorRef);
    userService = inject(UserService);
    reviewService = inject(ReviewService);
    notificationService = inject(MatSnackBar);

    updatedRating: number;
    updatedComment: string;

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['review'] && isDefNotNull(this.review)) {
            this.updatedRating = this.review.rating;
            this.updatedComment = this.review.message;
        }
    }

    get profilePicture() {
        return (
            this.review.user.profilePictureUrl ??
            UserService.DEFAULT_PROFILE_PHOTO_URI
        );
    }

    showMore: boolean = false;

    toggleShowMore(): void {
        this.showMore = !this.showMore;
    }

    toggleEditMode() {
        this.editMode = !this.editMode;
    }

    onEditClick() {
        this.toggleEditMode();
    }

    onCancelClick() {
        this.updatedComment = this.review.message;
        this.updatedRating = this.review.rating;

        this.toggleEditMode();
    }

    onSaveClick() {
        this.reviewService
            .updateReviewById(this.review._id, {
                ...this.review,
                message: this.updatedComment,
                rating: this.updatedRating,
            })
            .subscribe({
                next: (updatedReview) => {
                    this.review = updatedReview;
                    this.toggleEditMode();

                    this.notificationService.open(
                        'Review updated successfully!',
                        'Ok',
                        { duration: 3000 },
                    );
                },
                error: (err: any) => {
                    console.error(err);
                    this.notificationService.open(
                        `Failed to update the review: ${err.message}`,
                        'Oops',
                        { duration: 3000 },
                    );
                },
            });
    }

    get shouldShowMoreButton(): boolean {
        if (!this.messageContainer) return false;

        return (
            this.messageContainer.nativeElement.scrollHeight >
            this.maxMessageHeight
        );
    }

    get showEditControls() {
        return this.review.user.uid === this.userService.currentUser()?.uid;
    }

    get modified(): boolean {
        return (
            !!this.review?.updatedAt &&
            !!this.review?.createdAt &&
            this.review.updatedAt.getTime() > this.review.createdAt.getTime()
        );
    }
}
