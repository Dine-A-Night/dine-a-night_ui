import { Component, Input } from '@angular/core';
import { Restaurant } from 'src/app/models/restaurant';

@Component({
    selector: 'restaurant-detailed-card',
    templateUrl: './restaurant-detailed-card.component.html',
    styleUrls: ['./restaurant-detailed-card.component.scss'],
})
export class RestaurantDetailedCardComponent {
    @Input() restaurant: Restaurant;
}
