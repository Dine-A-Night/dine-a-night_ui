import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
    selector: 'restaurant-card',
    templateUrl: './restaurant-card.component.html',
    styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent implements OnChanges {
    @Input() restaurant: Restaurant;
    private DEFAULT_COVER_PHOTO_URL = 'assets/images/RestaurantCover.jpg';

    ngOnChanges(changes: SimpleChanges): void {}

    get coverPhoto(): string {
        return this.restaurant?.coverPhotoUri ?? this.DEFAULT_COVER_PHOTO_URL;
    }
}
