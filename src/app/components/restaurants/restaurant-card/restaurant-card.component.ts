import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from 'src/app/models/restaurant.model';
import { RestaurantsService } from 'src/app/services/restaurants.service';
import { ConfirmDialogComponent } from '../../reusables/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'restaurant-card',
    templateUrl: './restaurant-card.component.html',
    styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent {
    @Input() restaurant: Restaurant;
    private DEFAULT_COVER_PHOTO_URL = 'assets/images/RestaurantCover.jpg';

    dialog = inject(MatDialog);
    restaurantService = inject(RestaurantsService);
    notificationService = inject(MatSnackBar);

    @Output() restaurantDeleted: EventEmitter<string> =
        new EventEmitter<string>();

    get coverPhoto(): string {
        return this.restaurant?.coverPhotoUri || this.DEFAULT_COVER_PHOTO_URL;
    }

    confirmDelete() {
        this.dialog
            .open(ConfirmDialogComponent, {
                data: {
                    title: 'Confirm Delete',
                    message: 'Are you sure you want to delete this restaurant?',
                },
            })
            .afterClosed()
            .subscribe((result: boolean) => {
                if (result) {
                    // Delete Logic Here
                    this.restaurantService
                        .deleteRestaurant(this.restaurant._id)
                        .subscribe({
                            next: (res) => {
                                this.notificationService.open(
                                    `Successfully deleted restaurant ${this.restaurant.name}`,
                                    'Ok',
                                    {
                                        duration: 3000,
                                        panelClass: ['success-snackbar'],
                                    },
                                );

                                this.restaurantDeleted.emit(
                                    this.restaurant._id,
                                );
                            },
                            error: (err) => {
                                this.notificationService.open(
                                    'Unable to delete the restaurant!',
                                    'Oops',
                                    {
                                        duration: 3000,
                                        panelClass: ['fail-snackbar'],
                                    },
                                );

                                console.error(err);
                            },
                        });
                }
            });
    }
}
