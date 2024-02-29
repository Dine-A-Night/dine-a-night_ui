import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    ViewChild,
    inject,
} from '@angular/core';
import { Review } from 'src/app/models/review';

@Component({
    selector: 'review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements AfterViewChecked {
    @Input() review: Review;
    maxMessageHeight = 100; //px
    @ViewChild('messageContainer') messageContainer: ElementRef;

    changeDetectorRef = inject(ChangeDetectorRef);

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    showMore: boolean = false;

    toggleShowMore(): void {
        this.showMore = !this.showMore;
    }

    get shouldShowMoreButton(): boolean {
        if (!this.messageContainer) return false;

        return (
            this.messageContainer.nativeElement.scrollHeight >
            this.maxMessageHeight
        );
    }

    get modified(): boolean {
        return (
            !!this.review?.updatedAt &&
            !!this.review?.createdAt &&
            this.review.updatedAt.getTime() > this.review.createdAt.getTime()
        );
    }
}
