import { Component, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    notificationService = inject(MatSnackBar);

    // Props
    restaurants: Restaurants;
    isLoading = false;

    ngOnInit(): void {
        // For now
        // this.getOwnedRestaurants();
        this.getAllRestaurants();
    }

    getOwnedRestaurants() {
        this.isLoading = true;

        this.restaurantsService.getOwnedRestaurants().subscribe({
            next: (restaurants) => {
                this.restaurants = restaurants ?? [];
                this.isLoading = false;
            },
            error: (err) => {
                this.notificationService.open(
                    `Could not retrieve restaurants: ${err.message}`,
                    'Ok',
                    {
                        duration: 4000,
                    },
                );
                this.isLoading = false;
            },
        });
    }

    // Just to test for now
    getAllRestaurants() {
        this.isLoading = true;

        this.restaurantsService.getRestaurants().subscribe({
            next: (res) => {
                this.restaurants = res?.restaurants ?? [];

                console.log(this.restaurants);

                this.isLoading = false;
            },
            error: (err) => {
                this.notificationService.open(
                    `Could not retrieve restaurants: ${err.message}`,
                    'Ok',
                    {
                        duration: 4000,
                    },
                );
                this.isLoading = false;
            },
        });
    }
}
