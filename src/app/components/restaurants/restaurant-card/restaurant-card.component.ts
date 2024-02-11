import { Component, Input } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
    selector: 'restaurant-card',
    templateUrl: './restaurant-card.component.html',
    styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent {
    @Input() restaurant: Restaurant;
    private DEFAULT_COVER_PHOTO_URL = 'assets/images/RestaurantCover.jpg';

    get coverPhoto(): string {
        return this.restaurant?.coverPhotoUri ?? this.DEFAULT_COVER_PHOTO_URL;
    }
}
