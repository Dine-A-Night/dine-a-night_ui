import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Restaurant } from 'src/app/models/restaurant';
import { RestaurantsService } from 'src/app/services/restaurants.service';

@Component({
    selector: 'restaurant-details-page',
    templateUrl: './restaurant-details-page.component.html',
    styleUrls: ['./restaurant-details-page.component.scss'],
})
export class RestaurantDetailsPageComponent implements OnInit, OnDestroy {
    // Services
    activatedRoute = inject(ActivatedRoute);
    restaurantService = inject(RestaurantsService);

    // Props
    paramSubscription: Subscription;
    restaurant: Restaurant;

    ngOnInit(): void {
        this.paramSubscription = this.activatedRoute.params.subscribe(
            (params) => {
                const restaurantId = params['id'];

                console.log(restaurantId);

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

    get coverImage() {
        return (
            this.restaurant?.coverPhotoUri ??
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }
}
