import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Restaurants } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'manage-restaurants',
    templateUrl: './manage-restaurants.component.html',
    styleUrls: ['./manage-restaurants.component.scss'],
})
export class ManageRestaurantsComponent implements OnInit {
    // Services
    restaurantsService = inject(RestaurantsService);

    // Props
    restaurants: Restaurants;

    ngOnInit(): void {
        // For now
        // this.getOwnedRestaurants();
        this.getAllRestaurants();
    }

    getOwnedRestaurants() {
        this.restaurantsService
            .getOwnedRestaurants()
            .subscribe((restaurants) => {
                this.restaurants = restaurants ?? [];
            });
    }

    // Just to test for now
    getAllRestaurants() {
        this.restaurantsService.getRestaurants().subscribe((res) => {
            this.restaurants = res?.restaurants ?? [];

            console.log(this.restaurants);
        });
    }
}
