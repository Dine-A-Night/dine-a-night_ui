import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Restaurant } from 'src/app/models/restaurant.model';

@Component({
    selector: 'restaurant-layout-builder',
    templateUrl: './restaurant-layout-builder.component.html',
    styleUrls: ['./restaurant-layout-builder.component.scss'],
})
export class RestaurantLayoutBuilderComponent {
    restaurant: Restaurant;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: LayoutBuilderDialogParams,
    ) {
        this.restaurant = data.restaurant;
    }
}

type LayoutBuilderDialogParams = {
    restaurant: Restaurant;
};
