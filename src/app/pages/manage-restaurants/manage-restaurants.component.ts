import { Component, effect, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurants } from 'src/app/models/restaurant.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'manage-restaurants',
    templateUrl: './manage-restaurants.component.html',
    styleUrls: ['./manage-restaurants.component.scss'],
})
export class ManageRestaurantsComponent {
    // Services
    restaurantsService = inject(RestaurantsService);
    notificationService = inject(MatSnackBar);
    userService = inject(UserService);

    // Props
    restaurants: Restaurants;
    isLoading = false;

    constructor() {
        effect(() => {
            if (this.userService.currentUser() && !this.restaurants) {
                this.getOwnedRestaurants();
            }
        });
    }

    getOwnedRestaurants() {
        this.isLoading = true;

        // To make sure the current user data is already fetched
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
                        panelClass: ['success-snackbar'],
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

                this.isLoading = false;
            },
            error: (err) => {
                this.notificationService.open(
                    `Could not retrieve restaurants: ${err.message}`,
                    'Ok',
                    {
                        duration: 4000,
                        panelClass: ['fail-snackbar'],
                    },
                );
                this.isLoading = false;
            },
        });
    }

    onRestaurantDelete(id: string) {
        // Remove restaurant from the display list
        this.restaurants.splice(
            this.restaurants.findIndex((restaurant) => restaurant._id === id),
            1,
        );
    }
}
