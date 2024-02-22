import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantAddEditComponent } from 'src/app/components/restaurants/restaurant-add-edit/restaurant-add-edit.component';
import { Restaurant } from 'src/app/models/restaurant';
import { UserRole } from 'src/app/models/user';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';
import { deepEqual } from 'src/app/utils/helper-functions';

@Component({
    selector: 'restaurant-details-page',
    templateUrl: './restaurant-details-page.component.html',
    styleUrls: ['./restaurant-details-page.component.scss'],
})
export class RestaurantDetailsPageComponent implements OnInit, OnDestroy {
    constructor(
        private activatedRoute: ActivatedRoute,
        private restaurantService: RestaurantsService,
        private userService: UserService,
        private dialog: MatDialog,
    ) {}

    paramSubscription: Subscription;
    restaurant: Restaurant;
    description: string;
    cuisines: string[];
    location: string;

    ngOnInit(): void {
        this.paramSubscription = this.activatedRoute.params.subscribe(
            (params) => {
                const restaurantId = params['id'];

                if (restaurantId) {
                    this.restaurantService
                        .getRestaurantById(restaurantId)
                        .subscribe((restaurant: Restaurant) => {
                            this.restaurant = restaurant;
                            this.description = restaurant.description ?? ''; // Assign description from API response, handle nullish case
                            this.cuisines =
                                restaurant.cuisines?.map(
                                    (cuisine) => cuisine.name,
                                ) ?? [];
                            // Assign cuisines from API response, handle nullish case
                            this.location = this.formatLocation(
                                restaurant.location,
                            ); // Format location
                        });
                }
            },
        );
    }

    ngOnDestroy(): void {
        this.paramSubscription.unsubscribe();
    }

    formatLocation(location: any): string {
        // Implement your formatting logic here based on the structure of RestaurantLocation
        return `${location.streetAddress}, ${location.city}, ${location.province}, ${location.country} ${location.postal}`;
    }

    onEditClick(): void {
        this.dialog
            .open(RestaurantAddEditComponent, {
                data: {
                    isEdit: true,
                    restaurant: this.restaurant,
                },
                panelClass: ['overflow-y-auto', 'h-4/5'],
            })
            .afterClosed()
            .subscribe((result) => {
                if (!deepEqual(result, this.restaurant) && result) {
                    this.restaurant = result;
                }
            });
    }

    get coverImage(): string {
        return (
            this.restaurant?.coverPhotoUri ||
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }

    get showEdit(): boolean {
        return (
            this.userService.getCurrentRole() === UserRole.ADMIN &&
            this.restaurant?.ownerId === this.userService.currentUser()?.uid
        );
    }
}
