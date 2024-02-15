import { Component, Input } from '@angular/core';
import { Cuisine } from 'src/app/models/restaurant';

@Component({
    selector: 'cuisine-card',
    templateUrl: './cuisine-card.component.html',
    styleUrls: ['./cuisine-card.component.scss'],
})
export class CuisineCardComponent {
    @Input() cuisine: Cuisine;
}
