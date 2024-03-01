import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'rating-selector',
    templateUrl: './rating-selector.component.html',
    styleUrls: ['./rating-selector.component.scss'],
})
export class RatingSelectorComponent {
    // rating has 2-way data binding
    @Input() rating: number = 0;
    @Output() ratingChange = new EventEmitter<number>();

    @Input() editMode = false;

    setRating(newRating: number) {
        this.rating = newRating;
        this.ratingChange.emit(this.rating);
    }
}
