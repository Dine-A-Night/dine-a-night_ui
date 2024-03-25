import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant.model';
import { UserRole } from 'src/app/models/user.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { UserService } from 'src/app/services/user.service';

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
    ) {}

    paramSubscription: Subscription;
    restaurant: Restaurant;
    cuisines: string[];

    ngOnInit(): void {
        this.paramSubscription = this.activatedRoute.params.subscribe(
            (params) => {
                const restaurantId = params['id'];

                if (restaurantId) {
                    this.restaurantService
                        .getRestaurantById(restaurantId)
                        .subscribe((restaurant: Restaurant) => {
                            this.restaurant = restaurant;
                        });
                }
            },
        );
    }

    ngOnDestroy(): void {
        this.paramSubscription.unsubscribe();
    }

    restaurantUpdated(restaurant: Restaurant) {
        this.restaurant = new Restaurant(restaurant);
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
