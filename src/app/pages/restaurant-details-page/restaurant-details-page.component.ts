import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
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
    // Services
    activatedRoute = inject(ActivatedRoute);
    restaurantService = inject(RestaurantsService);
    userService = inject(UserService);
    dialog = inject(MatDialog);

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

    onEditClick() {
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
                console.log(result);

                if (!deepEqual(result, this.restaurant) && result) {
                    this.restaurant = result;
                }
            });
    }

    get coverImage() {
        return (
            this.restaurant?.coverPhotoUri ??
            RestaurantsService.DEFAULT_COVER_PHOTO_URI
        );
    }

    get showEdit() {
        return this.userService.getCurrentRole() === UserRole.ADMIN;
    }
}
